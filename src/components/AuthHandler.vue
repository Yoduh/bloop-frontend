<template>
  <div>
    <h1>Authorizing...</h1>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

export default {
  name: 'AuthHandler',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const user = useUserStore();
    if (route.query.code) {
      axios
        .post(`${import.meta.env.VITE_API}/getToken?code=${route.query.code}`)
        .then(res => {
          user.setToken(res.data);
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          router.replace('/');
        });
    }
  }
};
</script>
