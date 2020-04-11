<template>
  <div>
    <v-app-bar
      app
      color="primary darken-2"
      dark
      short
      class="pr-0"
    >
        <v-app-bar-nav-icon @click.stop="$emit('drawer')">
        </v-app-bar-nav-icon>

      <v-toolbar-title>Yaome</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-sm-flex" style="position:absolute;left:50%;transform:translateX(-50%);">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="$emit('maxRender')"
            >
              <v-icon large>mdi-chevron-double-left</v-icon>
            </v-btn>
          </template>
          <span>Maximize <strong>render</strong> panel</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="$emit('centerPanels')"
            >
              <!-- <v-icon large>mdi-format-horizontal-align-center</v-icon> -->
              <v-icon large>mdi-power-on</v-icon>
            </v-btn>
          </template>
          <span>Make panels <strong>even</strong></span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="$emit('maxEdit')"
            >
              <v-icon large>mdi-chevron-double-right</v-icon>
            </v-btn>
          </template>
          <span>Maximize <strong>edit</strong> panel</span>
        </v-tooltip>
      </div>
      <v-spacer></v-spacer>

      <v-btn
        class="d-none d-md-flex mx-1"
        id="star-github"
        rounded
        text
        large
        href="https://github.com/milesial/yaome"
        target="_blank"
      >
          <v-icon dark class="mr-2">mdi-star-face</v-icon>
        Star on github!
      </v-btn>
      <v-divider vertical dark></v-divider>
      <v-dialog
        v-if="!store.logged"
        v-model="loginDialog"
        max-width="600px"
        scrollable
        :fullscreen="$vuetify.breakpoint.xsOnly"
        :transition="$vuetify.breakpoint.xsOnly ? 'dialog-bottom-transition' : 'dialog-transition'">
        <template v-slot:activator="{ on  }">
          <v-btn
            class="ml-4"
            v-on="on"
            id="signin"
            large
            outlined
            right
            rounded
          >
            <v-icon dark class="mr-2">mdi-login</v-icon>
            Sign in
          </v-btn>
        </template>
        <Login
          :opened="loginDialog"
          @close="loginDialog=false"
          @login="onLogin"
        />
      </v-dialog>
      <v-btn
        v-if="store.logged"
        class="ml-4"
        id="logout"
        href="/logout"
        large
        right
        text
        rounded
      >
        <v-icon dark class="mr-2">mdi-logout</v-icon>
        Sign out
      </v-btn>
    </v-app-bar>
  </div>
</template>


<script>
import store from '../store.js'
import Login from './Login'

export default {
  components: { Login },
  props: ['miniDrawer'],
  data: () => ({
    store: store.data,
    loginDialog: false,
  }),
  methods: {
    onLogin: function(name) {
      this.$emit('success', `Hello ${name} !`)
    }
  }
}
</script>

<style scoped>
#signin {
  box-sizing: border-box;
}

</style>
