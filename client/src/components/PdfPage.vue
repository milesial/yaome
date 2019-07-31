<template>
  <div ref="container" class="container">
  </div>
</template>

<script>
import * as PDFJSMain from "pdfjs-dist/build/pdf"
import * as PDFJSViewer from "pdfjs-dist/web/pdf_viewer.js"
import 'pdfjs-dist/web/pdf_viewer.css'


export default {
  props: ['page', 'scale'],
  mounted: function() {
    let container = this.$refs.container
    let pdfPageView = new PDFJSViewer.PDFPageView({
      container: container,
      scale: 1,
      defaultViewport: this.page.getViewport({ scale: 1 }),
      textLayerFactory: new PDFJSViewer.DefaultTextLayerFactory(),
            annotationLayerFactory: new PDFJSViewer.DefaultAnnotationLayerFactory(),
    });

    pdfPageView.setPdfPage(this.page);
    return pdfPageView.draw();
  }
}

</script>

<style>
canvas {
  border: 1px solid red;
   width: 100%;
   height: auto;
}
.container {
  width:100%;
  height: 100%;
}
.container > div {
  position: relative;
  width:100%;
}

</style>
