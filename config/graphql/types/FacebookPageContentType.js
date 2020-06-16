const {
  //   GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  //   GraphQLNonNull,
  GraphQLObjectType,
  //   GraphQLInputObjectType
} = require('graphql');

const VideoType = new GraphQLObjectType({
  name: 'VideoType',
  fields: () => ({
    description: { type: GraphQLString },
    updated_time: { type: GraphQLString },
    id: { type: GraphQLString },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    story: { type: GraphQLString },
    created_time: { type: GraphQLString },
    id: { type: GraphQLString },
  }),
});

const VideoContentType = new GraphQLObjectType({
  name: 'VideoContentType',
  fields: () => ({
    data: { type: GraphQLList(VideoType) },
  }),
});

const PostContentType = new GraphQLObjectType({
  name: 'PostContentType',
  fields: () => ({
    data: { type: GraphQLList(PostType) },
  }),
});

const FacebookPageContentType = new GraphQLObjectType({
  name: 'FacebookPageContent',
  description: 'this is the contents of the facebook page to be displayed in front end',
  fields: () => ({
    id: { type: GraphQLString },
    description: { type: GraphQLString },
    birthday: { type: GraphQLString },
    about: { type: GraphQLString },
    band_members: { type: GraphQLString },
    bio: { type: GraphQLString },
    connected_instagram_account: { type: GraphQLString },
    contact_address: { type: GraphQLString },
    cover: { type: GraphQLString }, // object
    current_location: { type: GraphQLString },
    display_subtext: { type: GraphQLString },
    emails: { type: GraphQLString },
    engagement: { type: GraphQLString }, // object
    fan_count: { type: GraphQLString },
    featured_video: { type: GraphQLString },
    founded: { type: GraphQLString },
    general_info: { type: GraphQLString },
    genre: { type: GraphQLString },
    global_brand_page_name: { type: GraphQLString },
    global_brand_root_id: { type: GraphQLString },
    hometown: { type: GraphQLString },
    instagram_business_account: { type: GraphQLString },
    is_community_page: { type: GraphQLBoolean },
    is_owned: { type: GraphQLBoolean },
    is_published: { type: GraphQLBoolean },
    is_webhooks_subscribed: { type: GraphQLBoolean },
    link: { type: GraphQLString },
    location: { type: GraphQLString },
    name: { type: GraphQLString },
    page_token: { type: GraphQLString },
    personal_info: { type: GraphQLString },
    personal_interests: { type: GraphQLString },
    phone: { type: GraphQLString },
    place_type: { type: GraphQLString },
    single_line_address: { type: GraphQLString },
    username: { type: GraphQLString },
    published_posts: { type: PostContentType },
    // data: { type: GraphQLList(GraphQLString) },
    // paging: {
    //   cursors: { type: GraphQLList(GraphQLString) },
    //   next: String,
    // },
    videos: { type: VideoContentType },
  }),
});

module.exports = FacebookPageContentType;
