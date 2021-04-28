const router = require('express').Router();
const Form = require('../Models/Forms');
const User = require('../Models/User');

router.get('/getForms', async (req, res) => {
    if (req.isAuthenticated()) {
        await Form.find()
            .then(result => res.json({ is_success: true, result: result }))
            .catch(err => res.status(400).json({ is_success: false, message: err }));
    } else {
        res.status(403).send();
    }
});

router.post('/addForm', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            if (!req.body) {
                throw "Form is empty."
            }

            const form = req.body;
            const newform = new Form({
                twitterId: form.twitterId,
                twitterDisplayName: form.twitterDisplayName,
                metaData: form.metaData,
                score: 10 // 10 score for each form instance
            });
            await newform.save();

            // Update user total scores
            const filter = {
                twitterId: form.twitterId
            };
            const update = {
                $inc: { scores: 10 }
            }
            User.findOneAndUpdate(filter, update, { new: true }, (err, res) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
            });

            res.status(201).json({ is_success: true, result: newform });
        } catch (error) {
            res.status(400).json({ is_success: false, message: error });
        }
    } else {
        res.status(403).send();
    }
});

router.get('/getScoresByTwitterId', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            if (Object.keys(req.body).length === 0) { // Empty reqest body
                throw "A single twitterId is required!"
            }

            const twitterId = req.body.twitterId;
            let totalScores = 0;

            await Form.find({ twitterId: twitterId })
                .then(docs => {
                    docs.forEach(doc => totalScores += doc.score)
                });
            res.json({ is_success: true, result: totalScores });
        } else {
            res.status(403).send();
        }
    } catch (err) {
        res.status(400).json({ is_success: false, message: err });
    }
})

module.exports = router;