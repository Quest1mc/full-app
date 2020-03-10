<template>
  <div class="mt-12">
    <timeline :items="portal.cards" v-if="portal.cards.length" @select="selectItem" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Timeline from '@/components/timeline';
import { Portal, ContentItem } from '@/types';

export default Vue.extend({
  props: {
    portal: {
      type: Object as () => Portal,
      default: null,
    },
  },

  components: {
    Timeline,
  },

  methods: {
    selectItem(item: ContentItem) {
      console.log('selectItem', item);
      this.$store.commit('media/set:selected', item);
    },
  },
});
</script>

<style></style>
