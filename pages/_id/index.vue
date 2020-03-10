<template>
  <v-container v-if="portal">
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <portal-header :portal="portal" :settings="settings" />
        <component :is="pageType" :portal="portal" :settings="settings" />
        <div class="mt-12 text-center">
          <v-btn outlined x-large :to="`/${portal.site}/cms`">Edit</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

import PremiumPage from '@/partials/_id/Premium.vue';
import BasicPage from '@/partials/_id//Basic.vue';
import PortalHeader from '@/components/portal-header';
import { Portal, PortalSettings } from '@/types';

export default Vue.extend({
  layout: 'portal',

  components: {
    PortalHeader,
  },

  computed: {
    portal(): Portal {
      return this.$store.getters['portals/get:current'];
    },

    settings(): PortalSettings {
      return this.$store.getters['portalSettings/get:current'];
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
    await store.dispatch('portalSettings/fetch:settings', params.id);
    await store.dispatch('portals/fetch:portal', params.id);
  },
});
</script>

<style></style>
