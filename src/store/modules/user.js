import axios from 'axios';
import defaultImage from '../../assets/discord-logo.png';
import { sortByKey } from '../../helpers/util';

// initial state
const getDefaultState = () => {
  return {
    access_token: '',
    expires_in: 0,
    refresh_token: '',
    scope: '',
    token_type: '',
    id: '',
    username: '',
    avatar: '',
    guilds: [],
    guildsWithBloop: []
  };
};

const state = getDefaultState();

// getters
const getters = {
  getUserGuildIds(state) {
    return state.guilds.map(g => g.id);
  }
};

// actions
const actions = {
  resetState({ commit }) {
    commit('resetState');
    commit('guild/resetState', null, { root: true });
  },
  setToken({ commit }, token) {
    // send token to backend to validate future requests
    localStorage.token = JSON.stringify(token);
    axios.post(`${import.meta.env.VITE_API}/setToken`, token).catch(e => {
      console.log('e', e);
    });
    commit('setToken', token);
  },
  getUserDetails({ commit, dispatch, state }) {
    // fetch the user data
    return axios
      .get('https://discordapp.com/api/users/@me', {
        headers: { Authorization: `Bearer ${state.access_token}` }
      })
      .then(res => {
        localStorage.id = res.data.id;
        commit('setUserDetails', res.data);
      })
      .catch(e => {
        console.log('get user error', e);
      })
      .finally(() => {
        return dispatch('getUserGuilds');
      });
  },
  getUserGuilds({ commit, state }) {
    return axios
      .get('https://discordapp.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${state.access_token}` }
      })
      .then(res => {
        commit(
          'setUserGuilds',
          res.data.map(g => {
            let link = defaultImage;
            if (g.icon) {
              link = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.jpg`;
            }
            return {
              ...g,
              image: link
            };
          })
        );
      })
      .catch(e => {
        console.log('get guilds error', e);
      });
  },
  setUserGuildsWithBloop({ commit, state }, guildIdsWithBloop) {
    let filteredGuilds = state.guilds.filter(g =>
      guildIdsWithBloop.includes(g.id)
    );
    let sortedGuilds = sortByKey(filteredGuilds, 'name');
    commit('setUserGuildsWithBloop', sortedGuilds);
  }
};

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  setToken(state, token) {
    state.access_token = token.access_token;
    state.expires_in = token.expires_in;
    state.refresh_token = token.refresh_token;
    state.scope = token.scope;
    state.token_type = token.token_type;
  },
  setUserDetails(state, user) {
    state.id = user.id;
    state.username = user.username;
    state.avatar = user.avatar;
  },
  setUserGuilds(state, guilds) {
    state.guilds = guilds;
  },
  setUserGuildsWithBloop(state, guilds) {
    state.guildsWithBloop = guilds;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
