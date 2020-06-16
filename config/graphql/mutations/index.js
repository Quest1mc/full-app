const axios = require('axios');

const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
} = require('graphql');

const User = require('../../mongoose/models/User');
const Portal = require('../../mongoose/models/Portal');
const Keywords = require('../../mongoose/models/Keywords');

// Types
const UserType = require('../types/UserType');
const PortalType = require('../types/PortalType');
const KeywordType = require('../types/KeywordType');
const FacebookType = require('../types/FacebookType');
const InstagramType = require('../types/InstagramType');
const InputFacebookType = require('../types/InputFacebookType');
const InputSettingsType = require('../types/InputSettingsType');
const InputKeywordType = require('../types/InputKeywordType');

module.exports = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      description: 'Add a  User',
      args: {
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        wachtwoord: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const user = new User({
          firstname: args.firstname,
          lastname: args.lastname,
          email: args.email,
          wachtwoord: args.wachtwoord,
        });
        console.log('User', user);
        user.save((err, a) => {
          if (err) return console.error(err);
          console.log('after save: ', a);
        });
        console.log(args);
        return user;
      },
    },
    // update user starts here
    updateUser: {
      type: UserType,
      description: 'Update a  User',
      args: {
        id: { type: GraphQLID },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        wachtwoord: { type: GraphQLString },
        companyname: { type: GraphQLString },
        address: { type: GraphQLString },
        pobox: { type: GraphQLString },
        city: { type: GraphQLString },
        country: { type: GraphQLString },
        telephone: { type: GraphQLString },
        ww: { type: GraphQLString },
        accountstatus: { type: GraphQLString },
        profilepic: { type: GraphQLString },
        pagetitle: { type: GraphQLString },
        pitch: { type: GraphQLString },
        backgroundimage: { type: GraphQLString },
        keywords: { type: new GraphQLList(InputKeywordType) },
        profession: { type: GraphQLString },
        genre: { type: GraphQLString },
        pageRules: { type: GraphQLString },
        pageContent: { type: GraphQLString },
        hyperlinks: { type: GraphQLString }, // fb,youtube,insta
        pageBuilder: { type: GraphQLString },
        portals: { type: GraphQLString },
        socialmedia: { type: GraphQLString },
        oauth: { type: GraphQLBoolean },
        referral: { type: GraphQLBoolean },
        admin: { type: GraphQLBoolean },
      },
      resolve: (parent, args, request) => {
        // console.log('this is the session', request.session.passport.user);
        const sessionId = request.session.passport.user;
        if (!sessionId) {
          throw new Error('you are not logged in');
        }
        if (sessionId !== args.id && User.admin === false) {
          throw new Error('you are not authorised');
        }
        const user = {
          id: args.id,
          firstname: args.firstname,
          lastname: args.lastname,
          email: args.email,
          wachtwoord: args.wachtwoord,
          companyname: args.companyname,
          profilepic: args.profilepic,
          address: args.address,
          pobox: args.pobox,
          city: args.city,
          country: args.country,
          telephone: args.country,
          pagetitle: args.pagetitle,
          pitch: args.pitch,
          backgroundimage: args.backgroundimage,
          keywords: args.keywords,
          profession: args.profession,
          genre: args.genre,
          pageRules: args.pageRules,
          pageContent: args.pageContent,
          hyperlinks: args.hyperlinks, // fb,youtube,insta
          pageBuilder: args.pageBuilder,
          portals: args.portals,
          socialmedia: args.socialmedia,
          oauth: args.oauth,
          referral: { type: args.referral },
        };
        console.log(args.keywords);
        // find user and then add info with .update
        // how do you find user?
        const query = { _id: args.id };
        // console.log(query);
        const a = User.findByIdAndUpdate(
          query,
          {
            ...args,
          },
          (err, docs) => {
            console.log(err, docs);
          },
        );
        return user;
      },
    },
    deleteUser: {
      type: PortalType,
      description: 'Delete a  User',
      args: {
        id: { type: GraphQLString },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
      },
      resolve: (parent, args, request) => {
        const sessionId = request.session.passport.user;
        if (!sessionId) {
          throw new Error('you are not logged in');
        }
        if (sessionId !== args.id && User.admin === false) {
          throw new Error('you are not authorised');
        }
        User.deleteOne({ _id: args.id }, (err) => {
          if (err) return console.log(err);
          // deleted at most one user document
        });
        return args;
      },
    },
    createPortal: {
      type: PortalType,
      description: 'Add a  portal',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        type: { type: GraphQLString },
        typeof2: { type: GraphQLString },
        settings: { type: InputSettingsType },
        layout: { type: GraphQLString },
        pages: { type: GraphQLString },
        footer: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: (parent, args, request) => {
        const sessionId = request.session.passport.user;
        if (!sessionId) {
          throw new Error('you are not logged in');
        }
        if (User.admin === false) {
          throw new Error('you are not authorised');
        }

        const portal = new Portal({
          id: args.id,
          name: args.name,
          type: args.type,
          typeof2: args.typeof2,
          settings: args.settings,
          layout: args.layout,
          pages: args.pages,
          footer: args.footer,
          title: args.title,
          description: args.description,
        });
        console.log('Portal', portal);
        portal.save((err, a) => {
          if (err) return console.error(err);
          console.log('after save: ', a);
        });
        console.log(args);
        return portal;
      },
    },
    updatePortal: {
      type: PortalType,
      description: 'Update a  Portal',
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        type: { type: GraphQLString },
        typeof2: { type: GraphQLString },
        settings: { type: InputSettingsType },
        layout: { type: GraphQLString },
        pages: { type: GraphQLString },
        footer: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: (parent, args, request) => {
        const sessionId = request.session.passport.user;
        if (!sessionId) {
          throw new Error('you are not logged in');
        }
        if (sessionId !== args.id || User.admin === false) {
          throw new Error('you are not authorised');
        }
        const portal = {
          id: args.id,
          name: args.name,
          type: args.type,
          typeof2: args.typeof2,
          settings: args.settings,
          layout: args.layout,
          pages: args.pages,
          footer: args.footer,
          title: args.title,
          description: args.description,
        };

        const query = { _id: args.id };
        // console.log(query);
        const a = Portal.updateOne(
          query,
          {
            ...args,
          },
          (err, docs) => {
            //
          },
        );

        return portal;
      },
    },
    deletePortal: {
      type: PortalType,
      description: 'Delete a  portal',
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve: (parent, args, request) => {
        const sessionId = request.session.passport.user;
        if (!sessionId) {
          console.error('you are not logged in');
        }
        if (sessionId !== args.id && User.admin === false) {
          console.error('you are not authorised');
        }

        Portal.deleteOne({ _id: args.id }, (err) => {
          if (err) return console.log(err);
          // deleted at most one portal document
        });

        return args;
      },
    },
    addKeyword: {
      type: KeywordType,
      description: 'Add a  Keyword',
      args: {
        keyword: { type: GraphQLString },
      },
      resolve: (parent, args, request) => {
        const sessionId = request.session.passport.user;
        if (!sessionId) {
          throw new Error('you are not logged in');
        }
        // if (sessionId !== args.id || User.admin === false) {
        //   throw new Error('you are not authorised');
        // }
        const keyword = new Keywords({
          keyword: args.keyword,
        });
        console.log('Keywords', keyword);
        keyword.save((err, a) => {
          if (err) return console.error(err);
          console.log('after save: ', a);
        });
        console.log(args);
        return keyword;
      },
    },

    selectFacebookPage: {
      type: FacebookType,
      description:
        'Gets all the accounts we want from facebook once a user has granted permissions',
      args: {
        pageName: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        try {
          // get user
          const user = await User.findById(request.session.passport.user);
          user.selectedFacebookPage = args.pageName;

          await user.save();
        } catch (e) {
          console.log(e);
        }
      },
    },

    getFacebookPageContent: {
      type: FacebookType,
      description: 'Gets all the content we want from facebook once a user has granted permissions',
      args: {
        id: { type: GraphQLString },
        accessToken: { type: GraphQLString },
        fanCount: { type: GraphQLString },
        pageName: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        // AUTHENTICATION NOT REQUIRED FOR THESE ENDPOINTS

        // const sessionId = request.session.passport.user;
        // console.log(sessionId);
        // if (!sessionId) {
        //   throw new Error('you are not logged in');
        // }
        // if (sessionId !== args.id && User.admin === false) {
        //   throw new Error('you are not authorised');
        // }
        try {
          console.log('next step is getcontent');
          const user = await User.findById(args.id);
          const { pageName } = args;
          // eslint-disable-next-line camelcase
          const { access_token } = user.facebookpages.find((item) => (item) =>
            item === `${pageName}`,
          );
          const { id } = user.facebookpages.find((item) => (item) => item === `${pageName}`);
          console.log(pageName, access_token, id);
          const fieldsToGet =
            'birthday,about,band_members,bio,connected_instagram_account,contact_address,cover,current_location,description,display_subtext,emails,engagement,fan_count,featured_video,founded,general_info,genre,global_brand_page_name,global_brand_root_id,hometown,instagram_business_account,is_community_page,is_owned,is_published,is_webhooks_subscribed,link,location,name,page_token,personal_info,personal_interests,phone,place_type,single_line_address,username,published_posts,videos';
          // eslint-disable-next-line camelcase
          const getAccountContents = `https://graph.facebook.com/${id}?fields=${fieldsToGet}&access_token=${access_token}`;
          const fbpageContent = await axios.get(getAccountContents);

          user.facebookPageContents = fbpageContent.data;

          await user.save();

          return fbpageContent.data;
        } catch (e) {
          console.log(e);
        }
      },
    },
    getInstagramPageContent: {
      type: InstagramType,
      description:
        'Gets all the content we want from Instagram once a user has granted permissions',
      args: {
        id: { type: GraphQLString },
        accessToken: { type: GraphQLString },
        fanCount: { type: GraphQLString },
        pageName: { type: GraphQLString },
      },
      resolve: async (parent, args, request) => {
        console.log('getInstagramPageContent!!!', args);
        // AUTHENTICATION NOT REQUIRED FOR THESE ENDPOINTS

        // const sessionId = request.session.passport.user;
        // if (!sessionId) {
        //   throw new Error('you are not logged in');
        // }
        // if (sessionId !== args.id && User.admin === false) {
        //   throw new Error('you are not authorised');
        // }
        try {
          console.log('next step is getcontent');
          const user = await User.findById(args.id);

          const { accessToken } = user.tokens.find((item) => item.kind === 'instagram');
          // console.log(accessToken);
          const fieldsToGet = 'id,account_type,media_count,username,media';

          const getAccountContents = `https://graph.instagram.com/me?fields=${fieldsToGet}&access_token=${accessToken}`;
          //         `https://graph.instagram.com/{media-id}?fields=${fieldsToGet}&access_token=${access_token}`;
          // `https://graph.instagram.com/me/media?fields=${fieldsToGet}&access_token=${access_token}`
          console.log(getAccountContents);
          const instaPageContent = await axios.get(getAccountContents);
          console.log(instaPageContent);

          user.instagramContents = instaPageContent.data;
          // console.log('this is before save ', user.instagramContents);
          await user.save();
          // console.log('this is after save ', user.instagramContents);

          return instaPageContent.data;
        } catch (e) {
          // console.log(e);
        }
      },
    },
    getYoutubeContents: {
      type: UserType,
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

          console.log('videos', videos);
          user.videos = videos;
          // console.log('this is before save ', user.instagramContents);
          await user.save();
          // console.log('this is after save ', user.instagramContents);

          return user.videos;
        } catch (e) {
          console.log(e);
        }
      },
    },
  }),
});
