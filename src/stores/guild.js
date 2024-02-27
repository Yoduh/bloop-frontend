import axios from 'axios';
import { defineStore } from 'pinia';
import { useUserStore } from '@/stores/user';

export const useGuildStore = defineStore('guild', {
  state: () => ({
    id: '',
    name: '',
    avatar: '',
    channels: [],
    selectedChannel: '',
    sounds: []
  }),
  // actions
  actions: {
    setGuild(guild) {
      const userStore = useUserStore();
      const userGuild = userStore.guilds.find(g => g.id === guild.id);
      this.id = userGuild.id;
      this.name = userGuild.name;
      this.avatar = `https://cdn.discordapp.com/icons/${userGuild.id}/${userGuild.icon}.jpg`;
    },
    setChannels(channels) {
      this.channels = channels;
    },
    setSelectedChannel(channel) {
      this.selectedChannel = channel;
    },
    // this is a guild action for one day when sounds are tied to specific servers...
    getSounds() {
      const userStore = useUserStore();
      return axios
        .get(`${import.meta.env.VITE_API}/sounds`, {
          headers: {
            Authorization: JSON.stringify({
              id: userStore.id,
              access_token: userStore.access_token
            })
          }
        })
        .then(res => {
          const formatted = res.data.map(s => {
            return {
              ...s,
              createdAt: new Date(s.createdAt).getTime(),
              isFavorite: userStore.favoriteSounds.includes(s._id)
            };
          });
          this.sounds = formatted;
        })
        .catch(e => {
          console.log('get sounds error', e);
        });
    },
    setFavoriteSound(payload) {
      const sound = this.sounds.filter(s => s._id === payload.id)[0];
      sound.isFavorite = payload.isFavorite;
    }
  }
});
