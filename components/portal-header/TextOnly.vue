<template>
  <div>
    <v-sheet
      class="portal-header--text-only justify-center d-flex flex-column py-8 pr-8"
      :elevation="flat ? 0 : 1"
      min-height="300"
    >
      <div style="padding-left: 100px;">
        <div class="font-weight-bold">heythis.is</div>
        <div class="display-3 ml-n8 my-4 font-weight-bold">{{ title }}</div>
        <div style="max-width: 650px;">
          <span class="headline font-weight-bold" v-text="firstWord"></span>
          <span class="ml-1" v-text="description"></span>
        </div>
      </div>
    </v-sheet>

    <keywords :items="portal.profile.keywords" class="text-center mt-5" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Portal, PortalSettings } from '@/types';
import Keywords from '@/components/keywords';

export default Vue.extend({
  components: {
    Keywords,
  },

  props: {
    portal: {
      type: Object as () => Portal,
      default: null,
    },

    settings: {
      type: Object as () => PortalSettings,
      default: null,
    },

    flat: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    title(): string {
      if (!this.portal) {
        return '';
      }

      return (
        this.settings.header.title ||
        this.portal.profile.title ||
        `${this.portal.profile.firstName} ${this.portal.profile.lastName}`
      );
    },

    firstWord(): string {
      return this.portal.profile.description
        .split(' ')
        .slice(0, 3)
        .join(' ');
    },

    description(): string {
      return this.portal.profile.description
        .split(' ')
        .slice(3)
        .join(' ');
    },
  },
});
</script>

<style></style>
