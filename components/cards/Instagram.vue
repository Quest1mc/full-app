<template>
  <base-card class="content-card--instagram" style="min-height: 250px; overflow: hidden;">
    <template v-slot:icon>
      <v-icon color="white">mdi-instagram</v-icon>
    </template>

    <v-img aspect-ratio="1" cover :lazy-src="thumbs[0]" :src="thumbs[1]" />
    <!-- <v-responsive aspect-ratio="1" v-else-if="item.type === 'Video'" class="black">
      <video-player :options="videoOptions" />
    </v-responsive> -->

    <div class="ma-2" v-if="item.description || item.title">
      <div v-if="!clipped" v-text="item.description || item.title"></div>
      <div v-else v-line-clamp:24="5" v-text="item.description || item.title"></div>
    </div>
  </base-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { ContentItem } from '@/types';

import BaseCard from './Base.vue';

import { VideoJsPlayerOptions } from 'video.js';
import moment from 'moment';

export default Vue.extend({
  props: {
    item: {
      type: Object as () => ContentItem,
    },

    clipped: {
      type: Boolean,
    },
  },

  data() {
    return {
      isActive: false,
    };
  },

  components: {
    BaseCard,
  },

  computed: {
    thumbs(): string[] {
      return [
        this.item.metadata.images.thumbnail.url,
        this.item.metadata.images.low_resolution.url,
      ];
    },

    date(): string {
      return moment(this.item.date).calendar();
    },

    videoOptions(): VideoJsPlayerOptions {
      return {
        sources: [
          {
            src: this.item.metadata.videos.standard_resolution.url,
            type: 'video/mp4',
          },
        ],
        controls: true,
        autoplay: false,
        preload: 'auto',
      };
    },
  },
});
</script>

<style></style>
