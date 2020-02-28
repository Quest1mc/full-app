<template>
  <v-container v-if="portal">
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <portal-header :portal="portal" />
        <component :is="pageType" :portal="portal" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

import PremiumPage from './components/Premium.vue';
import BasicPage from './components/Basic.vue';
import PortalHeader from '@/components/portal-header';
import { Portal } from '@/types';

export default Vue.extend({
  layout: 'portal',

  components: {
    PortalHeader,
  },

  computed: {
    portal(): Portal {
      return this.$store.getters['portals/get:current'];
    },

    pageType(): VueConstructor {
      switch (this.portal?.profile.type) {
        case 'premium':
          return PremiumPage;
        default:
          return BasicPage;
      }
    },
  },

  async fetch({ store, params }) {
    await store.dispatch('portals/fetch:portal', params.id);
  },
});
</script>

<style></style>
