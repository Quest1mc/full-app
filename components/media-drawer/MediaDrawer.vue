<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    right
    app
    bottom
    width="100%"
    temporary
    fixed
    style="max-width: 40vw;"
  >
    <template v-if="item">
      <content-viewer :item="item" />

      <div class="pa-3">
        <div class="title" v-if="item.title" v-text="item.title" />
        <div
          class="body-1 mt-3"
          v-if="item.description && item.description !== item.title"
          v-text="item.description"
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { ContentItem, Nullable } from '@/types';
import ContentViewer from '@/components/content-viewer';

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

  components: {
    ContentViewer,
  },
});
</script>

<style></style>
