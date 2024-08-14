import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => {
    return {
      isLoading: false
    };
  },
  actions: {
    setLoading(loadingState) {
      this.isLoading = loadingState;
    }
  }
});
