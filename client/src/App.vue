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
            <v-card class="panel"><RenderPanel/></v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import RenderPanel from './components/RenderPanel';
import EditPanel from './components/EditPanel';

export default {
  name: 'App',
  components: {
    RenderPanel,
    EditPanel
  },
  data: () => ({

  }),
  mounted: function() {
    makeResizableDiv(this.$refs.rightpanel, this.$refs.resizer)
  }
}

function makeResizableDiv(divright, resizer) {
  //TODO: bug when switching to pdf without resizing first
  resizer.addEventListener('mousedown', function(e) {
    e.preventDefault()
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)
  })
  
  function resize(e) {
    let relativePos = divright.getBoundingClientRect().right - e.pageX -resizer.getBoundingClientRect().width / 2 + 'px';
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
  width: 20px;
  padding: 0;
  flex: 0 0 auto;
}

#resizer::before {
  content: '';
  display: block;
  width: 4px;
  height: 100%;
  margin: 0 auto;
}

.flex-panel {
  box-sizing: border-box;
  min-width: 20%;
  flex: 1 1 auto;
}
</style>
