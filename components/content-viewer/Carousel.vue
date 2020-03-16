<template>
  <v-img v-bind="$attrs" cover width="100%" height="auto" :src="source" />
</template>

<script lang="ts">
import Vue from 'vue';
import { ContentItem, Nullable } from '@/types';

export default Vue.extend({
  props: {
    item: {
      type: Object as () => ContentItem,
    },
  },

  computed: {
    source(): Nullable<string> {
      switch (this.item.channel) {
        case 'Instagram':
          return this.item.metadata.images.standard_resolution.url;
        default:
          return null;
      }
    },
  },
});
</script>
