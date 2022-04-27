<template>
  <Menubar :model="items">
    <template v-slot:start>
      <img
        alt="logo"
        src="../assets/logo.jpeg"
        height="40"
        class="mr-2"
        style="border-radius: 50%"
      />
    </template>
    <template v-slot:end>
      <Button
        v-if="!user.id"
        label="Login"
        class="p-button-text"
        @click="login"
      ></Button>
      <Button
        v-else
        label="Logout"
        class="p-button-text"
        @click="logout"
      ></Button>
    </template>
  </Menubar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const user = computed(() => store.state.user);

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    to: '/'
  },
  {
    label: 'Create New Sound',
    icon: 'pi pi-fw pi-cloud-upload',
    to: '/create'
  }
]);

const login = () => {
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
};
const logout = () => {
  this.resetState();
  this.channels = [];
  this.selectedChannel = '';
  this.guildsWithBloop = [];
  this.selectedGuild = null;
  localStorage.clear();
};
</script>
