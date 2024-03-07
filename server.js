const fs = require('fs');
const path = require('path');
const https = require("https")
const express = require("express")
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');


require('dotenv').config();

PORT = 3000;

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET:  process.env.CLIENT_SECRET,
    COOKIE_KEY_1:  process.env.COOKIE_KEY_1,
    COOKIE_KEY_2:  process.env.COOKIE_KEY_2
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken, profile, done){
    console.log('Google profile: ', profile)
    done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));


passport.serializeUser((user, done) => {
    done(null, user.id);
})


passport.deserializeUser((id, done) => {
    done(null, id)
})

const app = express();

app.use(helmet());

app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
}));

app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next){
    console.log('Current user is: ', req.user);
    const isLoggedIn = req.isAuthenticated() && req.user;
    if (!isLoggedIn) {
        return res.status(401).json({
          error: 'You are not authorized to see this page. Sign in with Google to access it!',
        });
      }
    next();
}

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email'],
}));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true,
  }),
  (req, res) => {
    console.log('Google called us back!');
  }
);


app.get('/auth/logout', (req, res, next) => {
    req.logout()
    return res.redirect('/')
})

app.get("/protected", checkLoggedIn, (req, res) => {
    return res.send("Hi! Your are visiting a protected resource. You can see it as long as you are logged in");
})

app.get("/failure", (req, res) => {
    return res.send("Failure to log in");
})

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app).listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}...`);
})
