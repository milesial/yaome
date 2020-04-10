<template>
  <v-layout
    column
    fill-height
    class="ma-0 pa-0"
    v-resize="onResize"
    style="overflow: hidden;"
  >
      <v-toolbar flat dense>
        <v-menu
          v-if="topOptions"
          v-model="optionsMenu"
          :close-on-content-click="false"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn
              text
              large
              rounded
              v-on="on"
            >
              <v-icon class="mr-2">mdi-tune</v-icon>
              Settings
            </v-btn>
          </template>
          <EditPanelOptions :options="options"/>
        </v-menu>
      </v-toolbar>
    <v-container fill-height class="pa-0 ma-0" id="editor"></v-container>
  </v-layout>
</template>

<script>
import resize from 'vue-resize-directive'
import store from '../store.js'
import EditPanelOptions from './EditPanelOptions'

import * as monaco from 'monaco-editor'

export default {
  directives: { resize },
  components: { EditPanelOptions },
  data: () => ({
    store: store.data,
    textStyle: undefined,
    optionsMenu: false,
    options: {
      theme: 'easymde',
      keymap: 'default',
      showLines: true,
      styleLine: true
    },
    topOptions: true,
    editor: null

  }),
  mounted() {
    let that = this
    setTimeout(() => {
      that.editor = monaco.editor.create(document.getElementById("editor"), {
        value: that.store.markdown,
        language: 'markdown',
        minimap: {enabled: false},
        showFoldingControls: 'always',
        smoothScrolling: true,
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8
        },
        copyWithSyntaxHighlighting: false,

      });
    
      let model = that.editor.getModel()
      model.onDidChangeContent(() => {
        that.store.markdown = model.getValue()
      })
    }, 0)
  },
  methods: {
    onResize() {
      if (this.editor)
        this.editor.layout()
    }
  }
}
</script>

<style lang="scss">
#editor {
  height: 100%;
  text-align: left;
}

</style>
