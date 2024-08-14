import axios from 'axios';
import { sortByKey } from '@/helpers/util';
import { defineStore } from 'pinia';
import { useGuildStore } from '@/stores/guild';

export const useUserStore = defineStore('user', {
  state: () => {
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
      guildsWithBloop: [],
      favoriteSounds: [],
      entrance: ''
    };
  },
  getters: {
    getUserGuildIds: state => {
      return state.guilds.map(g => g.id);
    }
  },

  // login process:  setToken -> getUserDetails -> getUserGuilds -> setUserGuildsWithBloop -> getSounds
  actions: {
    setToken(token) {
      // send token to backend to validate future requests
      localStorage.token = JSON.stringify(token);
      return axios
        .post(`${import.meta.env.VITE_API}/setToken`, token)
        .then(dbUser => {
          this.access_token = token.access_token;
          this.expires_in = token.expires_in;
          this.refresh_token = token.refresh_token;
          this.scope = token.scope;
          this.token_type = token.token_type;
          this.entrance = dbUser.data.entrance.enabled
            ? dbUser.data.entrance.sound
            : null;
          this.setFavoriteSounds(dbUser.data.favorites);
          localStorage.id = dbUser.data.userId;
          this.id = dbUser.data.userId;
          this.username = dbUser.data.username;
          this.avatar = dbUser.data.avatar;
          this.guilds = dbUser.data.guilds;
          const guildStore = useGuildStore();
          guildStore.getSounds();
          this.setUserGuilds();
        })
        .catch(e => {
          console.log('e', e);
        });
    },
    setUserGuilds() {
      axios
        .post(
          `${import.meta.env.VITE_API}/servers`,
          {
            guilds: this.guilds.map(g => g.id)
          },
          {
            headers: {
              Authorization: JSON.stringify({
                id: this.id,
                access_token: this.access_token
              })
            }
          }
        )
        .then(res => {
          this.setUserGuildsWithBloop(res.data);
        })
        .catch(e => {
          console.log('get servers errors', e);
        });
    },
    setUserGuildsWithBloop(guildIdsWithBloop) {
      let filteredGuilds = this.guilds.filter(g =>
        guildIdsWithBloop.includes(g.id)
      );
      let sortedGuilds = sortByKey(filteredGuilds, 'name');
      this.guildsWithBloop = sortedGuilds;
    },
    setFavoriteSounds(sounds) {
      this.favoriteSounds = sounds;
    }
  }
});
