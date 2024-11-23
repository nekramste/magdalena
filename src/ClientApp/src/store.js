import { createStore } from 'vuex'
import config from './common/config'
import moment from 'moment';
import "moment-timezone";

const SCORES = 'SCORES'
const CHECK_EVERY_MINUTES = 1;
const HOURS_TO_DELETE = 0.5;
const MINUTES_TO_DELETE = HOURS_TO_DELETE*60;
const CHECK_ALIVE_EVERY_SECONDS = 5;
const TIME_TO_WAIT_FOR_ACTIVE = 40;

const protocol = location.protocol === "https:" ? "wss:" : "ws:";
const wsUri = config.IS_PRODUCTION?`${config.WS_URL}/scores` : protocol + "//" + window.location.host + '/scores';

async function tryReady(id) {  
  let user = '-----';
  try {
    var uri = `${config.API_URL}/connection/ready/${id}`
    await fetch(uri)
    .then(response=>response.json())
    .then(data=>{ user = data.context.user; })
    return user;
  } catch (err) {
    console.log('error')
    console.log(err)    
  }
  return null;
}

export default createStore({
    state: {

        socket: null,

        scores_all: [],
        scores_graded: [],
        id: '',
        keep_checking: true,

        sports: [],
        selectedSports: [],
        
        isNavOpen: false,
        selectedOption: '',

        user: '-----',
        viewModeFull: false,

        alive: true,
        dateTimeToDisconect: null,

        started: false

    },
    mutations: {
      async [SCORES](state, obj) {        

        let data = obj.score.includes('{')?(JSON.parse(obj.score)):obj.score;
        let score = obj.score.includes('{')?(JSON.parse(obj.score)):null;

        state.started = true;

        if(Object.prototype.hasOwnProperty.call(data, 'message')){
          state.alive = true;
          state.dateTimeToDisconect = moment(moment(data.time)).add(TIME_TO_WAIT_FOR_ACTIVE, 'seconds').format();
        }else{
                    
          if (score) {

            let index = state.scores_all.findIndex(item => (item.Header.EventNumber === score.Header.EventNumber &&
                                                            item.Header.ExternalGameNumber === score.Header.ExternalGameNumber &&
                                                            item.Header.Source === score.Header.Source
                                                  ))
            
            /* if(score.CurrentScore.Status === 'Graded'){
              console.log('A********received*************A');
              console.log(score)
              console.log('B********received*************B');
            }else{          
              console.log('OMITIR');
              console.log(score)
            } */
          
            if(index>=0){
              //Move to grade queue
              if(score.CurrentScore.Status === 'Graded' && score.CurrentScore.Period.Number === 0){                        
                
                let index_graded = state.scores_graded.findIndex(item => (item.Header.EventNumber === score.Header.EventNumber &&
                            item.Header.ExternalGameNumber === score.Header.ExternalGameNumber &&
                            item.Header.Source === score.Header.Source));

                if(!(index_graded>=0)){
                  score['toDelete'] = true;
                  score['remainingTimeToDelete'] = MINUTES_TO_DELETE;
                  state.scores_graded.push(JSON.parse(JSON.stringify(score)));
                }
                
                state.scores_all.splice(index,1);
              }else{

                let index_graded = state.scores_graded.findIndex(item => (item.Header.EventNumber === score.Header.EventNumber &&
                  item.Header.ExternalGameNumber === score.Header.ExternalGameNumber &&
                  item.Header.Source === score.Header.Source));

                if(!(index_graded>=0)){  
                  if(score.Header.EventNumber > 0){                  
                    let condition = (score.Scores && score.Scores[0].IsFinal)                
                    score['toDelete'] = condition;
                    score['remainingTimeToDelete'] = (score['remainingTimeToDelete'] && score['remainingTimeToDelete']>=0)? score['remainingTimeToDelete']:MINUTES_TO_DELETE;
                  }else{
                    score['toDeleteWithDate'] = true;
                    score['dateToDelete'] = state.scores_all[index].dateToDelete;
                  }
                }
                state.scores_all.splice(index, 1, JSON.parse(JSON.stringify(score)))
              }

            }else{
              //Insert into grade queue
              if(score.CurrentScore.Status === 'Graded' && score.CurrentScore.Period.Number === 0){                            
                score['toDelete'] = true;
                score['remainingTimeToDelete'] = MINUTES_TO_DELETE;
                state.scores_graded.push(JSON.parse(JSON.stringify(score)));
              }else{            
                if(score.Header.EventNumber > 0){
                  let condition = (score.Scores && score.Scores.length>0 && score.Scores[0].IsFinal);
                  score['toDelete'] = condition;
                  score['remainingTimeToDelete'] = condition?MINUTES_TO_DELETE:0;
                }else{
                  score['toDeleteWithDate'] = true;
                  score['dateToDelete'] = moment(moment(score.RequestDate)).add(MINUTES_TO_DELETE, 'minutes').format();
                }
                state.scores_all.push(JSON.parse(JSON.stringify(score)))
              }      
            }        

            if(!(state.sports.findIndex(sport => score.Header.SportType === sport)>-1)){
              if(score.Header.SportType){
                state.sports.push(score.Header.SportType);
              }
            }        

          }else{ 
            // FIRST CONNECTION
            // GET ID
            if(data){
              const id = data.split(' ')[0];
              state.id = id;
              state.user = await tryReady(id);
              if(!state.user){state.user = '-----'}
            }
          }
        }
      },      
      setIsNavOpen(state) {
        state.isNavOpen = true;
      },
      toggleNav(state) {
        state.isNavOpen = !state.isNavOpen;
      },
      setSelected(state,option) {
        state.selectedOption = option;
      },      
      setSelectedSports(state,sports) {
        state.selectedSports = sports;
      },
    },
    actions: {
      setReceivedScore ({ commit }, obj) {
        commit(SCORES, obj)
      },
      async startCleaner({ state }) {        
        while (state.keep_checking) {
          await new Promise(resolve => setTimeout(resolve, CHECK_EVERY_MINUTES*60*1000));     
          let index = 0;
          state.scores_all.forEach(element => {
            
            if(element.toDelete){element.remainingTimeToDelete--;}            

            if(element.toDelete && element.remainingTimeToDelete <= 0){
              /* console.log('se borra por status')
              console.log(element) */
              state.scores_all.splice(index,1);
            }
            
            if(element.toDeleteWithDate && moment(moment().format()).isAfter(moment(element.dateToDelete).format())){
              /* console.log('se borra por fecha')
              console.log(element)
              console.log(moment(element.dateToDelete).isAfter(moment().format())) */
              state.scores_all.splice(index,1);
            }

            index++;
          });

          index = 0;

          state.scores_graded.forEach(element => {
            if(element.toDelete){element.remainingTimeToDelete--;}
            if(element.toDelete && element.remainingTimeToDelete <= 0){ state.scores_graded.splice(index,1); }
            index++;
          }); 
        }
      },
      async keepAlive({ state, dispatch }) {
        while (state.keep_checking) {
          await new Promise(resolve => setTimeout(resolve, CHECK_ALIVE_EVERY_SECONDS*1000));
          if(moment(moment().format()).isAfter(moment(state.dateTimeToDisconect).format())){
            state.alive = false;  
            console.log('delayd response detected...')
            //state.user = await tryReady(state.id);
            dispatch('tryRestartConnection',0);
          }
        }
      },
      setSelected({ commit },option) { 
        commit('setSelected',option);
      },
      setSelectedSports({ commit },sports) { 
        commit('setSelectedSports',sports);
      },
      setViewModeFull({ state },mode){
        state.viewModeFull =  mode;
      },
      tryRestartConnection({dispatch},waitTime){
        console.log('try connecting...')
        setTimeout(() => {dispatch('startConnection')},waitTime);
      },
      openSocket({state}){
        state.socket = null;
        state.socket = new WebSocket(wsUri);
      },
      closeSocket({state}){
        if(state.socket){
          state.socket.close();
          state.socket = null;
        }            
      },
      async startConnection({state,dispatch}){

        try{

          dispatch('openSocket');
          
          state.socket.onmessage = function (event) {
            state.alive = true;            
            var incomingScore = event.data;
            state.dateTimeToDisconect = moment(moment(new Date())).add(TIME_TO_WAIT_FOR_ACTIVE, 'seconds').format();
            console.log('incomming message/score');
            console.log(incomingScore);
            dispatch('setReceivedScore',{score: incomingScore});
          };

          state.socket.onerror = function() {
            state.alive = false;
            console.log('connection fail detected!!!')
            if(!state.started){
              dispatch('closeSocket')
              dispatch('tryRestartConnection',10000);
            }
          };

        }catch(error){
          console.log(error);
        }
      }
    }
})