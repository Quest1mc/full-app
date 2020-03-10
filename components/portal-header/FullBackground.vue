<template>
  <div>
    <v-sheet class="portal-header--full-background" elevation="1">
      <v-img
        height="650"
        cover
        :src="image"
        class="text-center align-center"
        gradient="to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)"
      >
        <v-avatar size="256" class="elevation-">
          <v-img :src="avatar" />
        </v-avatar>

        <div class="white--text mt-5">
          <div class="font-weight-bold ml-n12">heythis.is</div>
          <div class="display-3 mt-2 font-weight-bold">{{ title }}</div>
        </div>
      </v-img>
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
  },

  computed: {
    avatar(): string {
      return this.portal.profile.avatar;
    },

    image(): string {
      return `data:image/png;base64,${this.portal.profile.backgroundImage}`;
    },

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

<style lang="scss" scoped>
.v-sheet {
  position: relative;
}

.portal-header {
  &__content {
    $offset: 15%;

    position: absolute;
    left: 50%;
    top: 50%;
    width: 60%;
    transform: translate(-50% - $offset, -50%);
    text-align: center;

    &:before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 50% - $offset;
      z-index: -1;
      background-color: rgba(#000, 0.15);
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
