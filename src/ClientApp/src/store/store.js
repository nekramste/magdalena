import { createStore } from "vuex";
import config from '../common/config'

async function notifyInit(id){
    try {
        var uri = `${config.API_URL}/connection/ready/${id}`
        fetch(uri).then(response => response.json())
    } catch (err) {
        console.log(err)
    }
}

const CHECK_EVERY_MINUTES = 1;
const MINUTES_TO_REMOVE = 10;

const sidebar = {

    state () {
        return {
            isNavOpen: false,
            selectedOption: ''
        }
    },
    mutations: {
        setIsNavOpen(state) {
            state.isNavOpen = true;
        },
        toggleNav(state) {
            state.isNavOpen = !state.isNavOpen;
        },
        setSelected(state,option) {
            state.selectedOption = option;
        }
    },
    actions: {
        setSelected({ commit },option) { 
            commit('setSelected',option);
        }
    }

};

const scores = {    

    state () {
        return {
          scores_all: [],
          scores_graded: [],
          id: '',
          keep_checking: true
        }
      },
      mutations: {
          
        scores_manager(state, obj) {
  
          let data = obj.score.includes('{')?(JSON.parse(obj.score)):obj.score
          let score = obj.score.includes('{')?(JSON.parse(obj.score)):null
  
          //console.log(score)
      
          // ALL
          if (score) {
  
            let index = state.scores_all.findIndex(item => (item.Header.EventNumber === score.Header.EventNumber &&
                                                            item.Header.ExternalGameNumber === score.Header.ExternalGameNumber &&
                                                            item.Header.Source === score.Header.Source
                                                  ))
            if(index>-1){
  
              if(!('toDelete' in state.scores_all[index])){
                score['toDelete'] = (score.CurrentScore.Status === 'Graded');
                score['remainingTime'] = (score.CurrentScore.Status === 'Graded')?MINUTES_TO_REMOVE:0;
              }
  
              state.scores_all.splice(index, 1, JSON.parse(JSON.stringify(score)))
            }else{
              
              score['toDelete'] = (score.CurrentScore.Status === 'Graded');
              score['remainingTime'] = (score.CurrentScore.Status === 'Graded')?MINUTES_TO_REMOVE:0;            
  
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
          commit('scores_manager', obj)
        },
        async startCleaner({ state }) {        
          while (state.keep_checking) {
            await new Promise(resolve => setTimeout(resolve, CHECK_EVERY_MINUTES*60*1000));     
            let index = 0;
            console.log('CHECKING FOR OLD VALUES TO MOVE')
            state.scores_all.forEach(element => {
              if(element.toDelete){element.remainingTime--;}
              if(element.toDelete && element.remainingTime <= 0){
                console.log('Moved')
                console.log(element)
                state.scores_graded.push(JSON.parse(JSON.stringify(element)));
                state.scores_all.splice(index,1); 
              }
              index++;
            });          
          }
        }
      }

};

export const store = new createStore({    
    modules: {
        scores: scores,
        sidebar: sidebar
    }    
});


