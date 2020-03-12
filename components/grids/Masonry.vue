<template>
  <div>
    <no-ssr>
      <masonry :cols="{ default: 3, 700: 2 }" :gutter="20">
        <div v-for="(item, index) in items" :key="item.id" @click="$emit('select', item)">
          <slot name="item" v-bind="{ item, index }" />
        </div>
      </masonry>
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
