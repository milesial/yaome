<template>
  <div>
    <v-app-bar
      app
      color="primary darken-2"
      dark
      clipped-left
      short
      class="pr-0"
    >
      <v-app-bar-nav-icon @click="$emit('drawer')"></v-app-bar-nav-icon>
      <v-toolbar-title>Yaome</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-sm-flex" style="position:absolute;left:50%;transform:translateX(-50%);">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="$emit('maxEdit')"
            >
              <v-icon large>mdi-arrow-collapse-right</v-icon>
            </v-btn>
          </template>
          <span>Maximize edit panel</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="$emit('centerPanels')"
            >
              <!-- <v-icon large>mdi-format-horizontal-align-center</v-icon> -->
              <v-icon large>mdi-drag-vertical</v-icon>
            </v-btn>
          </template>
          <span>Make panels even</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="$emit('maxRender')"
            >
              <v-icon large>mdi-arrow-collapse-left</v-icon>
            </v-btn>
          </template>
          <span>Maximize render panel</span>
        </v-tooltip>
      </div>
      <v-spacer></v-spacer>

      <v-btn
        class="d-none d-md-flex"
        id="star-github"
        rounded
        text
        large
        href="https://github.com/milesial/yaome"
        target="_blank"
      >
        <v-icon dark class="mr-2">mdi-star</v-icon>
        Star us on github
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
  data: () => ({
    store,
    loginDialog: false
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
