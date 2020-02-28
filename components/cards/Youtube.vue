<template>
  <base-card class="content-card--youtube" icon="mdi-youtube">
    <v-lazy transition="fade-transition" v-model="isActive">
      <youtube :video-id="item.id" player-width="100%" player-height="auto" />
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

  methods: {
    onReady() {
      this.isReady = true;
    },
  },
});
</script>
