<template>
  <v-app
  >
    <AppBar
      @success="showSuccessSnackbar"
      @centerPanels="centerPanels"
      @maxEdit="maximizeEdit"
      @maxRender="maximizeRender"
      @drawer="miniDrawer = !miniDrawer"
    />
    <Files :miniDrawer="miniDrawer" @drawerChange="updatePanelsAfterDrawer"/>
    <v-content>
      <v-container grid-list-md fill-height style="max-width:100%;">
        <v-layout
          text-center>
          <v-flex class="flex-panel pr-0" ref="leftpanel">
            <v-card class="panel"><EditPanel/></v-card>
          </v-flex>
          <div id="resizer" ref="resizer"></div>
          <v-flex class="flex-panel pl-0" ref="rightpanel">
            <v-card class="panel"><RenderPanel/></v-card>
          </v-flex>
          <v-snackbar
            v-model="snackbar.show"
            bottom
            class="py-8 subtitle-1"
            :timeout="6000"
            :color="snackbar.color"
          >
            <v-icon dark v-if="snackbar.type == 'success'">mdi-check-circle</v-icon>
            <v-icon dark v-if="snackbar.type == 'info'">mdi-information</v-icon>
            <v-icon dark v-if="snackbar.type == 'error'">mdi-alert-circle</v-icon>
            <span class="ml-4" v-html="snackbar.text"></span>
            <v-btn
              dark
              text
              @click="snackbar.show = false"
            >
              Close
            </v-btn>
          </v-snackbar>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar'
import Files from './components/Files'
import RenderPanel from './components/RenderPanel'
import EditPanel from './components/EditPanel'
import store from './store.js'
import EventBus from './event-bus.js'
import axios from 'axios'

axios.interceptors.response.use(res => res, err => {
  if (err.response && err.response.data && err.response.data.error)
    return Promise.reject(err.response.data.error)
  else if (err.response && err.response.data)
    return Promise.reject(err.response.data)
  else
    return Promise.reject(err)
})

export default {
  name: 'App',
  components: {
    RenderPanel,
    EditPanel,
    AppBar,
    Files
  },
  data: () => ({
    snackbar: {
      show: false,
      text: '',
      color: '',
      type: ''
    },
    miniDrawer: false,
  }),
  computed: {
    isWrapped: function() {
      return this.$refs.rightpanel.offsetTop != this.$refs.leftpanel.offsetTop
    }
  },
  mounted: function() {
    makeResizableDiv(this.$refs.rightpanel, this.$refs.resizer)
    // fix for the pdf generation without any resizes first
    this.$nextTick(() => this.centerPanels())
    if (store.data.logged && store.data.name)
      this.showPrimarySnackbar(`Welcome ${store.data.name} !`)
    else if (store.data.logged)
      this.showPrimarySnackbar(`Welcome !`)
    else
      this.showPrimarySnackbar('Remember to sign in to save your work.')
  },
  methods: {
    showErrorSnackbar: function(text) {
      this.snackbar.text = text
      this.snackbar.color = 'error'
      this.snackbar.show = true
      this.snackbar.type = 'error'
    },
    showSuccessSnackbar: function(text) {
      this.snackbar.text = text
      this.snackbar.color = 'success'
      this.snackbar.show = true
      this.snackbar.type = 'success'
    },
    showPrimarySnackbar: function(text) {
      this.snackbar.text = text
      this.snackbar.color = 'primary darken-1'
      this.snackbar.show = true
      this.snackbar.type = 'info'
    },
    centerPanels: function(widthDiff = 0) {
      let tot = (this.$refs.rightpanel.getBoundingClientRect().width +
        this.$refs.leftpanel.getBoundingClientRect().width +
        widthDiff) / 2
      this.$refs.rightpanel.style.transition = 'width 0.2s ease-in-out'
      this.$refs.rightpanel.style.width = tot + 'px'
    },
    maximizeEdit: function() {
      this.$refs.rightpanel.style.transition = 'width 0.2s ease-in-out'
      this.$refs.rightpanel.style.width = '0%'
    },
    maximizeRender: function() {
      this.$refs.rightpanel.style.transition = 'width 0.2s ease-in-out'
      this.$refs.rightpanel.style.width = '100%'
    },
    updatePanelsAfterDrawer: function(newV) {
      // 200 px is the difference between mini and extended drawer
      let diff = 100
      if (newV)
        diff = -100

      this.$refs.rightpanel.style.width = this.$refs.rightpanel.getBoundingClientRect().width + diff + 'px'
    }

  },
  created() {
    EventBus.$on('error', this.showErrorSnackbar)
    EventBus.$on('success', this.showSuccessSnackbar)
  },
  beforeDestroy() {
    EventBus.$off('error', this.showErrorSnackbar)
    EventBus.$off('success', this.showSuccessSnackbar)
  },
}

function makeResizableDiv(divright, resizer) {
  resizer.addEventListener('mousedown', function(e) {
    divright.style.transition = ''
    e.preventDefault()
    divright.style.transition = ""
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)
  })

  function resize(e) {
    let relativePos = divright.getBoundingClientRect().right - e.pageX - resizer.getBoundingClientRect().width / 2 + 'px'
    divright.style.width = relativePos
  }
  function stopResize() {
    window.removeEventListener('mousemove', resize)
    divright.style.transition = 'width 0.2s ease-in-out'
  }
}
</script>

<style>
.panel {
  overflow-x: auto;
  height: 100%;
  max-height:100%;
}

#resizer {
  cursor: col-resize;
  width: 15px;
  padding: 10px 0 10px 0;
  flex: 0 0 auto;
}

#resizer::before {
  content: '';
  display: block;
  width: 2px;
  height: 100%;
  margin: 0 auto;
  background-color: var(--v-primary-base);
  border-radius: 2px;
  transition: width 0.1s, border-radius 0.1s;
}

#resizer:hover::before {
  width: 6px;
  border-radius: 6px;
}

.flex-panel {
  box-sizing: border-box;
  min-width: 480px;
  flex: 1 1 auto;
}

</style>
