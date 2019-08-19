<template>
  <v-app>
    <AppBar
      @success="showSuccessSnackbar"
      @centerPanels="centerPanels"
      @maxEdit="maximizeEdit"
      @maxRender="maximizeRender"
      @drawer="miniDrawer = !miniDrawer"
    />
    <Files/>
    <v-content>
      <v-container grid-list-md fill-height style="max-width:100%;">
        <v-layout
          v-resize="centerPanels"
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
            class="pb-5 subtitle-1 font-weight-medium"
            :timeout="6000"
            :color="snackbar.color"
          >
            {{ snackbar.text }}
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
    },
  }),
  computed: {
    isWrapped: function() {
      return this.$refs.rightpanel.offsetTop != this.$refs.leftpanel.offsetTop
    }
  },
  mounted: function() {
    makeResizableDiv(this.$refs.rightpanel, this.$refs.resizer)
    // fix for the pdf generation without any resizes first
    this.centerPanels()
    if (store.logged && store.name)
      this.showSuccessSnackbar(`Welcome ${store.name} !`)
    else if (store.logged)
      this.showSuccessSnackbar(`Welcome !`)
    else
      this.showPrimarySnackbar('Remember to sign in to save your work.')
  },
  methods: {
    showErrorSnackbar: function(text) {
      this.snackbar.text = text
      this.snackbar.color = 'error'
      this.snackbar.show = true
    },
    showSuccessSnackbar: function(text) {
      this.snackbar.text = text
      this.snackbar.color = 'success'
      this.snackbar.show = true
    },
    showPrimarySnackbar: function(text) {
      this.snackbar.text = text
      this.snackbar.color = 'primary darken-1'
      this.snackbar.show = true
    },
    centerPanels: function() {
      if (this.isWrapped) {
        this.$refs.rightpanel.style.width = '100%'
        return
      }

      this.$refs.rightpanel.style.transition = "width 0.2s ease-in-out"
      this.$refs.rightpanel.style.width = this.$refs.rightpanel.parentElement.offsetWidth / 2 - this.$refs.resizer.getBoundingClientRect().width / 2 + 'px'
      this.$refs.rightpanel.style.flexGrow = 0
      setTimeout(() => {
        this.$refs.rightpanel.style.transition = ""
      }, 200)
    },
    maximizeEdit: function() {
      this.$refs.rightpanel.style.transition = "width 0.2s ease-in-out"
      this.$refs.rightpanel.style.width = '0%'
      this.$refs.rightpanel.style.flexGrow = 0
      setTimeout(() => {
        this.$refs.rightpanel.style.transition = ""
      }, 200)
    },
    maximizeRender: function() {
      this.$refs.rightpanel.style.transition = "width 0.2s ease-in-out"
      this.$refs.rightpanel.style.width = '100%'
      this.$refs.rightpanel.style.flexGrow = 0
      setTimeout(() => {
        this.$refs.rightpanel.style.transition = ""
      }, 200)
    }
  },
  created() {
    EventBus.$on('error', this.showErrorSnackbar)
  },
  beforeDestroy() {
    EventBus.$off('error', this.showErrorSnackbar)
  }
}

function makeResizableDiv(divright, resizer) {
  resizer.addEventListener('mousedown', function(e) {
    e.preventDefault()
    divright.style.transition = ""
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)
  })

  function resize(e) {
    let relativePos = divright.getBoundingClientRect().right - e.pageX - resizer.getBoundingClientRect().width / 2 + 'px'
    divright.style.width = relativePos
    divright.style.flexGrow = 0
  }
  function stopResize() {
    window.removeEventListener('mousemove', resize)
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
}

.flex-panel {
  box-sizing: border-box;
  min-width: 20%;
  flex: 1 1 auto;
}

</style>
