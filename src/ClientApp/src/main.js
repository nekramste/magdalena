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

const store = createStore({
    state () {
      return {
        scores_all: [],
        id: ''
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
              state.scores_all.splice(index, 1, JSON.parse(JSON.stringify(score)))
            }else{
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
      }
    }
})

createApp({
  extends: App,
  mixins: [globalMixin],
  components: {}
}).use(router).use(store).mount('#app');
