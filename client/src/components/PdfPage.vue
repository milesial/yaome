<template>
  <div ref="container"
    class="container pa-0 ma-0"    v-resize="clearTextLayer"    v-resize:debounce="renderTextLayer"
  >
    <div class="textLayer" ref="textLayer"></div>
    <canvas class="elevation-2" ref="canvas"></canvas>
  </div>
</template>

<script>
import * as PDFJSViewer from "pdfjs-dist/web/pdf_viewer.js"
import 'pdfjs-dist/web/pdf_viewer.css'
import resize from 'vue-resize-directive'

export default {
  directives: {
    resize
  },
  props: ['page'],
  mounted: function() {
    let page = this.page
    let viewport = page.getViewport({ scale: 2 });
    let canvas = this.$refs.canvas
    let context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width

    var renderContext = {
      canvasContext: context,
      viewport: viewport
    }

    page.render(renderContext).promise
      .then(() => {
        this.renderTextLayer()
      })
      .catch(console.log)
      .finally(() => {
        this.$emit('ready')
      })
  },
  methods: {
    renderTextLayer: function() {
      let textDiv = this.$refs.textLayer
      let page = this.page

      let desiredWidth = this.$refs.canvas.getBoundingClientRect().width
      let v = page.getViewport({ scale: 1 })
      let scale = desiredWidth / v.width
      let viewport = page.getViewport({ scale: scale })
      this.page.getTextContent()
        .then((textContent) => {
          let textLayer = new PDFJSViewer.TextLayerBuilder({
            textLayerDiv: textDiv,
            pageIndex: page.pageIndex,
            viewport: viewport
          })
          textLayer.setTextContent(textContent)
          textLayer.render()
        })
    },
    // TODO: keep selection ?
    clearTextLayer() {
      this.$refs.textLayer.innerHTML = ""
    }
  }
}

</script>

<style>
canvas {
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box;
}

canvas:hover {
  border: 5px solid red;
}

.container {
  width:100%;
  height: 100%;
}
</style>
