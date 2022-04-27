<template>
  <div>
    <h1>Authorizing...</h1>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: 'AuthHandler',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    if (route.query.code) {
      axios
        .post(`${import.meta.env.VITE_API}/getToken?code=${route.query.code}`)
        .then(res => {
          store.dispatch('user/setToken', res.data);
        })
        .catch(e => {
          console.log('eeee', e);
        })
        .finally(() => {
          router.replace('/');
        });
    }
  }
};
</script>
