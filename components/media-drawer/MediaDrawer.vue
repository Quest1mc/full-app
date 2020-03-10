<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    right
    app
    width="100%"
    fixed
    temporary
    style="max-width: 500px"
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
