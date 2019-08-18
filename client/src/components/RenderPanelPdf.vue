<template>
  <v-flex ref="pdfContent" class="pl-0">
    <RenderPanelPdfPage
      v-for="p in pdfPages"
      :key="p.__ob__.dep.id"
      :page="p"
    />
    <v-fade-transition>
      <v-pagination
        v-if="showPagination"
        id="page-select"
        v-model="paginationSelect"
        :length="numPages"
        @input="paginationUpdated"
        circle
        color="secondary"
      ></v-pagination>
    </v-fade-transition>
  </v-flex>
</template>

<script>
import * as PDFJSMain from 'pdfjs-dist/build/pdf'
import RenderPanelPdfPage from './RenderPanelPdfPage'
import store from '../store.js'
import EventBus from '../event-bus.js'

export default {
  components: { RenderPanelPdfPage },
  data: () => ({
    render: store.render,
    pdfPages: [],
    paginationSelect: 1,
    numPages: 0,
    loading: false
  }),
  computed: {
    pdfArray() {
      // whole pdf as bytes
      return new Uint8Array(this.render.pdf)
    },
    showPagination() {
      return this.numPages > 1
    },
  },
  methods: {
    showPdf() {
      this.loading = true
      let loadingTask = PDFJSMain.getDocument(this.pdfArray)
      let tmpPages = []
      loadingTask.promise.then((pdf) => {
        let pagePromises = []
        for (let i = 0; i < pdf.numPages; i++) {
          pagePromises.push(
            pdf.getPage(i + 1).then((page) => {
              tmpPages.push(page)
            })
          )
        }
        return Promise.all(pagePromises)
      })
        .then(() => {
          // replace original array once sorted
          this.numPages = tmpPages.length
          this.pdfPages = tmpPages.sort((a, b) => a.pageIndex - b.pageIndex)
        })
        .catch((err) => {
          if (err.message != 'PDFDocument: Stream must have data') {
            EventBus.$emit('error', err.message)
          }
        })
        .finally(() => { this.loading = false })
    },
    updatePagination(scrollEvent) {
      let page = this.$refs.pdfContent.children[0]
      if (this.forcedScrolling || !page)
        return
      let pageH = page.offsetHeight
      // height of card
      let contH = document.getElementById('render-layout').offsetHeight
      this.paginationSelect = Math.ceil((scrollEvent.target.scrollTop + contH / 2) / pageH)
    },
    paginationUpdated(index) {
      // scroll to the desired page
      this.forcedScrolling = true
      this.$vuetify.goTo(this.$refs.pdfContent.children[index-1].offsetTop,
        { container: '#render-container', duration: 250 })
      if (this.tmpTimeout)
        clearTimeout(this.tmpTimeout)
      this.tmpTimeout = setTimeout(() => { this.forcedScrolling = false }, 250)
    }
  },
  watch: {
    pdfArray() {
      this.showPdf()
    }
  }
}

</script>

<style scoped>
#page-select {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
