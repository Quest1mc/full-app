const axios = require('axios');

const { GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');

const User = require('../../mongoose/models/User');
const Portal = require('../../mongoose/models/Portal');
const Keywords = require('../../mongoose/models/Keywords');

// Types
const UserType = require('../../graphql/types/UserType');
const PortalType = require('../../graphql/types/PortalType');
const KeywordType = require('../../graphql/types/KeywordType');
const InstagramType = require('../../graphql/types/InstagramType');
const youtubeVideo = require('../../graphql/types/YoutubeVideo');

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

    getInstagramPageContent: {
      type: new GraphQLList(InstagramType),
      description:
        'Gets all the content we want from Instagram once a user has granted permissions',
      args: {
        id: { type: GraphQLString },
        accessToken: { type: GraphQLString },
        fanCount: { type: GraphQLString },
        pageName: { type: GraphQLString },
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
          return instaPageContent.data || user;
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
        channelID: { type: GraphQLString },
        uploadID: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        // AUTHENTICATION NOT REQUIRED FOR THESE ENDPOINTS

        // const sessionId = request.session.passport.user;
        // if (!sessionId) {
        //   throw new Error('you are not logged in');
        // }
        // if (sessionId !== args.id && User.admin === false) {
        //   throw new Error('you are not authorised');
        // }
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
