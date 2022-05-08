// initial state
const getDefaultState = () => {
  return {
    details: null
  };
};

const state = getDefaultState();

// getters
const getters = {
  //   getUserGuildIds(state) {
  //     return state.guilds.map(g => g.id);
  //   }
};

// actions
const actions = {
  resetState({ commit }) {
    commit('resetState');
  },
  setSound({ commit }, details) {
    commit('setSound', details);
  }
};

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  setSound(state, details) {
    state.details = details;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
