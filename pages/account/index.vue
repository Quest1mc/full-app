<template>
  <v-container>
    <div class="pt-12 display-2 font-weight-bold text-center">
      Account
    </div>

    <v-row class="justify-center">
      <v-col cols="4">
        <profile class="mt-8" />
      </v-col>
    </v-row>

    <div class="headline font-weight-normal mt-3 text-center">
      Use your social network to connect to your heythis.is page.
    </div>
    <social-login class="mt-12 justify-center" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

import SocialLogin from '@/containers/social-login';
import Profile from '@/containers/profile';

export default Vue.extend({
  layout: 'default',

  components: {
    SocialLogin,
    Profile,
  },
});
</script>
