<template>
  <justified-grid :items="items" :sm="3" :md="4" :lg="4" :xl="4">
    <template v-slot:item="{ item }">
      <content-card :aspect-ratio="3 / 2" :item="item" hide-details />
    </template>
  </justified-grid>
</template>

<script lang="ts">
import Vue from 'vue';
import { Justified as JustifiedGrid } from '@/components/grids';
import ContentCard from '@/components/cards/Content.vue';
import { Portal, ContentItem } from '@/types';

export default Vue.extend({
  components: {
    ContentCard,
    JustifiedGrid,
  },

  computed: {
    portal(): Portal {
      return this.$store.getters['portals/get:current'];
    },

    items(): ContentItem[] {
      return this.portal.cards;
    },
  },
});
</script>

<style></style>
