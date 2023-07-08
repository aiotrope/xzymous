const config = require('../config')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy

const cache = require('../utils/redis')
const User = require('../models/user')

const options = {
  clientID: config.google_client_id,
  clientSecret: config.google_client_secret,
  callbackURL: config.google_callback_url,
  passReqToCallback: true,
}

const googleLogin = (passport) => {
  passport.use(
    new GoogleStrategy(
      options,
      async (req, accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ googleId: profile.id })
        const sess = req.session

        if (!user) {
          const newUser = await User.create({
            email: profile.email,
            username: profile.displayName,
            googleId: profile.id,
            // photo: profile.picture
            // req.isAuthenticated()
          })

          if (newUser) {
            await cache.setAsync('currentUser', JSON.stringify(newUser))
            sess.user = JSON.stringify(newUser)

            return done(null, newUser)
          }
        }
        if (user) {
          await cache.setAsync('currentUser', JSON.stringify(user))
          sess.user = JSON.stringify(user)

          return done(null, user)
        }
      }
    )
  )
}

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

module.exports = googleLogin