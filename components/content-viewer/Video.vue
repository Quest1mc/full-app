<template>
  <youtube player-width="100%" v-if="item.channel === 'YouTube'" :video-id="item.id" />
  <video-player v-else :options="videoOptions" />
</template>

<script lang="ts">
import Vue from 'vue';
import { ContentItem } from '@/types';
import { VideoJsPlayerOptions } from 'video.js';
import VideoPlayer from '@/components/video-player';

export default Vue.extend({
  props: {
    item: {
      type: Object as () => ContentItem,
    },
  },

  components: {
    VideoPlayer,
  },

  computed: {
    source(): string {
      switch (this.item.channel) {
        case 'Instagram':
          return this.item.metadata.images.standard_resolution.url;
        default:
          return '';
      }
    },

    videoOptions(): VideoJsPlayerOptions {
      return {
        sources: [
          {
            src: this.source,
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
