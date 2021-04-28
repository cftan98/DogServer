const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../Models/User');

const twitterStrategy = new TwitterStrategy(
    {
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        callbackURL: "http://localhost:3001/oauth/callback"
    },
    (token, tokenSecret, profile, cb) => {
        User.findOne({ twitterId: profile.id }, async (err, doc) => {
            if (err) {
                return cb(err, null);
            }

            if (!doc) { //No doc found in db
                const newUser = new User({
                    userName: profile.username,
                    twitterId: profile.id,
                    displayName: profile.displayName,
                    scores: 0
                });
                await newUser.save();
                return cb(null, newUser);
            }
            
            return cb(null, doc);
        })
    }
)

module.exports = twitterStrategy;