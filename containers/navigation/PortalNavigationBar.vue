<template>
  <v-app-bar
    shrink-on-scroll
    app
    fixed
    prominent
    color="black"
    dark
    flat
    class="v-toolbar--portal"
    clipped-right
    min-height="70"
  >
    <div
      style="font-size: 2.5em; color: #d59154;"
      class="font-weight-bold align-self-center"
      v-text="title"
    ></div>
    <v-spacer></v-spacer>

    <v-btn to="/netwerk" class="text-lowercase headline font-weight-bold align-self-center" text>
      ambassadors
    </v-btn>
    <v-btn to="/videowall" class="text-lowercase headline font-weight-bold align-self-center" text>
      updates
    </v-btn>
    <v-btn to="/readmore" class="text-lowercase headline font-weight-bold align-self-center" text>
      videos
    </v-btn>
    <v-btn to="/readmore" class="text-lowercase headline font-weight-bold align-self-center" text>
      events
    </v-btn>
    <v-btn to="/readmore" class="text-lowercase headline font-weight-bold align-self-center" text>
      creatives
    </v-btn>
    <v-btn to="/readmore" class="text-lowercase headline font-weight-bold align-self-center" text>
      places
    </v-btn>

    <auth-bar />
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Portal } from '@/types';
import AuthBar from './AuthBar.vue';

export default Vue.extend({
  components: {
    AuthBar,
  },

  data() {
    return {};
  },

  computed: {
    signedIn(): boolean {
      return this.$store.getters['account/isAuthenticated'];
    },

    portal(): Portal {
      return this.$store.getters['portals/get:current'];
    },

    title(): string {
      return this.portal.site;
    },
  },

  methods: {
    signIn() {
      this.$store.dispatch('account/signIn');
    },

    signOut() {
      this.$store.dispatch('account/signOut');
    },
  },
});
</script>

<style lang="scss">
.v-toolbar--portal .v-toolbar__content {
  min-height: 70px;
}

.v-toolbar--portal .v-toolbar--auth {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
}
</style>
