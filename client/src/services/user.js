import axios from 'axios'

import { authService } from './auth'
import jwtDecode from 'jwt-decode'

const baseUrl = import.meta.env.VITE_BASE_URL

// helper functions for user api calls

const getUsers = async () => {
  const response = await axios.get(`${baseUrl}/api/user/all`, {
    withCredentials: true,
  })
  if (response.status === 200 && response.data) return response.data
}

const getMe = async () => {
  const accessToken = authService.getAccessToken()

  const decoded = jwtDecode(accessToken)

  const response = await axios.get(`${baseUrl}/api/user/me/${decoded.id}`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })
  if (response.status === 200 && response.data) return response.data
}

const getUserById = async (id) => {
  const response = await axios.get(`${baseUrl}/api/user/${id}`, {
    withCredentials: true,
  })
  if (response.status === 200 && response.data) return response.data
}

const updateUser = async (data) => {
  const accessToken = authService.getAccessToken()

  const user = jwtDecode(accessToken)

  const response = await axios.patch(`${baseUrl}/api/user/update/${user.id}`, data, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })

  if (response.status === 200 && response.data) return response.data
}

const updateUserAvatar = async (data) => {
  const accessToken = authService.getAccessToken()

  const user = jwtDecode(accessToken)

  const response = await axios.patch(`${baseUrl}/api/user/update/avatar/${user.id}`, data, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })

  if (response.status === 200 && response.data) return response.data
}

const deleteUserAccount = async () => {
  const accessToken = authService.getAccessToken()

  const user = jwtDecode(accessToken)

  const response = await axios.delete(`${baseUrl}/api/user/${user.id}`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })

  if (response.status === 204) return response
}

export const userService = {
  getUsers,
  getMe,
  updateUser,
  updateUserAvatar,
  deleteUserAccount,
  getUserById,
}
