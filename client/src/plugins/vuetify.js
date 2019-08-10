import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
  options: {
    customProperties: true,
  },
    themes: {
      light: {
        primary: '#11bac0',
        secondary: '#1AE3EA',
        accent: '#EE4A44',
      }
    }
  },
});
