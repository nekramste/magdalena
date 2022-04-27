//import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import config from './common/config'
import globalMixin from './globalMixin'

async function notifyInit(id){
    try {
        var uri = `${config.API_URL}/connection/ready/${id}`
        fetch(uri).then(response => response.json())
    } catch (err) {
        console.log(err)
    }
}

const SCORES = 'SCORES'
const CHECK_EVERY_MINUTES = 1;
const MAX_TIME_MINUTES = 10;

const store = createStore({
    state () {
      return {
        scores_all: [],
        id: '',
        keep_checking: true
      }
    },
    mutations: {
      [SCORES](state, obj) {

        let data = obj.score.includes('{')?(JSON.parse(obj.score)):obj.score
        let score = obj.score.includes('{')?(JSON.parse(obj.score)):null

        //console.log(score)
    
        // ALL
        if (score) {

          let index = state.scores_all.findIndex(item => item.Header.EventNumber === score.Header.EventNumber)
          if(index>-1){

            if(!state.scores_all[index].score['toDelete']){
              score['toDelete'] = (score.CurrentScore.Status === 'Graded');
              score['remainingTime'] = (score.CurrentScore.Status === 'Graded')?MAX_TIME_MINUTES:0;
            }

            state.scores_all.splice(index, 1, JSON.parse(JSON.stringify(score)))
          }else{

            score['toDelete'] = (score.CurrentScore.Status === 'Graded');
            score['remainingTime'] = (score.CurrentScore.Status === 'Graded')?MAX_TIME_MINUTES:0;

            state.scores_all.push(JSON.parse(JSON.stringify(score)))
          }
        }else{ // FIRST CONNECTION - GET ID
          state.id = data.split(' ')[0];
          notifyInit(state.id)
          console.log(state.id);
        }
      }      
    },
    actions: {
      setReceivedScore ({ commit }, obj) {
        commit(SCORES, obj)
      },
      async startCleaner({ state }) {        
        while (state.keep_checking) {
          await new Promise(resolve => setTimeout(resolve, CHECK_EVERY_MINUTES*60*1000));     
          let index = 0;
          console.log('CHECKING FOR OLD VALUES TO REMOVE')
          state.scores_all.forEach(element => {
            if(element.toDelete){element.remainingTime--;}
            if(element.toDelete && element.remainingTime <= 0){
              console.log('Removed')
              console.log(element)
              state.scores_all.splice(index,1); 
            }
            index++;
          });          
        }
      }
    }
})

createApp({
  extends: App,
  mixins: [globalMixin],
  components: {}
}).use(router).use(store).mount('#app');
