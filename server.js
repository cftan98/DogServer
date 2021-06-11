require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const { twitterStrategy, router: twitRouter } = require('./AuthStrategies/twitterStrategy');
const User = require('./Models/User');

const formRouter = require('./Routes/formRouter');
const orgRouter = require('./Routes/organizationRouter');
const campRouter = require('./Routes/campaignRouter');
//const twitRouter = require('./Routes/twitRouter');

const app = express();

const url = process.env.MONGDO_CONNECTION_URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("mongo connected successfully..."))
    .catch(() => console.log("mongo connected wrongly..."))

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session(
        {
            secret: 'hmjtsrj5342qrfadntju543re', //Random string can be typed.
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 8 * 60 * 60 * 1000 // User session is valid for 8 hours.
            }
        }
    )
);

// Passport start
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, doc) => {
        cb(null, doc);
    })
});

passport.use(twitterStrategy);
app.get('/login/twitter', passport.authenticate('twitter'));
app.get('/oauth/callback', passport.authenticate('twitter', { failureRedirect: 'http://localhost:3000/bitcountry/learnandearn' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000/bitcountry/learnandearn/form');
    }
);
// Passport end

app.get('/', (req, res) => {
    res.redirect("http://localhost:3000/bitcountry/learnandearn");
});

app.get('/getuser', (req, res) => {
    res.send(req.user);
});

app.get('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.send("Success")
    }
});

app.use('/forms', formRouter);
app.use('/organizations', orgRouter);
app.use('/campaigns', campRouter);
app.use('/validate', twitRouter);

// Error handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send();
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`The server starts listening on port ${port}`);
});