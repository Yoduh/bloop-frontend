import { createStore, createLogger } from 'vuex';
import user from './modules/user';
import guild from './modules/guild';
import sound from './modules/sound';

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
  modules: {
    user,
    guild,
    sound
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
