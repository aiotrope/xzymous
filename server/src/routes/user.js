import express from 'express'

import userController from '../controllers/user'
import authMiddleware from '../middlewares/auth'

const router = express.Router()

router.post('/signup', userController.signup)

router.post('/signin', userController.signin)

router.get('/all', userController.getAll)

router.get(
  '/me/:id',
  authMiddleware.tokenExtractor,
  authMiddleware.userExtractor,
  userController.getMe
)

router.get('/:id', userController.getUserById)

router.patch(
  '/update/:id',
  authMiddleware.tokenExtractor,
  authMiddleware.userExtractor,
  userController.updateUser
)

router.patch(
  '/update/avatar/:id',
  authMiddleware.tokenExtractor,
  authMiddleware.userExtractor,
  userController.updateUserAvatar
)

router.delete(
  '/:id',
  authMiddleware.tokenExtractor,
  authMiddleware.userExtractor,
  userController.deleteAccount
)

export default router
