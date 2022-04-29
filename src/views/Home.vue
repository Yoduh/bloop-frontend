<template>
  <div v-if="!user.id" class="home-container pt-1">
    <img
      alt="Bloop logo"
      src="../assets/logo.jpeg"
      class="mt-6"
      style="border-radius: 50%"
    />
    <h1 class="display-2 font-weight-bold mb-3">Bloop</h1>
    <Button
      label="Login"
      icon="pi pi-sign-in"
      class="m-4"
      @click="login()"
    ></Button>
  </div>
  <div v-else class="home-container pt-1">
    <SoundList
      :sounds="guild.sounds"
      @playSound="playSound"
      @getSounds="getSounds()"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import SoundList from '../components/SoundList.vue';

export default {
  name: 'Home',
  components: { SoundList },
  data() {
    return {
      channels: []
    };
  },
  computed: {
    ...mapState({ user: state => state.user }),
    ...mapState({ guild: state => state.guild })
  },
  methods: {
    ...mapActions('guild', ['getSounds']),
    login() {
      window.open(
        `https://discord.com/oauth2/authorize?` +
          `response_type=code&` +
          `client_id=964300281674346498&` +
          `redirect_uri=${
            import.meta.env.VITE_DOMAIN
          }/auth/redirect&display=popup&` +
          `scope=identify%20guilds%20guilds.members.read%20messages.read`,
        `_self`
      );
    },
    playSound(name) {
      if (this.guild.id === '' || this.guild.selectedChannel === '') {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Must choose a server AND channel in the navigation bar before sending a sound',
          life: 3000
        });
        return;
      }
      let payload = {
        name: name,
        guildId: this.guild.id,
        channelId: this.guild.selectedChannel,
        username: this.user.username,
        userId: this.user.id,
        userAvatar: this.user.avatar
      };
      axios
        .post(`${import.meta.env.VITE_API}/play`, payload, {
          headers: {
            Authorization: JSON.stringify({
              id: this.user.id,
              access_token: this.user.access_token
            })
          }
        })
        // error toast that includes response message
        .catch(error => {
          if (error.response?.data?.message) {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            });
            // toast for any other type of error
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error,
              life: 3000
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.p-dropdown {
  width: 14rem;
}
.guild-item {
  display: flex;
  align-items: center;
}
.guild-item img {
  width: 50px;
  margin-right: 0.5rem;
}
</style>
