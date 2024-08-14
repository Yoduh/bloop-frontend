<template>
  <Menubar :model="items" class="sticky top-0 left-0 w-full py-1">
    <template v-slot:start>
      <img
        alt="logo"
        src="../assets/logo.jpeg"
        height="40"
        class="hidden md:block mr-2"
        style="border-radius: 50%"
      />
    </template>
    <template v-slot:end>
      <!-- `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg` -->
      <div class="dropdown-row">
        <Dropdown
          id="serverDropdown"
          class="flex align-items-center mx-3"
          v-model="selectedGuild"
          :options="user.guildsWithBloop"
          optionLabel="name"
          placeholder="Select a Server"
          @change="getChannels"
        >
          <template v-slot:value="slotProps">
            <div class="guild-item guild-item-value" v-if="slotProps.value">
              <img
                :src="slotProps.value.image ?? defaultImage"
                style="border-radius: 50%"
              />
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
        <Dropdown
          id="channelDropdown"
          class="flex align-items-center"
          v-model="selectedChannel"
          :options="channels"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a Channel"
          @change="selectChannel"
        />
      </div>
      <div class="col-auto">
        <Button
          v-if="!user.id"
          label="Login"
          icon="pi pi-sign-in"
          class="p-button-text w-full"
          @click="login"
        ></Button>
        <Button
          v-else
          label="Logout"
          icon="pi pi-sign-out"
          class="p-button-text w-full"
          @click="logout"
        ></Button>
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { ref } from 'vue';
import { useGuildStore } from '@/stores/guild';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { sortByKey } from '@/helpers/util';
import defaultImage from '@/assets/discord-logo.png';

const guildStore = useGuildStore();
const user = useUserStore();
const router = useRouter();

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    to: '/'
  },
  {
    label: 'Create New Sound',
    icon: 'pi pi-fw pi-cloud-upload',
    to: '/create',
    visible: () => user.id !== ''
  },
  {
    label: 'Tutorial',
    icon: 'pi pi-fw pi-info-circle',
    to: '/help',
    visible: () => user.id !== ''
  }
]);

const channels = ref([]);
const selectedChannel = ref('');
const selectedGuild = ref(null);

const getChannels = () => {
  guildStore.setGuild(selectedGuild.value);
  channels.value = [];
  axios
    .post(
      `${import.meta.env.VITE_API}/channels`,
      {
        userId: user.id,
        guildId: selectedGuild.value.id
      },
      {
        headers: {
          Authorization: JSON.stringify({
            id: user.id,
            access_token: user.access_token
          })
        }
      }
    )
    .then(res => {
      let sortedChannels = sortByKey(res.data, 'name');
      channels.value = sortedChannels;
      guildStore.setChannels(sortedChannels);
    });
};

const selectChannel = channel => {
  guildStore.setSelectedChannel(channel.value);
};

const login = () => {
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
};
const logout = () => {
  user.$reset();
  guildStore.$reset();
  localStorage.clear();
  router.replace('/');
};
</script>

<style>
.p-menubar-root-list {
  width: auto;
}
.p-menubar-end {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.p-dropdown-panel {
  z-index: 1099 !important;
}
.p-dropdown {
  max-width: 15rem;
}
.p-dropdown-label {
  display: flex !important;
  justify-content: center;
  align-items: center;
  max-height: 51px;
  padding: 11px;
}
.p-menuitem-text {
  white-space: nowrap;
}
.guild-item {
  display: flex;
  align-items: center;
}
.guild-item img {
  width: 30px;
  margin-right: 0.5rem;
}
@media (min-width: 580px) {
  .dropdown-row {
    display: flex;
  }
}
@media (max-width: 579px) {
  .dropdown-row {
    display: block;
  }
  #channelDropdown {
    margin: 0 1rem 0 1rem;
  }
}
</style>
