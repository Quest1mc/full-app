const axios = require('axios');

const { GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');

const User = require('../../mongoose/models/User');
const Portal = require('../../mongoose/models/Portal');
const Keywords = require('../../mongoose/models/Keywords');

// Types
const UserType = require('../types/UserType');
const PortalType = require('../types/PortalType');
const KeywordType = require('../types/KeywordType');
const InstagramType = require('../types/InstagramType');
const youtubeVideo = require('../types/YoutubeVideo');
const FacebookType = require('../types/FacebookType');
const FacebookContentType = require('../types/FacebookPageContentType');

module.exports = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    portal: {
      type: PortalType,
      description: 'A single portal',
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) =>
        Portal.findOne({ _id: args.id }, (err, docs) => {
          console.log(err, docs);
        }),
    },
    portals: {
      type: new GraphQLList(PortalType),
      description: 'List of all portals',
      resolve: () =>
        Portal.find({}, (err, docs) => {
          console.log(err, docs);
        }),
    },
    users: {
      type: new GraphQLList(UserType),
      description: 'List of all user',
      args: {
        keywords: { type: GraphQLString },
      },
      resolve: () =>
        User.find({}, (err, docs) => {
          // docs.forEach
          console.log(err, docs);
        }),
    },
    user: {
      type: UserType,
      description: 'A single user',
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) =>
        User.findOne({ _id: args.id }, (err, docs) => {
          // console.log(err, docs);
        }),
    },
    keyword: {
      type: KeywordType,
      description: 'A single keyword that denotes an interest of a user',
      args: {
        id: { type: GraphQLID },
        keyword: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        Keywords.findOne({ _id: args.id }, (err, docs) => {
          // do not use a find one here please look up and use a 3 letter matching system
          console.log(err, docs);
        }),
    },
    keywords: {
      type: new GraphQLList(KeywordType),
      description: 'List of all Keywords',
      resolve: () =>
        Keywords.find({}, (err, docs) => {
          // docs.forEach
          console.log(err, docs);
        }),
    },

    getFacebookPageContent: {
      type: GraphQLList(FacebookContentType),
      description: 'Gets all the content we want from facebook once a user has granted permissions',
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        try {
          const user = await User.findById(args.id);
          // eslint-disable-next-line camelcase

          const { accessToken } = user.tokens.find((item) => item.kind === 'facebook');

          const fieldsToGet =
            'birthday,about,band_members,bio,connected_instagram_account,contact_address,cover,current_location,description,display_subtext,emails,engagement,fan_count,featured_video,founded,general_info,genre,global_brand_page_name,global_brand_root_id,hometown,instagram_business_account,is_community_page,is_owned,is_published,is_webhooks_subscribed,link,location,name,page_token,personal_info,personal_interests,phone,place_type,single_line_address,username,published_posts,videos';
          // eslint-disable-next-line camelcase
          const getAccountContents = `https://graph.facebook.com/${user.facebookId}?fields=${fieldsToGet}&access_token=${accessToken}`;
          const fbpageContent = await axios.get(getAccountContents);

          console.log(fbpageContent.data);

          return fbpageContent.data;
        } catch (e) {
          console.log(e);
        }
      },
    },

    getInstagramPageContent: {
      type: new GraphQLList(InstagramType),
      description:
        'Gets all the content we want from Instagram once a user has granted permissions',
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        try {
          const user = await User.findById(args.id);

          const { accessToken } = user.tokens.find((item) => item.kind === 'instagram');
          // console.log(accessToken);
          const fieldsToGet = 'id,account_type,media_count,username,media';

          const getAccountContents = `https://graph.instagram.com/me?fields=${fieldsToGet}&access_token=${accessToken}`;
          //         `https://graph.instagram.com/{media-id}?fields=${fieldsToGet}&access_token=${access_token}`;
          // `https://graph.instagram.com/me/media?fields=${fieldsToGet}&access_token=${access_token}`

          const instaPageContent = await axios.get(getAccountContents);

          console.log(instaPageContent.data.media.data);
          return instaPageContent.data.media.data;
        } catch (e) {
          console.log(e);
        }
      },
    },

    getYoutubeContents: {
      type: new GraphQLList(youtubeVideo),
      description: 'A gets youtube video contents of a user',
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        try {
          const user = await User.findById(args.id);
          console.log('next step is getchannel');
          const apiKey = process.env.GOOGLE_YOUTUBE_API_KEY;
          const { accessToken } = user.tokens.find((item) => item.kind === 'google');

          const getChannelID = `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&key=${apiKey}`;
          // console.log('ran getChannelID ');
          let channelID = null;
          await axios
            .get(getChannelID, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
              channelID = response.data.items[0].id;
              console.log('channelID', response.data.items[0].id);
            })
            .catch((err) => console.log(err));

          const getUploadID = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelID}&key=${process.env.GOOGLE_YOUTUBE_API_KEY}`;
          let uploadID = null;
          await axios
            .get(getUploadID, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
              uploadID = response.data.items[0].contentDetails.relatedPlaylists.uploads;
              console.log(
                'getUploadID',
                response.data.items[0].contentDetails.relatedPlaylists.uploads,
              );
            })
            .catch((err) => console.log(err));
          const videoPlaylistURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadID}&key=${process.env.GOOGLE_YOUTUBE_API_KEY}`;

          let videos = [];
          await axios
            .get(videoPlaylistURL, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
              console.log('videoPlaylistURL', response.data);
              videos = response.data.items;
            })
            .catch((err) => console.log(err));

          return videos;
        } catch (e) {
          console.log(e);
        }
      },
    },
  }),
});
