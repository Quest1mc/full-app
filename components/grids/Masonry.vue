<template>
  <div>
    <no-ssr>
      <div v-masonry transition-duration="0.5s" item-selector=".item" class="masonry-container">
        <v-col
          v-masonry-tile
          class="item"
          cols="6"
          sm="4"
          v-for="(item, index) in items"
          :key="item.id"
          @click="$emit('select', item)"
        >
          <slot name="item" v-bind="{ item, index }" />
        </v-col>
      </div>
    </no-ssr>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ContentItem } from '@/types';

export default Vue.extend({
  props: {
    items: {
      type: Array as () => ContentItem[],
      default: [],
    },
  },
});
</script>

<style></style>
