<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    right
    app
    clipped
    bottom
    width="100%"
    fixed
    style="max-width: 800px"
  >
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { ContentItem, Nullable } from '@/types';

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    item: {
      type: Object as () => Nullable<ContentItem>,
      default: null,
    },
  },
});
</script>

<style></style>
