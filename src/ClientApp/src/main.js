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
const MINUTES_TO_MOVE = 10;
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
        
          if(index>=0){

            if(!('toRemove' in state.scores_all[index])){
              score['toRemove'] = (score.CurrentScore.Status === 'Graded');
              score['remainingTime'] = (score.CurrentScore.Status === 'Graded')?MINUTES_TO_MOVE:0;
            }

            if(score.Header.EventNumber > 0){  
              if(!('toDelete' in state.scores_all[index])){
                score['toDelete'] = (score.Scores &&  score.Scores[0].IsFinal);
                score['remainingTimeToDelete'] = (score.Scores && score.Scores[0].IsFinal)?MINUTES_TO_DELETE:0;
              }
            }else{
              if(!('toDeleteWithDate' in state.scores_all[index])){
                score['toDeleteWithDate'] = true;
                score['dateToDelete'] = moment(score.RequestDate).add(MINUTES_TO_DELETE, 'minutes');
              }
            }            

            state.scores_all.splice(index, 1, JSON.parse(JSON.stringify(score)))

          }else{
            
            score['toRemove'] = (score.CurrentScore.Status === 'Graded');
            score['remainingTime'] = (score.CurrentScore.Status === 'Graded')?MINUTES_TO_MOVE:0;   
            
            if(score.Header.EventNumber > 0){
              score['toDelete'] = (score.Scores && score.Scores.length>0 && score.Scores[0].IsFinal);
              score['remainingTimeToDelete'] = (score.Scores &&  score.Scores[0].IsFinal)?MINUTES_TO_DELETE:0;
            }else{
              score['toDeleteWithDate'] = true
              score['dateToDelete'] = moment(score.RequestDate).add(MINUTES_TO_DELETE, 'minutes');
            }

            state.scores_all.push(JSON.parse(JSON.stringify(score)))
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

            if(element.toRemove){element.remainingTime--;}
            if(element.toDelete){element.remainingTimeToDelete--;}

            if(element.toRemove && element.remainingTime <= 0){              
              state.scores_graded.push(JSON.parse(JSON.stringify(element)));
              state.scores_all.splice(index,1); 
            }

            if(element.toDelete && element.remainingTimeToDelete <= 0){
              state.scores_all.splice(index,1);
            }
            
            if(element.toDeleteWithDate && moment(element.dateToDelete).isAfter(moment())){
              state.scores_all.splice(index,1);
            }

            index++;
          });

          index = 0;

          state.scores_graded.forEach(element => {
            
            if(element.toDelete){element.remainingTimeToDelete--;}
            if(element.toDelete && element.remainingTimeToDelete <= 0){
              state.scores_graded.splice(index,1);
            }

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