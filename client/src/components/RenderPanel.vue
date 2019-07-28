<template>
  <v-layout column fill-height class="ma-0">
    <v-flex shrink>
      <v-toolbar flat dense>
        <v-toolbar-title>Render</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon download="render.pdf" :href="pdfURL">
              <v-icon>mdi-file-download-outline</v-icon>
            </v-btn>
          </template>
          <span>Download file</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
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
          <v-tabs right v-model="sharedState.selectedFormatId">
            <v-tab v-for="f in sharedState.availableFormats" :key="f">{{ f }}</v-tab>
          </v-tabs>
        </v-flex>
      </v-toolbar>
      <v-divider></v-divider>
    </v-flex>
    <v-flex color="black">
    <v-tabs-items v-model="sharedState.selectedFormatId" >
      <v-tab-item key="html">
        <v-card flat>
          <!-- TODO: fix XSS https://github.com/apostrophecms/sanitize-html -->
          <div class="text-left" v-html="sharedState.render.html" style="overflow-wrap: break-word;"></div>
        </v-card>
      </v-tab-item>
      <v-tab-item key="pdf">
        <pdf
          style="height:100%;width:100%;"
          :src="pdfArray"
          @progress="renderStatus = 100 * $event"
        ></pdf>
      </v-tab-item>
    </v-tabs-items>
    </v-flex>
    <v-progress-linear bottom :value="renderStatus" :active="!rendering"/>
  </v-layout>
</template>

<script>
import store from '../store.js';
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  data : () => ({
    sharedState: store.state,
    renderStatus: 0,
  }),
  computed: {
    pdfArray: function() {
      return new Uint8Array(this.sharedState.render.pdf);
    },
    rendering: function() {
      return this.renderStatus != 100
    },
    pdfURL: function() {
      return URL.createObjectURL(new Blob([this.pdfArray]))
    },
  }
}
</script>
