<template>
  <v-card>
    <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon large>settings</v-icon>
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
          <v-radio-group
            prepend-icon="mdi-keyboard-outline"
            label="Key map"
            v-model="options.keymap">
            <v-radio
              color="primary"
              v-for="k in keymaps"
              :key="k"
              :label="k"
              :value="k"
            ></v-radio>
          </v-radio-group>
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
            prepend-icon="mdi-cursor-text"
              v-model="options.styleLine"
              label="Style active line"
            ></v-switch>
        </v-list-item>
      </v-list>
    </v-card>

</template>

<script>

function requireAll(r) {
  let l = []
  r.keys().forEach(k => {
    l.push(k.slice(2).split('.')[0])
    r(k)
  })
  return l
}

let themes = ['easymde', ...requireAll(require.context('../../../node_modules/codemirror/theme', true, /\.css$/))]
let keymaps = ['default', ...requireAll(require.context('../../../node_modules/codemirror/keymap', true, /\.js$/))]


export default {
  props: ['options', 'easyMDE'],
  data: () => ({
    themes,
    keymaps,
  }),
  watch: {
    'options.theme': function(v) {
      this.easyMDE.codemirror.setOption('theme', 'easymde ' + v)
    },
    'options.keymap': function(v) {
      this.easyMDE.codemirror.setOption('keyMap', v)
    },
    'options.showLines': function(v) {
      this.easyMDE.codemirror.setOption('lineNumbers', v)
    },
    'options.styleLine': function(v) {
      this.easyMDE.codemirror.setOption("styleActiveLine", v)
    }

  }
}
</script>
