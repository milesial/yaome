 <template>
   <div @mouseover="mini=false" @mouseleave="mini=true" style="overflow-y:hidden">
    <v-navigation-drawer
      class="elevation-10"
      app
      clipped
      permanent
      :mini-variant="mini && !createMenu"
      mini-variant-width="50"
      style="overflow-y: hidden;"
    >
      <v-list-item style="position: absolute;" class="my-3 px-1">
        <v-list-item-avatar large left class="secondary">
          <v-icon dark>mdi-file-tree</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="py-0 my-0">
          <v-list-item-title class="title mr-6">
            Files
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="py-0 my-0 ml-12">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <v-menu
                  v-model="createMenu"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon x-large>
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
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-12 pt-4 mx-2 px-0">
        <v-list-item-content>
          <FilesTree
            :extended="!mini || createMenu"
          />
      </v-list-item-content>
    </v-list-item>
    <v-btn
      block
      text
      tile
      v-show="!mini || createMenu"
      absolute
      style="bottom:0;"
      @click="downloadZip()"
    >
      <v-icon class="mr-2">mdi-folder-zip</v-icon>
      Download as archive
    </v-btn>
  </v-navigation-drawer>
</div>
</template>

<script>
import FilesCreate from './FilesCreate'
import FilesTree from './FilesTree'
import store from '../store.js'

export default {
  components: { FilesCreate, FilesTree },
  data: () => ({
    mini: true,
    createMenu: false,
    store: store.data
  }),
  methods: {
    downloadZip() {
      window.location.href = '/zip'
    }
  }
}

</script>


<style>
.v-navigation-drawer__content {
  overflow-y: hidden !important;
}


</style>
