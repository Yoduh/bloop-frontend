import { defineStore } from 'pinia';

export const useSoundStore = defineStore('sound', {
  state: () => {
    return {
      details: null
    };
  },
  actions: {
    setSound(details) {
      this.details = details;
    }
  }
});
