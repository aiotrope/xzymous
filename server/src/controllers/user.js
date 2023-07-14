import config from '../config'
require('express-async-errors')
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 } from 'cloudinary'
//import _ from 'lodash'
import mongoose from 'mongoose'
import { sanitize } from 'isomorphic-dompurify'

import User from '../models/user'
import Post from '../models/post'
import validators from '../utils/validators'

//import logger from '../utils/logger'

// return an array of users objects with id, email, username, isStaff and timestamps

const getAll = async (req, res) => {
  try {
    const users = await User.find({})
      .select({
        hashedPassword: 0,
      })
      .populate('posts')

    if (!users) throw Error('Problem fetching users')

    return res.status(200).json(users)
  } catch (err) {
    return res.status(422).json({ error: err.message })
  }
}

//create new user with request body of email, password and confirm

const signup = async (req, res) => {
  const foundUserEmail = await User.findOne({ email: req.body.email })

  const foundUserUsername = await User.findOne({ username: req.body.username })

  if (foundUserEmail) throw Error('Cannot use the email provided')

  if (foundUserUsername) throw Error('Cannot use the username provided')

  try {
    const validData = validators.signupSchema.validate(req.body)

    if (validData.error) {
      return res.status(400).json({ error: validData.error.details[0].message })
    } else {
      const saltRounds = 10

      const hashed = await bcrypt.hash(req.body.password, saltRounds)

      const user = new User({
        email: sanitize(validData.value.email),
        username: sanitize(validData.value.username),
        hashedPassword: hashed,
      })

      await user.save()

      return res.status(201).json({ message: `${user.email} created`, user })
    }
  } catch (err) {
    return res.status(422).json({ error: err.message })
  }
}

// login user with email and password

const signin = async (req, res) => {
  let { email, password } = req.body

  const validData = validators.signinSchema.validate(req.body)

  if (validData.error) {
    return res.status(400).json({ error: validData.error.details[0].message })
  }

  try {
    const user = await User.findOne({ email })

    const correctPassword =
      user === null
        ? false
        : await bcrypt.compare(password, user.hashedPassword)

    if (!(user && correctPassword)) throw Error('Incorrect login credentials')

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    }

    const token = jwt.sign(payload, config.jwt_secret, { expiresIn: '2h' })

    const decoded = jwt.verify(token, config.jwt_secret)

    res.status(200).json({
      message: `${decoded.email} signed-in`,
      access: token,
    })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

// get user using params id

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select({
        hashedPassword: 0,
      })
      .populate('posts')

    return res.status(200).json(user)
  } catch (err) {
    return res.status(422).json({ error: err.message })
  }
}

const getUserById = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
      .select({
        hashedPassword: 0,
      })
      .populate('posts')

    return res.status(200).json(user)
  } catch (err) {
    return res.status(422).json({ error: err.message })
  }
}

const updateUserAvatar = async (req, res) => {
  const { image } = req.body //base64 format

  const { id } = req.params

  v2.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_key,
    api_secret: config.cloudinary_secret,
  })

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
  }

  if (req.user.id !== id)
    return res
      .status(403)
      .json({ error: `Not allowed to update ${req.user.username}` })

  try {
    const uploader = await v2.uploader.upload(image, opts)

    if (uploader.secure_url) {
      let user = await User.findById(id)
      if (user) {
        user.avatar = sanitize(uploader.secure_url)
        await user.save()
        return res.status(200).json({
          message: `${user.username} avatar updated`,
          user: user,
        })
      }
    }
  } catch (err) {
    return res.status(422).json({ error: err.message })
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params

  const validData = validators.updateUserSchema.validate(req.body)

  if (validData.error)
    return res.status(400).json({ error: validData.error.details[0].message })

  if (req.user.id !== id)
    return res
      .status(403)
      .json({ error: `Not allowed to update ${req.user.username}` })

  try {
    let user = await User.findById(req.user.id).select({
      hashedPassword: 0,
    })

    if (user) {
      user.username = sanitize(validData.value.username)
      user.email = sanitize(validData.value.email)
      user.bio = sanitize(validData.value.bio)

      await user.save()
      return res.status(200).json({
        message: `${user.username} profile updated`,
        user: user,
      })
    }
  } catch (err) {
    //console.log(req.user.id)
    return res.status(400).json({ error: err.message })
  }
}

const deleteAccount = async (req, res) => {
  const { id } = req.params

  const user = req.user

  if (user.id !== id)
    return res
      .status(403)
      .json({ error: `Not allowed to update ${req.user.username}` })

  try {
    const userToDelete = await User.findByIdAndDelete(id)

    await Post.deleteMany({ user: mongoose.Types.ObjectId(user.id) })

    if (!userToDelete) return res.status(404).json({ error: 'User not found' })

    res.status(204).end()
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}
const userController = {
  getAll,
  signup,
  signin,
  getMe,
  getUserById,
  updateUserAvatar,
  updateUser,
  deleteAccount,
}

export default userController
