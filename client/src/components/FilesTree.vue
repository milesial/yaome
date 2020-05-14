<template>
  <div style="max-width:100%;">
  <v-treeview
    v-show="extended"
    :items="store.files.tree.children"
    activatable
    :active.sync="activeFiles"
    expand-icon="mdi-chevron-down"
    open-on-click
    transition
    item-key="path"
    rounded
    :open="openDirs"
  >
    <template v-slot:label="{ item }">
      <span>
        {{ item.name }}
      </span>
    </template>
    <template v-slot:prepend="{ item }">
      <v-icon v-if="item.type == 'directory'">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ icons[item.extension.slice(1)] ? icons[item.extension.slice(1)] : 'mdi-file' }}
      </v-icon>
    </template>
    <template v-slot:append="{ item }">
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click.stop="removeConfirm(item)" class="delete-btn">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <span>Remove {{ item.type }}</span>
      </v-tooltip>
    </template>
  </v-treeview>
    <v-dialog
      v-model="deleteDialog.show"
      max-width="400"
    >
      <v-card v-if="deleteDialog.what">
        <v-card-title class="headline"><v-icon large class="mr-4">mdi-delete</v-icon>Delete this {{ deleteDialog.what.type }} ?</v-card-title>
        <v-card-text>
          The content of the <strong>{{ deleteDialog.what.name }}</strong> {{ deleteDialog.what.type }} will be lost.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            @click="deleteDialog.show = false"
          >
            <v-icon class="mr-2">mdi-close-circle</v-icon>
            Cancel
          </v-btn>

          <v-btn
            color="error"
            text
            @click="deleteDialog.show = false; remove(deleteDialog.what)"
          >
            <v-icon class="mr-2">mdi-delete-circle</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import store from '../store'
import EventBus from '../event-bus'

export default {
  props: ['extended'],
  data: () => ({
    store: store.data,
    icons: {
      html: 'mdi-language-html5',
      js:   'mdi-nodejs',
      json: 'mdi-json',
      md:   'mdi-markdown',
      pdf:  'mdi-file-pdf',
      png:  'mdi-file-image',
      txt:  'mdi-file-document-outline',
      xls:  'mdi-file-excel',
    },
    activeFiles: [store.data.files.selected],
    deleteDialog: {
      show: false,
      what: null
    },
    openDirs: []
  }),
  watch: {
    activeFiles(newV, oldV) {
      if (newV.length == 0)
        this.$nextTick(() => this.activeFiles = oldV)
      else {
        this.store.files.selected = newV[0]
        this.store.files.updateContent()
      }
    }
  },
  methods: {
    removeConfirm(item) {
      this.deleteDialog.what = item
      this.deleteDialog.show = true
    },
    remove(item) {
      store.files.remove(item.path)
        .then(() => {
          store.updateFilesTree()
          if (item.type == 'file')
            EventBus.$emit('success', `File <strong>${item.name}</strong> deleted !`)
          else
            EventBus.$emit('success', `Directory <strong>${item.name}</strong> deleted !`)
        })
        .catch(err => EventBus.$emit('error', err))
    }
  },
  mounted() {
  
  }
}

</script>

<style>

.v-treeview-node__root .delete-btn {
  display: none;
}
.v-treeview-node__root:hover .delete-btn {
  display: flex;
}

.v-treeview-node__root {
  margin: 0 !important;
}
</style>
