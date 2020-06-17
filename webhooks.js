
const axios = require('axios');
const { error } = require('jquery');
// const mongoose = require('mongoose');
// const User = require('./models/User');

const FacebookpageId = '268538378791'; // User.facebookpages.id;
const pageAccessToken = 'EAAJvB75X9XsBAOQy7WJUsfZCpiMVbzfE7ZBdg6byBSuWMl3lsxO8a1fbYXQyle1Tq7tH70OLUZAQIG7dZA4r5zr5TDzlvzg7uRTxfQkXhVdxJ74YPMDecqzJx60hvjTdBp7AxtcEZBGJuMnZCI6CVfu6rV4faZAZCj3ZAbFWtWZAiKBQZDZD'; // User.facebookpages.accesstoken;

const Facebookwebhook = axios.post(`https://graph.facebook.com/${FacebookpageId}/subscribed_apps
?subscribed_fields=feed
&access_token=${pageAccessToken}`)
  .catch(error);

module.exports = Facebookwebhook;
