<template>
  <base-card class="content-card--instagram">
    <template v-slot:icon>
      <v-icon color="white">mdi-instagram</v-icon>
    </template>

    <v-lazy v-model="isActive">
      <v-img
        aspect-ratio="1"
        v-if="item.type === 'Image' || item.type === 'Carousel'"
        cover
        width="100%"
        height="auto"
        :src="item.metadata.images.low_resolution.url"
      />
      <v-responsive aspect-ratio="1" v-else-if="item.type === 'Video'" class="black">
        <video-player :options="videoOptions" />
      </v-responsive>
    </v-lazy>

    <div class="ma-2" v-if="isActive && item.description" v-line-clamp:24="5">
      {{ item.description }}
    </div>
  </base-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { ContentItem } from '@/types';

import BaseCard from './Base.vue';
import VideoPlayer from '@/components/video-player';

import { VideoJsPlayerOptions } from 'video.js';
import moment from 'moment';

export default Vue.extend({
  props: {
    item: {
      type: Object as () => ContentItem,
    },
  },

  data() {
    return {
      isActive: false,
    };
  },

  components: {
    BaseCard,
    VideoPlayer,
  },

  computed: {
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

  methods: {
    click() {
      console.log('click.insta');
    },
  },
});
</script>

<style></style>
