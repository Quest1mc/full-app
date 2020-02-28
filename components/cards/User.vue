<template>
  <router-link :to="`/${user.site}`">
    <base-card class="user-card">
      <v-img :src="user.avatar" contain class="align-end">
        <div class="user-card__name py-4 text-left px-3 title">
          {{ user.site }}
        </div>
      </v-img>
    </base-card>
  </router-link>
</template>

<script>
import Vue from 'vue';
import BaseCard from './Base.vue';

export default Vue.extend({
  props: {
    user: {
      type: Object,
      default: null,
    },
  },

  components: {
    BaseCard,
  },
});
</script>

<style></style>
