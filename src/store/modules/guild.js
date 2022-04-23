import axios from 'axios';
// initial state
const getDefaultState = () => {
  return {
    id: '',
    name: '',
    avatar: '',
    // channels: [],
    sounds: []
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
  setGuild({ commit, dispatch, rootState }, guild) {
    let userGuild = rootState.user.guilds.find(g => g.id === guild.id);
    commit('setGuild', userGuild);
    dispatch('getSounds');
  },
  getSounds({ commit, rootState }) {
    return axios
      .get(`${import.meta.env.VITE_API}/sounds`, {
        headers: {
          Authorization: JSON.stringify({
            id: rootState.user.id,
            access_token: rootState.user.access_token
          })
        }
      })
      .then(res => {
        commit('setSounds', res.data);
      })
      .catch(e => {
        console.log('get sounds error', e);
      });
  }
};

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  setGuild(state, guild) {
    state.id = guild.id;
    state.name = guild.name;
    state.avatar = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`;
    // state.channels = guild.channels;
  },
  setSounds(state, sounds) {
    state.sounds = sounds;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
