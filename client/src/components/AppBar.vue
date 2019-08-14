<template>
  <div>
    <v-app-bar
      :collapse="collapsed"
      color="primary darken-2"
      dark
      short
      class="pr-0"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Yaome</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
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
            Sign in
          </v-btn>
        </template>
        <Login
          :opened="loginDialog"
          @close="loginDialog=false"
          @login="onLogin"
        />
      </v-dialog>
    </v-app-bar>
  </div>
</template>


<script>
import Login from './Login'

export default {
  components: { Login },
  data: () => ({
    collapsed: false,
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

@media screen and (max-width: 500px) {
  #star-github {
    display: none;
  }
}

</style>
