<template>
  <v-card>
    <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon large>mdi-tune</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Editor settings</v-list-item-title>
            <v-list-item-subtitle>Customize your experience</v-list-item-subtitle>
          </v-list-item-content>

        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item>
          <v-select
            eager
            prepend-icon="mdi-brush"
            class="my-2"
            :items="themes"
            label="Editor theme"
            dense
            v-model="options.theme"
          ></v-select>
        </v-list-item>
        <v-list-item dense>
          <v-switch
            color="primary"
            prepend-icon="mdi-keyboard"
            v-model="options.vim"
            label="VIM mode"
          ></v-switch>
        </v-list-item>
        <v-list-item dense>
          <v-switch
            color="primary"
            prepend-icon="mdi-format-list-numbered"
            v-model="options.showLines"
            label="Show line numbers"
          ></v-switch>
        </v-list-item>
        <v-list-item dense>
          <v-switch
            color="primary"
            prepend-icon="mdi-map"
            v-model="options.minimap"
            label="Show the minimap"
          ></v-switch>
        </v-list-item>
        <v-list-item dense>
          <v-slider
            v-model="options.fontSize"
            prepend-icon="mdi-format-size"
            min="6"
            max="50"
            thumb-label
            label="Font size"
            inverse-label
          ></v-slider>
        </v-list-item>
      </v-list>
  </v-card>

</template>

<script>

import * as monaco from 'monaco-editor'
import { initVimMode } from 'monaco-vim';
let themes = ['vs', 'vs-dark', 'hc-black']

export default {
  props: ['editor'],
  data: () => ({
    themes,
    options: {
      theme: 'vs',
      showLines: true,
      vim: false,
      fontSize: 16
    },
    vimMode: null,
  }),
  watch: {
    'options.theme': function(v) {
      monaco.editor.setTheme(v)
    },
    'options.showLines': function(v) {
      this.editor.updateOptions({ lineNumbers: v ? "on" : "off" })
    },
    'options.fontSize': function(v) {
      this.editor.updateOptions({ fontSize: v })
    },
    'options.minimap': function(v) {
      this.editor.updateOptions({ minimap: {enabled: v} })
    },
    'options.vim': function(v) {
      if (v) {
        this.data.vimMode = initVimMode(this.editor, null)
      } else if (this.data.vimMode) {
        this.data.vimMode.dispose()
      }
    }
  }
}
</script>
