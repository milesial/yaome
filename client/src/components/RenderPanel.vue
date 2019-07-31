<template>
  <v-layout column fill-height class="ma-0">
    <v-flex shrink>
      <v-toolbar flat dense>
        <v-toolbar-title>Render</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <a id="downloadHiddenLink"></a>
            <v-btn v-on="on" icon @click="download" :loading="preparingDL">
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </template>
          <span>Download file</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon :loading="renderingSmoothed" @click="updateManual">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh</span>
        </v-tooltip>
        <v-divider
          class="mx-2"
          vertical
          inset
        ></v-divider>
        <v-flex shrink>
          <v-tabs right v-model="store.selectedFormatId" @change="update">
            <v-tab v-for="f in store.availableFormats" :key="f">{{ f }}</v-tab>
          </v-tabs>
        </v-flex>
      </v-toolbar>
      <v-divider></v-divider>
    </v-flex>
    <v-flex id="render-container">
      <v-tabs-items v-model="store.selectedFormatId">
        <v-tab-item class="tab-content" key="html">
          <v-card flat>
            <!-- TODO: fix XSS https://github.com/apostrophecms/sanitize-html -->
            <div id="render-html" class="text-left pa-4" v-html="store.render.html"></div>
          </v-card>
        </v-tab-item>
        <v-tab-item class="tab-content" key="pdf">
          <div v-for="p in pdfPages">
            <PdfPage :page="p" scale="2"/>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
    <v-progress-linear bottom :active="store.rendering" indeterminate/>
  </v-layout>
</template>

<script>
import store from '../store.js';
import pdf from 'vue-pdf'
import { requestRender, updateCurrentRender } from '../render.js'
import * as PDFJSMain from "pdfjs-dist/build/pdf"
import PdfPage from './PdfPage.vue'

export default {
  components: {
    pdf,
    PdfPage
  },
  data : () => ({
    store: store,
    renderStatus: 0,
    preparingDL: false,
    renderingSmoothed: false, // rendering boolean without short spikes
    pdfPages: []
  }),
  computed: {
    pdfArray: function() {
      return new Uint8Array(this.store.render.pdf);
    },
  },
  watch: {
    'store.rendering': function(value) {
      let vm = this
      if (!value)
        this.renderingSmoothed = false
      else {
        setTimeout(function() {
          if (store.rendering)
            vm.renderingSmoothed = true
        }, 400)
      }
    },
    pdfArray: function() {
      this.renderPDF()
    }
  },
  methods: {
    download: function() {
      this.preparingDL = true
      let vm = this
      let s = this.store
      let format = s.availableFormats[s.selectedFormatId]
      requestRender(s.markdown, format, {download: true}, function(res) {
        let a = document.getElementById('downloadHiddenLink')
        let blob = new Blob([res])
        a.href = window.URL.createObjectURL(blob);
        a.download = vm.store.files.selected.split('.')[0] + '.' + format
        a.click()
        vm.preparingDL = false
      })
    },
    update: function() {
      updateCurrentRender()
    },
    updateManual: function() {
      this.renderingSmoothed = true;
      this.store.rendering = true;
      updateCurrentRender()
    },
    renderPDF: function() {
      let vm = this
      this.pdfPages = []
      let loadingTask = PDFJSMain.getDocument(this.pdfArray);
      loadingTask.promise.then(function(pdf) {
        for(let i = 0; i < pdf.numPages; i++) {
          pdf.getPage(i+1).then(function(page) {
            vm.pdfPages.push(page)
          })
        }
      })
    }
  }
}
</script>


<style scoped>
.tab-content {
  max-height: 0px; /* Needed in order for the scroll to work */
}

#downloadHiddenLink {
  visibility: hidden;
}

#render-container {
  color: black;
  overflow: auto;
}

#render-html {
  overflow-wrap: break-word;
}
</style>
