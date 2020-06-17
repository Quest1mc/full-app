// const crypto = require('crypto');
const pubSubHubbub = require('pubsubhub');
const User = require('./models/User');

const pubsub = pubSubHubbub.createServer({
  callbackUrl: 'http://1d55315506e3.ngrok.io:1337',
  secret: 'MyTopSecret'
});
const { channelID } = User;
const topic = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelID}`;
const hub = 'http://pubsubhubbub.appspot.com/';

pubsub.listen(1337);

pubsub.on('denied', (data) => {
  console.log('Denied');
  console.log(data);
});

pubsub.on('subscribe', (data) => {
  console.log('Subscribe');
  console.log(data);

  console.log(`Subscribed ${topic} to ${hub}`);
});

pubsub.on('unsubscribe', (data) => {
  console.log('Unsubscribe');
  console.log(data);

  console.log(`Unsubscribed ${topic} from ${hub}`);
});

pubsub.on('error', (error) => {
  console.log('Error');
  console.log(error);
});

pubsub.on('feed', (data) => {
  console.log(data);
  console.log(data.feed.toString());

  pubsub.unsubscribe(topic, hub);
});

pubsub.on('listen', () => {
  console.log('Server listening on port %s', pubsub.port);
  pubsub.subscribe(topic, hub);
});
