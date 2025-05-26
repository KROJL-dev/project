import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
})
