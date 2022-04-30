import { createStore } from "vuex";

export const sidebar = createStore({

    namespaced: true,

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

});