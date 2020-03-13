<template>
  <v-sheet style="position: relative;" elevation="1">
    <slot />
    <div
      v-if="$slots['icon']"
      style="position: absolute; top: 0; right: 0;"
      class="black pa-1 elevation-1"
    >
      <slot name="icon" />
    </div>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    aspectRatio: {
      type: Number,
      default: 1,
    },

    icon: {
      type: String,
      default: null,
    },
  },
});
</script>
