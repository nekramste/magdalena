import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const SCORES = 'SCORES'

const state = {
  scores: [],
  sports: []
}

const mutations = {
  [SCORES](state, obj) {

    console.log('score')
    console.log(obj)

    let score = obj.score.includes('{')?(JSON.parse(obj.score)):null;
    
    if(score){
      let index = state.scores.findIndex(item => item.Message.Header.ExternalGameNumber === score.Message.Header.ExternalGameNumber);
      if(index>-1){
        state.scores[index]=score;
      }else{

        if(!(state.sports.findIndex(sport => score.Message.Header.SportType === sport)>-1)){
          state.sports.push(score.Message.Header.SportType);
        }

        state.scores.push(score);                        
        
      }
      console.log('score added')
      console.log(score)
      console.log('sports')
      console.log(state.sports)
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
