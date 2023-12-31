import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL

// helper functions use for authenticating user

const createUser = async (data) => {
  const response = await axios.post(`${baseUrl}/api/user/signup`, data, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  })
  if (response.status === 201 && response.data) {
    return response.data
  }
}

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/api/user/signin`, credentials, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 200 && response.data) {
    return response.data
  }
}

const getAccessToken = () => {
  const token = JSON.parse(localStorage.getItem('JWT'))
  return token.jwt_atom
}

export const authService = {
  createUser,
  login,
  getAccessToken,
}
