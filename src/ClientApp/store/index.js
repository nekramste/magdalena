import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const SCORES = 'SCORES'

const state = {
  scores_all: [],
  id: ''
}

const mutations = {
  [SCORES](state, obj) {   

    let data = obj.score.includes('{')?(JSON.parse(obj.score)):obj.score;
    let score = obj.score.includes('{')?(JSON.parse(obj.score)):null;    

    // ALL
    if (score) {
      let index = state.scores_all.findIndex(item => item.Message.Header.EventNumber === score.Message.Header.EventNumber);
      if(index>-1){
        state.scores_all.splice(index, 1, score);        
      }else{        
        state.scores_all.push(score);        
      }      
    }else{ // FIRST CONNECTION - GET ID
      state.id = data.split(' ')[0];
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
