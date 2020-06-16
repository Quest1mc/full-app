<template>
  <div class="text-center mt-10">
    <v-btn @click="getYoutube"><v-icon left>mdi-youtube</v-icon>Youtube</v-btn>
    <v-btn @click="getFacebook" :disabled="!page"><v-icon left>mdi-facebook</v-icon>Facebook</v-btn>
    <v-btn @click="getInstagram"><v-icon left>mdi-instagram</v-icon>Instagram</v-btn>

    <v-select
      :items="pages"
      v-model="page"
      item-value="name"
      item-text="name"
      style="width: 300px;"
      return-object
      outlined
    />

    <pre v-html="content" class="mt-5" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Nullable } from '../../../types';

const GET_YOUTUBE_CONTENT = require('@/config/graphql/gql/GetYoutubeContent.gql');
const GET_FACEBOOK_CONTENT = require('@/config/graphql/gql/GetFacebookContent.gql');
const GET_INSTAGRAM_CONTENT = require('@/config/graphql/gql/GetInstagramContent.gql');
const GET_FACEBOOK_PAGES = require('@/config/graphql/gql/GetFacebookPages.gql');

export default Vue.extend({
  data() {
    return {
      content: [],
      pages: [],
      page: null as Nullable<any>,
    };
  },

  mounted() {
    this.fetchPages();
  },

  methods: {
    async fetchPages() {
      const pages = await this.$apollo.query({
        query: GET_FACEBOOK_PAGES,
        variables: { id: this.$store.state.account.user._id },
      });

      this.pages = pages.data.getFacebookPages;

      console.log(this.pages);
    },

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

    async getFacebook() {
      const videos = await this.$apollo.query({
        query: GET_FACEBOOK_CONTENT,
        variables: { id: this.page.id, token: this.page.access_token },
      });

      this.content = videos.data.getFacebookPageContent;

      console.log(videos.data.getFacebookPageContent);
    },

    getInstagram() {
      return this.getContent(GET_INSTAGRAM_CONTENT, 'getInstagramPageContent');
    },
  },
});
</script>
