const { TwitterClient } = require('twitter-api-client');
const config = require('./config');

// Initialize a new Twitter client
const twitterClient = new TwitterClient({
  apiKey: config.apiKey,
  apiSecret: config.apiSecret,
  accessToken: config.accessToken,
  accessTokenSecret: config.accessTokenSecret
});

// Specify the hashtag to track
const HASHTAG = '#Botters';

// Function to like and retweet
async function likeAndRetweet(tweetId) {
  try {
    // Like the tweet
    await twitterClient.tweets.statusesUpdate({ id: tweetId, is_quote_status: true });
    console.log(`Liked tweet ${tweetId}`);
    
    // Retweet the tweet
    await twitterClient.tweets.statusesRetweetById({ id: tweetId });
    console.log(`Retweeted tweet ${tweetId}`);
    
  } catch (error) {
    console.error(`Could not like/retweet tweet ${tweetId}:`, error);
  }
}

// Function to fetch recent tweets with the specified hashtag
async function fetchTweets() {
  try {
    const data = await twitterClient.tweets.search({ q: HASHTAG, count: 10 });
    
    for (let tweet of data.statuses) {
      likeAndRetweet(tweet.id_str);
    }
    
  } catch (error) {
    console.error('Could not fetch tweets:', error);
  }
}

// Run the Twitter bot
fetchTweets();
setInterval(fetchTweets, 15 * 60 * 1000);  // Run every 15 minutes
