//import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import config from './common/config'
import globalMixin from './globalMixin'
import moment from 'moment';
import "moment-timezone";

const SCORES = 'SCORES'
const CHECK_EVERY_MINUTES = 1;
const HOURS_TO_DELETE = 6;
const MINUTES_TO_DELETE = HOURS_TO_DELETE*60;

const store = createStore({
    state () {
      return {

        scores_all: [],
        scores_graded: [],
        id: '',
        keep_checking: true,

        sports: [],
        selectedSports: [],
        
        isNavOpen: false,
        selectedOption: '',

        user: '-----'

      }
    },
    mutations: {
      async [SCORES](state, obj) {

        let data = obj.score.includes('{')?(JSON.parse(obj.score)):obj.score;
        let score = obj.score.includes('{')?(JSON.parse(obj.score)):null;
            
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
              score['toDelete'] = true;
              score['remainingTimeToDelete'] = MINUTES_TO_DELETE;
              state.scores_graded.push(JSON.parse(JSON.stringify(score)));
              state.scores_all.splice(index,1);
            }else{
              if(score.Header.EventNumber > 0){
                let condition = (score.Scores && score.Scores[0].IsFinal)                
                score['toDelete'] = condition;
                score['remainingTimeToDelete'] = (score['remainingTimeToDelete'] && score['remainingTimeToDelete']>=0)? score['remainingTimeToDelete']:MINUTES_TO_DELETE;
              }else{
                score['toDeleteWithDate'] = true;
                score['dateToDelete'] = state.scores_all[index].dateToDelete;
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
          state.id = data.split(' ')[0];
          try {
            var uri = `${config.API_URL}/connection/ready/${state.id}`
            await fetch(uri)
            .then(response=>response.json())
            .then(data=>{
              state.user = data.context.user;
            })
          } catch (err) {
            console.log(err)
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
      setSelected({ commit },option) { 
        commit('setSelected',option);
      },
      setSelectedSports({ commit },sports) { 
        commit('setSelectedSports',sports);
      }
    }
})

const app = createApp({
  extends: App,
  mixins: [globalMixin],
  components: {}
}).use(router).use(store);

app.mount('#app');