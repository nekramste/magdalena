import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const SCORES = 'SCORES'

const state = {
  scores: [],
  scores_other: [],
  sports: []
}

const mutations = {
  [SCORES](state, obj) {

    console.log('score')
    console.log(obj)

    let score = obj.score.includes('{')?(JSON.parse(obj.score)):null;
    
    if(score && score.Message.Header.EventNumber !== 0){
      let index = state.scores.findIndex(item => item.Message.Header.ExternalGameNumber === score.Message.Header.ExternalGameNumber);
      if(index>-1){
        state.scores[index]=score;
      }else{
        if(!(state.sports.findIndex(sport => score.Message.Header.SportType === sport)>-1)){
          if(score.Message.Header.SportType){
            state.sports.push(score.Message.Header.SportType);
          }
        }
        if(score.Message.Header.EventNumber === 0){
          state.scores_other.push(score);
        }
      }      
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
