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
            prepend-icon="mdi-format-list-numbered"
            v-model="options.showLines"
            label="Show line numbers"
          ></v-switch>
        </v-list-item>
      </v-list>
  </v-card>

</template>

<script>

import * as monaco from 'monaco-editor'
let themes = ['vs', 'vs-dark', 'hc-black']

export default {
  props: ['editor'],
  data: () => ({
    themes,
    options: {
      theme: 'vs',
      showLines: true,
    }
  }),
  watch: {
    'options.theme': function(v) {
      monaco.editor.setTheme(v)
    },
    'options.showLines': function(v) {
      this.editor.updateOptions({ lineNumbers: v ? "on" : "off" })
    }
  }
}
</script>
