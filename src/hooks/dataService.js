import axios from 'axios'
import { useLocalStorage } from './localStorageControl'
import { API_URL } from '../config'

const { getItem, setItem } = useLocalStorage()

const authHeader = () => ({
  Authorization: `Bearer ${getItem('access_token')}`
})

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${getItem('access_token')}`,
    'Content-Type': 'application/json'
  }
})

class DataService {
  static get(path = '', data = [], params = {}) {
    return client({
      method: 'GET',
      url: path,
      params: data,
      headers: { ...authHeader() }
    })
  }

  static post(path = '', data = {}, params = {}, optionalHeader = {}) {
    return client({
      method: 'POST',
      url: path,
      data,
      params,
      headers: { ...authHeader(), ...optionalHeader }
    })
  }

  static patch(path = '', data = {}) {
    return client({
      method: 'PATCH',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() }
    })
  }

  static delete(path = '', data = {}) {
    return client({
      method: 'DELETE',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() }
    })
  }

  static put(path = '', data = {}, params = {}) {
    return client({
      method: 'PUT',
      url: path,
      params,
      data: JSON.stringify(data),
      headers: { ...authHeader() }
    })
  }

  static any(path = '', data = {}, httpMethod = '', params = {}) {
    return client({
      method: httpMethod,
      url: path,
      params,
      data: JSON.stringify(data),
      headers: { ...authHeader() }
    })
  }
}

/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use(config => {
  // do something before executing the request
  // For example tag along the bearer access token to request header or set a cookie
  const requestConfig = config
  const { headers } = config
  requestConfig.headers = { ...headers, Authorization: `Bearer ${getItem('access_token')}` }

  return requestConfig
})

client.interceptors.response.use(
  response => response,
  error => {
    /**
     * Do something in case the response returns an error code [3**, 4**, 5**] etc
     * For example, on token expiration retrieve a new access token, retry a failed request etc
     */
    const { response } = error
    const originalRequest = error.config
    if (response) {
      if (response.status === 500) {
        // do something here
        return 'Network Error'
      } else {
        return originalRequest
      }
    }
    return Promise.reject(error)
  }
)
export { DataService }
