<template>
  <div class="ml-2" v-if="!store.serverStatus">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <div v-on="on" class="secondary--text">
          <v-icon class="mx-2" color="secondary">mdi-alert-circle</v-icon>
        </div>
      </template>
      <span>Connection to the server lost</span>
    </v-tooltip>
  </div>
</template>

<script>
import store from '../store.js'
import axios from 'axios'

export default {
  data: () => ({
    store: store.data
  }),
  mounted: function() {
    setInterval(() => {
      axios.get('/status')
        .then(() => {
          this.store.serverStatus = true
        })
        .catch(() => {
          this.store.serverStatus = false
        })
    }, 5000)
  }
}

</script>
