//import * as Vue from 'vue'
//import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import config from './common/config'

//const constants = {MOBILE_SIZE:991.98, MOBILE_SIZE_XSM:415,MOBILE_SIZE_SM:505}

//const SIZE_LG = 992;
//const SIZE_XL = 1200;

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
        
            // ALL
            if (score) {
              let index = state.scores_all.findIndex(item => item.Header.EventNumber === score.Header.EventNumber)
              if(index>-1){
                state.scores_all.splice(index, 1, score)
              }else{        
                state.scores_all.push(score)
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

/* Vue.mixin({  
    data() { return {isOnMobile_: false,isOnMobileSM_: false, isOnMobileXSM_: false, isOnXL_: false} },
    computed: {              
                isOnMobile: function() {return this.isOnMobile_;},
                isOnMobileSM: function() {return this.isOnMobileSM_;},
                isOnMobileXSM: function() {return this.isOnMobileXSM_;},
                isOnXL: function() {return this.isOnXL_;}
              },
    methods: { 
                onResize () { this.isOnMobile_ = (window.innerWidth <= constants.MOBILE_SIZE);
                              this.isOnMobileSM_ = (window.innerWidth <= constants.MOBILE_SIZE_SM);
                              this.isOnMobileXSM_ = (window.innerWidth <= constants.MOBILE_SIZE_XSM);
                              this.isOnXL_ = ((SIZE_LG < window.innerWidth) & (window.innerWidth <= SIZE_XL))?true:false;
                            }              
    },
    created() {window.addEventListener('resize', this.onResize);},
    unmounted() {window.removeEventListener('resize', this.onResize );},
    mounted(){ this.onResize();}
  }); */

createApp(App).use(router).use(store).mount('#app');
