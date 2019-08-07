<template>
  <v-layout
    id="render-layout"
    ref="renderLayout"
    class="ma-0"
    v-scroll:#render-container="onScroll"
    column
    fill-height
  >
    <v-flex shrink>
      <v-toolbar flat dense>
        <v-toolbar-title>Render</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- download button -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <a id="dl-hidden-link"></a>
            <v-btn
              v-on="on"
              @click="download"
              :loading="preparingDL"
              icon
            >
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </template>
          <span>Download file</span>
        </v-tooltip>
        <!-- refresh button -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              @click="updateManual"
              :loading="renderingSmoothed"              icon
            >
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
        <!-- tabs for output formats -->
        <v-flex shrink>
          <v-tabs
            v-model="store.selectedFormatId"
            @change="update"
            right
          >
            <v-tab v-for="f in store.availableFormats" :key="f">{{ f }}</v-tab>
          </v-tabs>
        </v-flex>
      </v-toolbar>
      <v-divider></v-divider>
    </v-flex>
    <v-flex id="render-container" >
      <v-tabs-items v-model="store.selectedFormatId">
        <v-tab-item class="tab-content" key="html">
          <v-card flat>
            <!-- TODO: fix XSS https://github.com/apostrophecms/sanitize-html -->
            <div
              id="render-html"
              class="text-left pa-4"
              v-html="store.render.html"
            ></div>
          </v-card>
        </v-tab-item>
        <v-tab-item class="tab-content" key="pdf" ref="pdfContent">
          <div v-for="p in pdfPages">
            <PdfPage :page="p" scale="2"/>
          </div>
        </v-tab-item>
      </v-tabs-items>
      <v-fade-transition>
        <v-pagination
          v-if="pdfShowPagination"
          id="page-select"
          v-model="pagination"
          :length="pdfNumPages"
          @input="pdfPageChanged"
          circle
        ></v-pagination>
      </v-fade-transition>
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
import pdf from 'vue-pdf'
import { requestRender, updateCurrentRender } from '../render.js'
import PdfPage from './PdfPage.vue'
import * as PDFJSMain from "pdfjs-dist/build/pdf"
import { Scroll } from 'vuetify/lib/directives'

export default {
  components: { pdf, PdfPage },
    directives: { Scroll },
    data : () => ({
      store: store,
      renderStatus: 0,
      preparingDL: false,
      renderingSmoothed: false, // rendering boolean without short spikes
      pdfPages: [],
      pagination: 1,
      pdfNumPages: 0
    }),
    computed: {
      pdfArray: function() {
        return new Uint8Array(this.store.render.pdf)
      },
      pdfShowPagination: function() {
        return this.store.selectedFormatId == 1 && this.pdfNumPages > 1
      },
      progressColor: function() {
        if(this.store.markdown == this.store.renderedMarkdown && !this.store.rendering) {
          return "success"
        } else {
          return "primary"
        }
      },
      progressIndeterminate: function() {
        return this.store.rendering || this.pdfPages.length < this.pdfNumPages
      },
      selectedFormat: function() {
        return this.store.availableFormats[this.store.selectedFormatId]
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
        'pdfArray': function() {
          this.renderPDF()
        }
    },
    methods: {
      download: function() {
        this.preparingDL = true
        requestRender(this.store.markdown, this.selectedFormat, {download: true},
          (res) => {
            let a = document.getElementById('dl-hidden-link')
            let blob = new Blob([res])
            a.href = window.URL.createObjectURL(blob)
            a.download = this.store.files.selected.split('.')[0] + '.' + this.selectedFormat
            a.click()
            this.preparingDL = false
          })
      },
        update: function() {
          updateCurrentRender()
        },
        updateManual: function() {
          this.renderingSmoothed = true
          this.store.rendering = true
          updateCurrentRender()
        },
        renderPDF: function() {
          this.pdfPages = []
          let loadingTask = PDFJSMain.getDocument(this.pdfArray)
          loadingTask.promise.then((pdf) => {
            this.pdfNumPages = pdf.numPages
            let tmpPages = []
            for (let i = 0; i < pdf.numPages; i++) {
              pdf.getPage(i+1).then((page) => {
                tmpPages.push(page)
                if (tmpPages.length == pdf.numPages)
                  this.pdfPages = tmpPages
              })
            }
          })
            .catch((err) => {
              if (err.message != 'PDFDocument: Stream must have data') {
                this.$emit('error', err.message)
                console.log(err)
              }
            })
        },
        onScroll: function(e) {
          let pageH = this.$refs.pdfContent.$el.children[0].offsetHeight
          let contH = this.$refs.renderLayout.offsetHeight
          this.pagination = Math.ceil((e.target.scrollTop + contH / 2) / pageH)
        },
        pdfPageChanged: function(i) {
          this.$vuetify.goTo(this.$refs.pdfContent.$el.children[i-1].offsetTop,
            { container: '#render-container', duration: 250 })
        }
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

#render-html {
  overflow-wrap: break-word;
}

#page-select {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
}

#render-layout {
  position: relative; /* So the pdf page select aligns to the bottom */
}
</style>
