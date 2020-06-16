<template>
  <div class="text-center mt-10">
    <v-btn @click="getYoutube"><v-icon left>mdi-youtube</v-icon>Youtube</v-btn>
    <v-btn @click="getFacebook"><v-icon left>mdi-facebook</v-icon>Facebook</v-btn>
    <v-btn @click="getInstagram"><v-icon left>mdi-instagram</v-icon>Instagram</v-btn>

    <pre v-html="content" class="mt-5" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const GET_YOUTUBE_CONTENT = require('@/config/graphql/gql/GetYoutubeContent.gql');
const GET_FACEBOOK_CONTENT = require('@/config/graphql/gql/GetFacebookContent.gql');
const GET_INSTAGRAM_CONTENT = require('@/config/graphql/gql/GetInstagramContent.gql');

export default Vue.extend({
  data() {
    return {
      content: [],
    };
  },

  methods: {
    async getContent(query: any, key: string) {
      try {
        const videos = await this.$apollo.query({
          query,
          variables: { id: this.$store.state.account.user._id },
        });

        this.content = videos.data[key];

        console.log(videos.data[key]);
      } catch (e) {
        console.log(e);
      }
    },

    getYoutube() {
      return this.getContent(GET_YOUTUBE_CONTENT, 'getYoutubeContents');
    },

    getFacebook() {
      return this.getContent(GET_FACEBOOK_CONTENT, 'getFacebookPageContent');
    },

    getInstagram() {
      return this.getContent(GET_INSTAGRAM_CONTENT, 'getInstagramPageContent');
    },
  },
});
</script>
