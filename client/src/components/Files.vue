 <template>
   <div @mouseover="mini=false" @mouseout="mini=true" style="overflow-y:hidden">
    <v-navigation-drawer
      class="elevation-10"
      app
      clipped
      permanent
      :mini-variant="mini && !createMenu"
      style="overflow-y: hidden;"
    >
        <v-list-item style="position: absolute;width:100%" class="my-3">
        <v-list-item-avatar large left class="secondary">
          <v-icon dark>mdi-file-tree</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="py-0 my-0">
          <v-list-item-title class="title">
            Files
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="py-0 my-0">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <v-menu
                  v-model="createMenu"
                  eager
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

      <v-list-item class="mt-12 pt-4 pr-0">
        <v-list-item-content>
          <FilesTree />
      </v-list-item-content>
    </v-list-item>
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
  })
}

</script>


<style>
.v-navigation-drawer__content {
  overflow-y: hidden !important;
}


</style>
