<template>
  <v-app>
    <v-content>
      <v-container grid-list-md fill-height>
        <v-layout
          text-center>
          <v-flex class="flex-panel pr-0" ref="leftpanel">
            <v-card class="panel"><EditPanel/></v-card>
          </v-flex>
          <div id="resizer" ref="resizer"></div>
          <v-flex class="flex-panel pl-0" ref="rightpanel">
            <v-card class="panel"><RenderPanel @error="showErrorSnackbar"/></v-card>
          </v-flex>
          <v-snackbar
            v-model="snackbar.show"
            bottom
            :timeout="5000"
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
import RenderPanel from './components/RenderPanel'
import EditPanel from './components/EditPanel'

export default {
  name: 'App',
  components: {
    RenderPanel,
    EditPanel
  },
  data: () => ({
    snackbar: {
      show: false,
      text: '',
      color: '',
    }
  }),
  mounted: function() {
    makeResizableDiv(this.$refs.rightpanel, this.$refs.resizer)
    // fix for the pdf generation without any resizes first
    this.$refs.rightpanel.style.width = this.$refs.rightpanel.parentElement.offsetWidth / 2 + 'px'
    this.$refs.rightpanel.style.flexGrow = 0
  },
  methods: {
    showErrorSnackbar: function(text) {
      this.snackbar.text = text
      this.snackbar.color = 'error'
      this.snackbar.show = true
    }
  }
}

function makeResizableDiv(divright, resizer) {
  resizer.addEventListener('mousedown', function(e) {
    e.preventDefault()
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
}

#resizer {
  cursor: col-resize;
  width: 15px;
  padding: 0;
  flex: 0 0 auto;
}

#resizer::before {
  content: '';
  display: block;
  width: 5px;
  height: 100%;
  margin: 0 auto;
}

.flex-panel {
  box-sizing: border-box;
  min-width: 20%;
  flex: 1 1 auto;
}

</style>
