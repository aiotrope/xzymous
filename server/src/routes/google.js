import express from 'express'
import passport from 'passport'

import googleController from '../controllers/google'
import { checkAuthSession } from '../middlewares/auth'
//import cache from '../utils/redis'
import logger from '../utils/logger'

const router = express.Router()

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/dashboard',
    failureRedirect: 'http://localhost:5173/login',
    session: true,
  }),
  async (req, res) => {
    const sess = req.sess
    logger.warn('USER from CB SESS ', JSON.parse(sess.user))
    res.cookie('googleUser', JSON.parse(sess.user))
  }
)

router.get('/user', checkAuthSession, googleController.getGoogleUser)

export default router
