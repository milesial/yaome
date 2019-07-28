<template>
  <v-layout column fill-height class="ma-0">
    <v-flex shrink>
      <v-toolbar flat dense>
        <v-toolbar-title>Edit</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
    </v-flex>
    <v-flex id="editbox" class="mx-1 my-0">
      <v-textarea
        v-model="text"
        autofocus
        flat
        no-resize
      />
    </v-flex>
  </v-layout>
</template>

<script>
import store from '../store.js';
import { requestRender } from '../render.js'
import _ from 'lodash'

export default {
  data: () => ({
    text: 'salut',
    sharedState: store.state
  }),
  watch: {
    text: function(newT) {
      this.render(newT)
    }
  },
  methods: {
    render: _.debounce(function (text) {
      let vm = this
      let s = this.sharedState
      let format = s.availableFormats[s.selectedFormatId]
      requestRender(text, format, function(res) {
        vm.sharedState.render[format] = res
			})
    }, 200),
  }
}
</script>

<style>
#editbox textarea {
  margin-top: 0;
  display: inline-block;
  font-size: 20px;
  box-sizing: border-box;
}

#editbox .v-input,
#editbox .v-input__control,
#editbox .v-input__slot,
#editbox .v-text-field__slot {
  height:100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
