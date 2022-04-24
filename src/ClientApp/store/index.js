import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const SCORES = 'SCORES'

const state = {
  scores: []
}

const mutations = {
  [SCORES](state, obj) {

    let score = obj.score.includes('{')?JSON.parse(obj.score):null;
    if(score){
      let index = state.scores.findIndex(item => item.Message.Header.ExternalGameNumber === score.Message.Header.ExternalGameNumber);
      if(index>-1){
        state.scores[index]=JSON.parse(obj.score);
      }else{
        state.scores.push(JSON.parse(obj.score));
      }
      console.log(JSON.parse(obj.score))
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
