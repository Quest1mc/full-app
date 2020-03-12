<template>
  <base-card class="content-card--youtube" icon="mdi-youtube">
    <v-skeleton-loader type="card" v-if="!isActive" />

    <v-lazy transition="fade-transition" v-model="isActive">
      <v-img cover width="100%" height="auto" :src="thumbs[1]" />
      <!-- <youtube :video-id="item.id" player-width="100%" player-height="auto" /> -->
    </v-lazy>
    <div class="ma-2" v-if="isActive && (item.title || item.description)" v-line-clamp:24="5">
      {{ item.title || item.description }}
    </div>
  </base-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { ContentItem } from '@/types';

import BaseCard from './Base.vue';

export default Vue.extend({
  props: {
    item: {
      type: Object as () => ContentItem,
    },
  },

  data() {
    return {
      isActive: false,
      isReady: false,
    };
  },

  components: {
    BaseCard,
  },

  computed: {
    thumbs(): string[] {
      return [
        this.item.metadata.thumbnails.default.url,
        this.item.metadata.thumbnails.medium.url,
        this.item.metadata.thumbnails.high.url,
      ];
    },
  },

  methods: {
    onReady() {
      this.isReady = true;
    },
  },
});
</script>
