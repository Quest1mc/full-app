<template>
  <v-scale-transition group class="row">
    <v-col
      cols="6"
      sm="4"
      md="4"
      lg="3"
      v-for="(item, index) in items"
      :key="item.id"
      @click="$emit('select', item)"
    >
      <slot name="item" v-bind="{ item, index }" />
    </v-col>
  </v-scale-transition>
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
