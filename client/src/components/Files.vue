
 <template>
    <v-navigation-drawer
      class="pt-4 elevation-10"
      app
      absolute
      persistent
      clipped
      expand-on-hover
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
          <v-btn v-on="on" icon x-large>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          </template>
          <span>New file or directory</span>
        </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-divider class="mt-12"></v-divider>

      <v-list-item nav>
        <v-list-item-content>
        
      </v-list-item-content>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
  })

}

</script>
