const TwitterStrategy = require('passport-twitter').Strategy;
const Twit = require('twit');
const User = require('../Models/User');
const express = require('express');
const router = express.Router();

const twitterStrategy = new TwitterStrategy(
    {
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        callbackURL: "http://localhost:3001/oauth/callback"
    },
    (token, tokenSecret, profile, cb) => {
        var T = new Twit({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token: token,
            access_token_secret: tokenSecret,
        });

        router.get('/isfollowing/:name', (req, res) => {
            if (!req.isAuthenticated()) { throw new Error("Please login!") }

            try {
                T.get("friendships/show", { source_screen_name: req.params.name, target_screen_name: "BitDotCountry" },
                    (err, data, response) => {
                        if (data.relationship.source.following && data.relationship.target.followed_by) {
                            T.get("friendships/show", { source_screen_name: req.params.name, target_screen_name: "RayLuCode" },
                                (err, data, response) => {
                                    if (data.relationship.source.following && data.relationship.target.followed_by) {
                                        res.end(JSON.stringify({ "Is_success": true, "Is_following": true }));
                                    } else {
                                        res.end(JSON.stringify({ "Is_success": true, "Is_following": false }));
                                    }
                                });
                        } else {
                            res.end(JSON.stringify({ "Is_success": true, "Is_following": false }));
                        }
                    });
            } catch (err) {
                res.end(JSON.stringify({ "Is_success": false, "Message": err }));
            }
        });

        router.get('/isLikedAndRetweeted/:name', (req, res) => {
            if (!req.isAuthenticated()) { throw new Error("Please login!") }

            try {
                // The post id is between since_id and max_id
                T.get("favorites/list", { source_screen_name: req.params.name, since_id: "1380385038320115714", max_id: "1380385038320115716" },
                    (err, data, response) => {
                        if (data.length === 1 && data[0].retweeted) {
                            res.end(JSON.stringify({ "Is_success": true, "Is_retweeted_and_liked": true }));
                        } else {
                            res.end(JSON.stringify({ "Is_success": true, "Is_retweeted_and_liked": false }));
                        }
                    });
            } catch (error) { // Connection false for input not correct
                res.end(JSON.stringify({ "Is_success": false, "Message": error }));
            }
        });

        router.post('/follow/:id', (req, res) => {
            if (!req.isAuthenticated()) { throw new Error("Please login!") }

            try {
                T.post('friendships/create', { screen_name: 'BitDotCountry' }, (request, response) => {
                    res.end(JSON.stringify({ "Is_success": true, "Data": response }))
                })
            } catch (err) {
                res.end(JSON.stringify({ "Is_success": false, "Message": err }))
            }
        })

        router.post('/likeAndRetweet', (req, res) => {
            if (!req.isAuthenticated()) { throw new Error("Please login!") }

            try {
                T.post('favorites/create', { id: "1380385038320115715" }, (request, response) => {
                    T.post('statuses/retweet/:id', { id: "1380385038320115715" }, (request2, response2) => {
                        res.end(JSON.stringify({ "Is_success": true }))
                    })
                });
            } catch (err) {
                res.end(JSON.stringify({ "Is_success": false, "Message": err }))
            }
        })

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

module.exports = { twitterStrategy, router };