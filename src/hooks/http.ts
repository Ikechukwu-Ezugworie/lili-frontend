import axios from 'axios'
import { useAuth } from './auth'

let interceptorId: number
let isIntercepted = false
const client = axios.create({
  baseURL: '/api'
})

const unIntercept = () => {
  if (isIntercepted && interceptorId) {
    client.interceptors.request.eject(interceptorId)
    isIntercepted = false
  }
}

export const useHttp = () => {
  const { user } = useAuth()
  if (!isIntercepted && user.value?.api_token) {
    interceptorId = client.interceptors.request.use(request => {
      if (!user.value) {
        unIntercept()
        return request
      }
      const { headers } = request
      headers.Authorization = `Bearer ${user.value.api_token}`
      return request
    })
    isIntercepted = true
  }

  return { client }
}
