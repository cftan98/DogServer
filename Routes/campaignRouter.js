const router = require('express').Router();
const Campaign = require('../Models/Campaigns');
// const passport = require('passport');

router.get('/getCampaigns', (req, res) => {
    if (req.isAuthenticated()) {
        Campaign.find()
            .then(result => res.json({ is_success: true, result: result }))
            .catch(err => res.status(400).json({ is_success: false, message: err }));
    } else {
        res.status(401).send();
    }
});

// router.post('/addCampaign', async (req, res) => {
//     if (req.isAuthenticated()) {
//         try {
//             const camp = req.body;
//             const newCamp = new Campaign({
//                 campaignName: camp.campaignName,
//                 organizationName: camp.organizationName,
//                 isDeleted: false
//                 //expireAt: new Date(new Date().getTime() + (10 * 24 * 60 * 60 * 1000)) // 10 days after
//             });
//             await newCamp.save();
//             res.status(201).json(newCamp);
//         } catch (error) {
//             res.status(400).json(error);
//         }
//     } else {
//         res.status(403).send();
//     }
// });

module.exports = router;