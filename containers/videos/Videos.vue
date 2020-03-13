<template>
  <v-row justify="center">
    <v-col cols="12" sm="6" v-for="video in videos" :key="video.id">
      <content-card :item="video" hide-details elevation="1" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { Portal, ContentItem } from '@/types';

import ContentCard from '@/components/cards/Content.vue';

export default Vue.extend({
  components: {
    ContentCard,
  },

  computed: {
    portal(): Portal {
      return this.$store.getters['portals/get:current'];
    },

    videos(): ContentItem[] {
      return this.portal.cards.filter((card) => card.type === 'Video').slice(0, 2);
    },
  },
});
</script>

<style></style>
