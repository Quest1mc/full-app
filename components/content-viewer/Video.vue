<template>
  <video-player :options="videoOptions" width="100%" />
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
      console.log(this.source);

      return {
        sources: [
          {
            src: this.source,
            type: 'video/mp4',
          },
        ],
        controls: true,
        autoplay: true,
        preload: 'auto',
      };
    },
  },
});
</script>
