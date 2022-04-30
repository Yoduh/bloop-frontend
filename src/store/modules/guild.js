import axios from 'axios';
// initial state
const getDefaultState = () => {
  return {
    id: '',
    name: '',
    avatar: '',
    channels: [],
    selectedChannel: '',
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
  setGuild({ commit, rootState }, guild) {
    let userGuild = rootState.user.guilds.find(g => g.id === guild.id);
    commit('setGuild', userGuild);
  },
  setChannels({ commit }, channels) {
    commit('setChannels', channels);
  },
  setSelectedChannel({ commit }, channels) {
    commit('setSelectedChannel', channels);
  },
  // this is a guild action for one day when sounds are tied to specific servers...
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
        let formatted = res.data.map(s => {
          return { ...s, createdAt: new Date(s.createdAt).getTime() };
        });
        commit('setSounds', formatted);
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
  setChannels(state, channels) {
    state.channels = channels;
  },
  setSelectedChannel(state, channel) {
    state.selectedChannel = channel;
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
