import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
  options: {
    customProperties: true,
  },
    themes: {
      light: {
        primary: '#11bac0',
        secondary: '#d9782c',
        accent: '#EE4A44',
      }
    }
  },
});
