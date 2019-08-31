<template>
  <v-layout
    id="render-layout"
    ref="renderLayout"
    class="ma-0"
    v-scroll:#render-container="onScroll"
    column
    fill-height
  >
    <v-flex shrink class="py-0">
      <v-toolbar flat dense>
        <!-- hexagon icon -->
        <v-toolbar-title class="mx-n4">
          <v-list-item-avatar large class="ml-2 secondary">
            <v-icon v-if="!store.rendering" dark>mdi-hexagon-slice-6</v-icon>
            <v-icon v-else dark>mdi-hexagon-outline</v-icon>
          </v-list-item-avatar>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <!-- download button -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <a id="dl-hidden-link"></a>
            <div v-on="on">
              <v-btn
                @click="download"
                :loading="preparingDL"
                :disabled="markdownIsEmpty"
                icon
              >
                <v-icon>mdi-file-download-outline</v-icon>
              </v-btn>
            </div>
          </template>
          <span>Download file</span>
        </v-tooltip>
        <!-- refresh button -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn
                @click="updateManual"
                :loading="renderingSmoothed"
                :disabled="markdownIsEmpty"
                icon
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </div>
          </template>
          <span>Refresh</span>
        </v-tooltip>
        <v-divider
          class="mx-2"
          vertical
          inset
        ></v-divider>
        <!-- tabs for output formats -->
        <v-flex shrink>
          <v-tabs
            v-model="store.selectedFormatId"
            @change="updateManual"
            right
          >
            <v-tab v-for="f in store.availableFormats" :key="f" :disabled="markdownIsEmpty">{{ f }}</v-tab>
          </v-tabs>
        </v-flex>
      </v-toolbar>
      <v-divider></v-divider>
    </v-flex>
    <EmptyRender v-show="markdownIsEmpty"/>
    <v-flex v-show="!markdownIsEmpty" id="render-container" class="pa-0">
      <v-tabs-items v-model="store.selectedFormatId">
        <v-tab-item class="tab-content px-8 text-left" key="html">
          <RenderPanelHtml
            ref="html"
            :useKatex="false"
          />
        </v-tab-item>
        <v-tab-item class="tab-content" key="pdf">
          <RenderPanelPdf
            ref="pdf"
            :loading="pdfLoading"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
    <v-progress-linear
      value="100"
      :color="progressColor"
      :indeterminate="progressIndeterminate"
      bottom
    />
  </v-layout>
</template>

<script>
import store from '../store.js';
import { requestRender, updateCurrentRender } from '../utils.js'
import RenderPanelPdf from './RenderPanelPdf.vue'
import RenderPanelHtml from './RenderPanelHtml.vue'
import EmptyRender from './EmptyRender.vue'
import { Scroll } from 'vuetify/lib/directives'
import _ from 'lodash'

export default {
  components: { RenderPanelPdf, RenderPanelHtml, EmptyRender },
  directives: { Scroll },
  data : () => ({
    store: store.data,
    preparingDL: false,
    renderingSmoothed: false, // rendering boolean without short spikes
    pdfLoading: false
  }),
  created: function() {
    this.update = _.debounce(this.update, 200)
  },
  computed: {
    progressColor: function() {
      if(this.store.markdown == this.store.renderedMarkdown && !this.store.rendering) {
        return "success"
      } else {
        return "primary"
      }
    },
    progressIndeterminate: function() {
      return this.store.rendering || this.pdfLoading
    },
    selectedFormat: function() {
      return this.store.availableFormats[this.store.selectedFormatId]
    },
    markdownIsEmpty: function() {
      return this.store.markdown.trim() == ''
    }
  },
  watch: {
    'store.rendering': function(value) {
      if (!value) {
        this.renderingSmoothed = false
      } else {
        setTimeout(() => {
          if (this.store.rendering)
            this.renderingSmoothed = true
        }, 400)
      }
    },
    'store.markdown': function() {
      this.update()
    }
  },
  methods: {
    download() {
      this.preparingDL = true
      requestRender(this.store.markdown, this.selectedFormat,
        { download: true }, (res) => {
          let a = document.getElementById('dl-hidden-link')
          let blob = new Blob([res])
          a.href = window.URL.createObjectURL(blob)
          a.download = this.store.files.selected.split('.')[0] + '.' + this.selectedFormat
          a.click()
          this.preparingDL = false
        })
    },
    update() {
      updateCurrentRender({}, () => {
        if (this.selectedFormat == 'html') {
          this.$nextTick(() => {
            this.$refs.html.processMath()
          })
        }
      })
    },
    updateManual() {
      this.renderingSmoothed = true
      this.store.rendering = true
      this.update()
    },
    onScroll(e) {
      if (this.selectedFormat == 'pdf')
        this.$refs.pdf.updatePagination(e)
    },
  }
}
</script>

<style scoped>
.tab-content {
  max-height: 0px; /* Needed in order for the scroll to work */
}

#dl-hidden-link {
  visibility: hidden;
}

#render-container {
  color: black;
  overflow: auto; /* Needed for the scroll */
}

#render-layout {
  position: relative; /* So the pdf page select aligns to the bottom */
  overflow: hidden;
}

</style>

<style>
#render-container .v-window, #render-container .v-window__container {
  position: static !important; /* So the pdf page select aligns to the bottom */
}
</style>
