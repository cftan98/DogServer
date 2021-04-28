require('dotenv').config();
const Twit = require('twit');
const express = require('express');
const router = express.Router();

var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

router.get('/isfollowing/:name', (req, res) => {
    if (req.isAuthenticated()) {
        T.get("friendships/show", { source_screen_name: req.params.name, target_screen_name: "BitDotCountry" },
            (err, data, response) => {
                try {
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
                } catch (error) { // Connection false for input not correct
                    res.end(JSON.stringify({ "Is_success": false }));
                }
            });
    } else {
        res.status(403).send();
    }
});

router.get('/isLikedAndRetweeted/:name', (req, res) => {
    if (req.isAuthenticated()) {
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
            res.end(JSON.stringify({ "Is_success": false }));
        }
    } else {
        res.status(403).send();
    }
});

// router.get('/isReplied/:name', (req, res) => {
//     try {
//         // The post id is between since_id and max_id
//         T.get("search/tweets", { q: `from:${req.params.name} #DOTLearnAndEarn` },
//             (err, data, response) => {
//                 const infos = data.statuses;
//                 if (infos.length >= 1) {
//                     let i = 0;
//                     while (i < infos.length) {
//                         if (infos[i].in_reply_to_status_id_str === "1380385038320115715" && infos[i].in_reply_to_screen_name === "BitDotCountry") {
//                             // Found the hastag as a reply to our post by BitDotCountry
//                             res.end(JSON.stringify({ "Is_success": true, "Is_replied": true }));
//                             break;
//                         }
//                         i++;
//                     }
//                     if (i >= infos.length) { // Have gone through all the list, return the result.
//                         res.end(JSON.stringify({ "Is_success": true, "Is_replied": false }));
//                     }
//                 } else {
//                     res.end(JSON.stringify({ "Is_success": true, "Is_replied": false }));
//                 }
//             });
//     } catch (error) {// Connection false for input not correct
//         res.end(JSON.stringify({ "Is_success": false }));
//     }
// });

module.exports = router;
