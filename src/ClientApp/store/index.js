import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function replacePort(host){
  return host? host.split(':')[0]+':44328':'';
}

async function notifyInit(id){
  try {     
    var protocol = "https:";
    var uri = `${protocol}//${replacePort(window.location.host)}/connection/ready?connectionId=${id}`;    
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
