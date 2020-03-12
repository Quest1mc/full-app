<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <main-navigation-bar />
    <portal-bar />
    <v-content>
      <nuxt />
    </v-content>
    <media-drawer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import { PortalBar, MainNavigationBar } from '@/containers/navigation';
import MediaDrawer from '@/containers/media-drawer';

export default Vue.extend({
  name: 'App',

  components: {
    MainNavigationBar,
    MediaDrawer,
    PortalBar,
  },

  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },
});
</script>
