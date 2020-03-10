<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <main-navigation-bar />
    <portal-bar v-if="portal" :portal="portal" />

    <v-content>
      <v-container>
        <v-row class="flex-nowrap">
          <cms-navigation v-if="portal" :portal="portal" />
          <v-sheet class="px-12 py-4 flex-grow-1" color="transparent">
            <nuxt />
          </v-sheet>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import MainNavigationBar from '@/partials/layouts/MainNavigationBar.vue';
import CmsNavigation from '@/partials/layouts/cms/Navigation.vue';
import PortalBar from '@/components/navbars/PortalBar.vue';

export default Vue.extend({
  name: 'App',

  components: {
    MainNavigationBar,
    PortalBar,
    CmsNavigation,
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
