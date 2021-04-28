const router = require('express').Router();
const mongoose = require('mongoose');
const Organization = require('../Models/Organization');

router.get('/getOrganizations', (req, res) => {
    if (req.isAuthenticated()) {
        Organization.find()
            .then(result => res.json({ is_success: true, result: result }))
            .catch(err => res.status(400).json({ is_success: false, message: err }));
    } else {
        res.status(403).send();
    }
});

// router.post('/addOrganization', async (req, res) => {
//     if (req.isAuthenticated()) {
//         try {
//             const org = req.body;
//             const neworg = new Organization({
//                 orgName: org.orgName,
//                 isDeleted: false
//             });
//             await neworg.save();
//             res.status(201).json(neworg);
//         } catch (error) {
//             res.status(400).json(error);
//         }
//     } else {
//         res.status(403).send();
//     }
// });

// router.post('/deleteOrg', async (req, res) => {
//     try {

//     } catch (err) {

//     };
// });

module.exports = router;