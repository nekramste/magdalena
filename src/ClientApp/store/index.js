import Vue from 'vue'
import Vuex from 'vuex'
import config from  '../common/config.js'

Vue.use(Vuex)

async function notifyInit(id){
  try {
    var uri = `${config.API_URL}/connection/ready?connectionId=${id}`;    
    fetch(uri).then(response => response.json())
  } catch (err) {
    console.log(err)
  }
}

const SCORES = 'SCORES'

const state = {
  scores_all: [],
  id: ''
}

const mutations = {
  [SCORES](state, obj) {

    let data = obj.score.includes('{')?(JSON.parse(obj.score)):obj.score;
    let score = obj.score.includes('{')?(JSON.parse(obj.score)):null;

    console.log(score)

    // ALL
    if (score) {
      let index = state.scores_all.findIndex(item => item.Header.EventNumber === score.Header.EventNumber);
      if(index>-1){
        state.scores_all.splice(index, 1, score);        
      }else{        
        state.scores_all.push(score);        
      }      
    }else{ // FIRST CONNECTION - GET ID
      state.id = data.split(' ')[0];
      notifyInit(state.id)
      console.log(state.id);
    }    

  }
}

const actions = ({
  setReceivedScore ({ commit }, obj) {
    commit(SCORES, obj)
  }
})

export default new Vuex.Store({
  state,
  mutations,
  actions
})
