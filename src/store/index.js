import { createStore, createLogger } from 'vuex';
import user from './modules/user';
import guild from './modules/guild';

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
  modules: {
    user,
    guild
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
