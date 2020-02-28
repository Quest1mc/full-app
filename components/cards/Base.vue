<template>
  <v-sheet style="position: relative;" elevation="1">
    <v-responsive :aspect-ratio="aspectRatio">
      <slot />
    </v-responsive>

    <div v-if="$slots['icon']" style="position: absolute; top: 5px; right: 5px;">
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
