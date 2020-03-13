<template>
  <div>
    <div class="display-3 text-center font-weight-regular mt-12">Videos</div>
    <videos class="mt-8" />
    <div class="display-3 text-center font-weight-regular mt-12">Latest updates</div>
    <latest-updates class="mt-8" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Videos from '@/containers/videos';
import LatestUpdates from '@/containers/latest-updates';

export default Vue.extend({
  components: {
    LatestUpdates,
    Videos,
  },

  props: {
    theme: {
      type: Object,
      default: null,
    },
  },
});
</script>

<style></style>
