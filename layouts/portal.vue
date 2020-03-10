<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <main-navigation-bar />
    <portal-bar :portal="portal" />
    <v-content>
      <nuxt />
    </v-content>
    <media-drawer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import MainNavigationBar from '@/partials/layouts/MainNavigationBar.vue';
import PortalBar from '@/components/navbars/PortalBar.vue';
import MediaDrawer from '@/partials/MediaDrawerWrapper.vue';

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

    portal() {
      return this.$store.getters['portals/get:current'];
    },
  },
});
</script>
