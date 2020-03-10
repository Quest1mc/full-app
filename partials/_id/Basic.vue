<template>
  <div class="mt-12">
    <timeline :items="portal.cards" v-if="portal.cards.length" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Timeline from '@/components/timeline';
import { Portal } from '@/types';

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
});
</script>

<style></style>
