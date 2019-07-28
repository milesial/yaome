<template>
  <v-app>
    <v-content>
      <v-container grid-list-md fill-height>
        <v-layout
          text-center
          wrap
        >
          <v-flex xs2>
          </v-flex>
          <v-flex xs5 grow>
            <v-card class="panel"><EditPanel/></v-card>
          </v-flex>
          <v-flex xs5 grow>
            <v-card class="panel"><RenderPanel/></v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import RenderPanel from './components/RenderPanel';
import EditPanel from './components/EditPanel';

export default {
  name: 'App',
  components: {
    RenderPanel,
    EditPanel
  },
  data: () => ({

  }),
};
</script>

<style scoped>
.panel {
  overflow-x: auto;
  height: 100%;
}
</style>
