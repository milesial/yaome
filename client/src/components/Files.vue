 <template>
<div 
  @mouseover="drawerHover=true"
  @mouseleave="drawerHover=false">
    <v-navigation-drawer
      :mini-variant="mini"
      permanent
      app
    >
      <v-list-item class="px-2">
        <v-list-item-avatar left>
            <v-icon large :color="mini ? '': 'primary'">mdi-folder-settings</v-icon>
        </v-list-item-avatar>
        <v-list-item-title class="title">Files</v-list-item-title>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-menu
                v-model="createMenu"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon large>
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <FilesCreate
                  :opened="createMenu"
                  @close="createMenu = false"/>
              </v-menu>
            </div>
          </template>
          <span>Create a file or directory</span>
        </v-tooltip>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 pt-2 mx-2 px-0">
        <v-list-item-content>
          <FilesTree
            :extended="!mini"
          />
      </v-list-item-content>
    </v-list-item>

      <div style="position: absolute; bottom: 0; width: 100%;">
        <v-divider></v-divider>
    <v-list-item
      link
      @click="downloadZip()"
      class="font-weight-bold"
    >
          <v-list-item-icon>
            <v-icon>mdi-folder-download</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Download as archive</v-list-item-title>
          </v-list-item-content>
    </v-list-item>
      </div>

    </v-navigation-drawer></div>
</template>

<script>
import FilesCreate from './FilesCreate'
import FilesTree from './FilesTree'
import store from '../store.js'

export default {
  components: { FilesCreate, FilesTree },
  props: ['miniDrawer'],
  data: () => ({
    createMenu: false,
    menu: false,
    store: store.data,
    drawerHover: false
  }),
  methods: {
    downloadZip() {
      window.location.href = '/zip'
    }
  },
  computed: {
    mini: function() {
      return this.miniDrawer && !this.drawerHover && !this.createMenu
    }
  },

  watch: {
    mini: function(oldV, newV) {
      this.$emit('drawerChange', newV)
    }
  }
}

</script>


<style>
.v-navigation-drawer__content {
  overflow-y: hidden !important;
}


</style>
