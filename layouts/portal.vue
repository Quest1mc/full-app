<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <main-navigation-bar />
    <portal-bar />
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import MainNavigationBar from './MainNavigationBar.vue';
import PortalBar from './PortalBar.vue';

export default Vue.extend({
  name: 'App',

  components: {
    MainNavigationBar,
    PortalBar,
  },

  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },

  data: () => ({
    //
  }),
});
</script>
