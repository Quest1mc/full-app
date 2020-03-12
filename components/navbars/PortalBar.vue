<template>
  <v-app-bar inverted-scroll app dense clipped-right color="white" class="flex-grow-0">
    <v-container>
      <v-row>
        <div class="d-flex align-center justify-center">
          <v-img
            alt="heythis.is Logo"
            class="mr-2"
            contain
            src="/images/img-logo__menu.png"
            width="88"
          />
        </div>

        <v-spacer></v-spacer>

        <div class="d-flex align-center justify-center" v-if="portal">
          <div class="title">{{ portal.profile.title }}</div>
          <v-avatar color="grey lighten-3" size="32" class="ml-3">
            <v-img :src="portal.profile.avatar" />
          </v-avatar>
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Portal } from '@/types';

export default Vue.extend({
  props: {
    portal: {
      type: Object as () => Portal,
      default: null,
    },
  },
});
</script>

<style></style>
