import {ref} from 'vue'
import axios, {AxiosResponse} from 'axios'

const user = ref<User | null>()
const INFO_KEY = 'auth:info'

type User = {
    name: string,
    email: string,
    api_token: string,
    phone_number: string,
}

type RegisterParams = {
    name: string,
    email: string,
    phone: string,
    password: string,
    password_confirmation: string,
}

const getToken = () => {
    if (user.value) return user.value.api_token
    return getStoredInfo()?.api_token
}

const getStoredInfo = () => {
    let info: string | null = localStorage.getItem(INFO_KEY)
    if (!info) return null
    return JSON.parse(info) as User
}

const getHeaders = (params: Record<string, string> = {}) => {
    const token = getToken()
    return !token ? params : {...params, Authorization: `Bearer ${token}`}
}

export const useAuth = () => {
    const loading = ref(false)

    const fetch = async () => {
        loading.value = true
        try {
            const info = getStoredInfo()
            if (!info) return
            user.value = info
            const {data} = await axios.get('/api/me', {headers: getHeaders(),})
            user.value = data
        } catch (e) {
            console.error(e)
        }
        loading.value = false
    }

    const login = async (params: { email: string, password: string, }) => {
        loading.value = true
        let resp
        try {
            const {data} = await axios.post('/api/login', params)
            user.value = data
            localStorage.setItem(INFO_KEY, JSON.stringify(data))
            resp = data
        } catch (e) {
            const {data} = e.response as AxiosResponse<{ message: string, errors: Record<string, string[]> }>
            resp = data
        }
        loading.value = false
        return resp
    }

    const register = async (params: RegisterParams) => {
        loading.value = true
        let resp
        try {
            const {data} = await axios.post('/api/register', params)
            user.value = data
            localStorage.setItem(INFO_KEY, JSON.stringify(data))
            resp = data
        } catch (e) {
            const {data} = e.response as AxiosResponse<{ message: string, errors: Record<string, string[]> }>
            resp = data
        }
        loading.value = false
        return resp
    }

    const logout = async () => {
        loading.value = true
        let resp
        try {
            await axios.post('/api/logout', null, {headers: getHeaders(),})
            localStorage.removeItem(INFO_KEY)
            user.value = null
        } catch (e) {
            const {data} = e.response as AxiosResponse<{ message: string, errors: Record<string, string[]> }>
            resp = data
        }
        loading.value = false
        return resp
    }

    return {loading, user, fetch, login, logout, register}
}


type ResetParams = {
    email: string,
    token: string,
    password: string,
    password_confirmation: string,
}

export const useReset = () => {
    const loading = ref(false)

    const forgotPassword = async (email: string) => {
        loading.value = true
        let resp
        try {
            resp = await axios.post<{ message: string }>('/api/password/email', {email})
        } catch (e) {
            resp = e.response as AxiosResponse<{ message: string, errors: Record<string, string[]> }>
        }
        loading.value = false
        return resp
    }

    const resetPassword = async (params: ResetParams) => {
        loading.value = true
        let resp
        try {
            const {data} = await axios.post('/api/password/reset', params)
            resp = data
        } catch (e) {
            const {data} = e.response as AxiosResponse<{ message: string, errors: Record<string, string[]> }>
            resp = data
        }
        loading.value = false
        return resp
    }

    return {loading, forgotPassword, resetPassword,}
}
