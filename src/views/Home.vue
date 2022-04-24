<template>
  <h1 class="display-2 font-weight-bold mb-3">Bloop</h1>
  <Button v-if="!user.id" label="Login" class="m-4" @click="login()"></Button>
  <Button v-else label="Logout" class="m-4" @click="logout()"></Button>
  <p>
    Choose a server and channel (only servers you and Bloop Bot share will
    appear), then send a sound bite
  </p>
  <div
    v-if="user.guilds"
    class="grid flex align-items-center justify-content-center"
    style="height: 80px"
  >
    <div class="col-2 h-full">
      <!-- `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg` -->
      <Dropdown
        class="w-full h-full flex align-items-center"
        v-model="selectedGuild"
        :options="user.guildsWithBloop"
        optionLabel="name"
        placeholder="Select a Server"
        @change="getChannels"
      >
        <template v-slot:value="slotProps">
          <div class="guild-item guild-item-value" v-if="slotProps.value">
            <img :src="slotProps.value.image" style="border-radius: 50%" />
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template v-slot:option="slotProps">
          <div class="guild-item">
            <img :src="slotProps.option.image" style="border-radius: 50%" />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>
    </div>
    <div class="col-2 h-full">
      <Dropdown
        class="w-full h-full flex align-items-center"
        v-model="selectedChannel"
        :options="channels"
        optionLabel="name"
        optionValue="id"
        placeholder="Select a Channel"
      />
    </div>
  </div>
  <div v-if="selectedChannel !== ''" class="mt-7">
    <div class="mt-4">
      Click an image below to play the sound bite in your selected channel
    </div>
    <SoundList
      :sounds="sounds"
      @playSound="playSound"
      @getSounds="getSounds()"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapActions, mapGetters } from 'vuex';
import SoundList from '../components/SoundList.vue';
import { sortByKey } from '../helpers/util';

export default {
  name: 'Home',
  components: { SoundList },
  data() {
    return {
      channels: [],
      selectedChannel: '',
      selectedGuild: null
    };
  },
  computed: {
    ...mapState({ user: state => state.user }),
    ...mapState('guild', ['sounds']),
    ...mapGetters('user', ['getUserGuildIds']),
    guildIcon(guild) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`;
    }
  },
  methods: {
    ...mapActions('user', [
      'getUserDetails',
      'setUserGuildsWithBloop',
      'resetState'
    ]),
    ...mapActions('guild', ['setGuild', 'getSounds']),
    getChannels() {
      this.setGuild(this.selectedGuild);
      this.channels = [];
      axios
        .post(
          `${import.meta.env.VITE_API}/channels`,
          {
            userId: this.user.id,
            guildId: this.selectedGuild.id
          },
          {
            headers: {
              Authorization: JSON.stringify({
                id: this.user.id,
                access_token: this.user.access_token
              })
            }
          }
        )
        .then(res => {
          this.channels = sortByKey(res.data, 'name');
        });
    },
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
    logout() {
      this.resetState();
      this.channels = [];
      this.selectedChannel = '';
      this.guildsWithBloop = [];
      this.selectedGuild = null;
      localStorage.clear();
    },
    playSound(name) {
      let payload = {
        name: name,
        guildId: this.selectedGuild.id,
        channelId: this.selectedChannel,
        username: this.user.username
      };
      axios
        .post(`${import.meta.env.VITE_API}/sound`, payload, {
          headers: {
            Authorization: JSON.stringify({
              id: this.user.id,
              access_token: this.user.access_token
            })
          }
        })
        // .then(res => {
        //   console.log('res', res);
        // })
        // toast for when bot can't play sound in empty voice channel
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
  },
  async mounted() {
    // after logging in, get user details
    if (this.user.access_token && !this.user.id) {
      await this.getUserDetails();
      // immediately get user's joined servers that also contain Bloop bot
      axios
        .post(
          `${import.meta.env.VITE_API}/servers`,
          {
            guilds: this.getUserGuildIds
          },
          {
            headers: {
              Authorization: JSON.stringify({
                id: this.user.id,
                access_token: this.user.access_token
              })
            }
          }
        )
        .then(res => {
          this.setUserGuildsWithBloop(res.data);
        })
        .catch(e => {
          console.log(e);
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
