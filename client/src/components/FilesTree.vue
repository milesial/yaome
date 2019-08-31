<template>
  <v-treeview
    :items="store.files.tree.children"
    rounded
    expand-icon="mdi-chevron-down"
    open-on-click
    transition
    item-key="path"
    activatable
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.type == 'directory'">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ icons[item.extension.slice(1)] ? icons[item.extension.slice(1)] : 'mdi-file' }}
      </v-icon>
    </template>
  </v-treeview>
</template>

<script>
import store from '../store.js'

export default {
  data: () => ({
    store: store.data,
    icons: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-json',
      md: 'mdi-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
    },
  }),
}

</script>
