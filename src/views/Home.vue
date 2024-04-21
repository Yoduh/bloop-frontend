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
  <div v-else class="home-container">
    <SoundGrid
      v-if="guildStore.sounds.length > 0"
      :sounds="guildStore.sounds"
      @playSound="playSound"
    />
  </div>
</template>

<script setup>
import axios from 'axios';
import SoundGrid from '@/components/SoundGrid.vue';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user';
import { useGuildStore } from '@/stores/guild';

function login() {
  window.open(
    `https://discord.com/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${import.meta.env.VITE_CLIENT_ID}&` +
      `redirect_uri=${
        import.meta.env.VITE_DOMAIN
      }/auth/redirect&display=popup&` +
      `scope=identify%20guilds%20guilds.members.read%20messages.read`,
    `_self`
  );
}

const user = useUserStore();
const guildStore = useGuildStore();
const toast = useToast();

function playSound(name) {
  if (guildStore.id === '' || guildStore.selectedChannel === '') {
    toast.add({
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
    guildId: guildStore.id,
    channelId: guildStore.selectedChannel,
    username: user.username,
    userId: user.id,
    userAvatar: user.avatar
  };
  axios
    .post(`${import.meta.env.VITE_API}/play`, payload, {
      headers: {
        Authorization: JSON.stringify({
          id: user.id,
          access_token: user.access_token
        })
      }
    })
    // error toast that includes response message
    .catch(error => {
      if (error.response?.data?.message) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.message,
          life: 3000
        });
        // toast for any other type of error
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
          life: 3000
        });
      }
    });
}
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
