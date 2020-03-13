<template>
  <base-card class="content-card--youtube">
    <template v-slot:icon>
      <v-icon color="white">mdi-youtube</v-icon>
    </template>

    <v-img cover :aspect-ratio="aspectRatio" :lazy-src="thumbs[0]" :src="thumbs[1]" />

    <div class="ma-2" v-if="!hideDetails && (item.description || item.title)">
      <div v-if="!clipped" v-text="item.description || item.title"></div>
      <div v-else v-line-clamp:24="5" v-text="item.description || item.title"></div>
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

    clipped: {
      type: Boolean,
    },

    hideDetails: {
      type: Boolean,
    },

    aspectRatio: {
      type: Number,
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
