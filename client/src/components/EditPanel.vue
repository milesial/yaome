<template>
  <v-layout
    column
    fill-height
    class="ma-0"
  >
    <v-flex shrink class="py-0">
      <v-toolbar flat dense>
        <v-spacer></v-spacer>
        <v-toolbar-items>
        <v-btn-toggle  v-model="textStyle" multiple>
          <v-btn tile>
            <v-icon>format_bold</v-icon>
          </v-btn>
          <v-btn tile>
            <v-icon>format_italic</v-icon>
          </v-btn>
          <v-btn tile>
            <v-icon>format_strikethrough</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-title class="mx-n4">
          <v-list-item-avatar class="mr-2 secondary">
            <v-icon dark>mdi-pencil</v-icon>
          </v-list-item-avatar>
        </v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
    </v-flex>
    <v-flex id="editbox" class="mx-1 my-0">
      <v-textarea
        v-model="store.markdown"
        autofocus
        flat
        no-resize
      />
    </v-flex>
  </v-layout>
</template>

<script>
import store from '../store.js';

export default {
  data: () => ({
    store: store,
    textStyle: []
  }),
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
