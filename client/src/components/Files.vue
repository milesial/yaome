
 <template>
   <div @mouseover="mini=false" @mouseout="mini=true">
    <v-navigation-drawer
      class="pt-4 elevation-10"
      app
      persistent
      absolute
      clipped
      :mini-variant="mini && !createMenu"
    >
      <v-list-item  style="position:absolute;left:5px;height:48px;width:100%;" >
        <v-list-item-avatar large left class="secondary">
          <v-icon dark>mdi-file-tree</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            Files
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
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
      <v-divider class="mt-12"></v-divider>

      <v-list-item>
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
