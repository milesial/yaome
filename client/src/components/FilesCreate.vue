<template>
  <v-card max-width="700px" min-width="300px">
    <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon large>mdi-plus</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Create a new file / directory</v-list-item-title>
          <v-list-item-subtitle>or import existing files</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <v-tabs vertical v-model="tab" :key="String(opened)">
      <v-tab key="create"><v-icon class="mr-2">mdi-plus</v-icon>Create</v-tab>
      <v-tab key="import"><v-icon class="mr-2">mdi-upload</v-icon>Upload</v-tab>
      <v-tab-item key="create" class="px-8">
        <v-row align="center">
          <v-col>
            <v-combobox
              label="Path"
              autofocus
              ref="name"
              :prepend-icon="type=='file' ? 'mdi-file-outline' : 'mdi-folder-outline'"
              :placeholder="'mydirectory/' + (type=='file' ? 'note.md' : '')"
              :search-input.sync="path"
              hide-no-data
              auto-select-first
              :items="directories"
            ></v-combobox>
            <v-radio-group mandatory v-model="type" row>
              <v-radio label="File" color="primary" value="file"></v-radio>
              <v-radio label="Directory" color="primary" value="directory"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item key="import" class="px-8">
        <v-row align="center">
          <v-col>
            <v-combobox
              label="Path to import to"
              prepend-icon="mdi-folder-outline"
              placeholder="mydirectory/"
              auto-select-first
              ref="nameImport"
              color="primary"
              hide-no-data
              :search-input.sync="path"
              :items="directories"
              hint="Leave empty for root"
              persistent-hint
            >
              <template v-slot:item="{ item }">
                {{ item }}
              </template>
            </v-combobox>
            <v-file-input
              multiple
              counter
              prepend-icon="mdi-file-upload-outline"
              @keydown.enter="submit"
              label="Files"
              small-chips
              v-model="filesImport"
            >
            </v-file-input>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        class="my-0"
        rounded
        text
        @click="$emit('close')"
      >
        Close
      </v-btn>
      <v-btn
        class="my-0 px-4"
        rounded
        :disabled="(tab == 0 && !path) || (tab == 1 && filesImport.length == 0)"
        color="primary"
        @click="submit"
      >
        {{ tab == 0 ? 'Create' : 'Upload' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'  
import store from '../store'
import EventBus from '../event-bus'

export default {
  props: ['opened'],
  data: () => ({
    store: store.data,
    path: '',
    filesImport: [],
    tab: 0,
    type: 'file'
  }),
  watch: {
    opened(v) {
      if (!v)
        return
      setTimeout(() => {
        if (this.$refs.name)
          this.$refs.name.focus()
      }, 100)
    },
    tab(v) {
      if (v == 0)
        setTimeout(() => {
          if (this.$refs.name)
            this.$refs.name.focus()
        }, 200)
      else
        setTimeout(() => {
          if (this.$refs.nameImport)
            this.$refs.nameImport.focus()
        }, 200)
    }
  },
  methods: {
    create() {
      axios.post(`${process.env.VUE_APP_BACK_URL}/files`, {
        type: this.type,
	path: this.path
      })
        .then(() => {
          store.updateFilesTree()
          this.$emit('close')
          if (this.type == 'file')
            EventBus.$emit('success', 'File created !')
          else
            EventBus.$emit('success', 'Directory created !')
        })
        .catch(err => EventBus.$emit('error', err))
    },
    importFiles() {
      let promises = []
      let fd = new FormData()
      fd.append('path', this.path)
      this.filesImport.forEach(f => {
        fd.append('files', f)
        let p = axios.post('/files', fd, {
          headers: {'Content-Type': 'multipart/form-data' }
        })
        promises.push(p)
      })

      Promise.all(promises)
        .then(() => {
          store.updateFilesTree()
          this.$emit('close')
          if (promises.length > 1)
            EventBus.$emit('success', 'Files imported !')
          else
            EventBus.$emit('success', 'File imported !')
        })
        .catch(err => EventBus.$emit('error', err))
    },
    submit() {
      if (this.tab == 0) {
        this.create()
      } else if (this.filesImport.length > 0) {
        this.importFiles()
      }
    }
  },
  computed: {
    directories() {
      function recursiveDirs(obj) {
        let dirs = []
        if (obj.type == 'directory') {
          if (obj.path)
            dirs.push(obj.path)
          obj.children.forEach(c => {
            dirs.push(...recursiveDirs(c))
          })
        }
        return dirs
      }

      return recursiveDirs(this.store.files.tree)
    }
  }
}

</script>
