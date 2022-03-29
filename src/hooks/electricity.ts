import {AxiosInstance, AxiosError} from 'axios'
import {ref, reactive, toRefs} from 'vue'

import {useHttp} from './http'

type Customer = {
    name: string,
    util?: string,
    address: string,
}

export type VendParams = {
    email: string,
    disco: string,
    meter: string,
    amount: number,
    accessToken: string,
    paymentRef: string,
    phoneNumber: string,
    customer?: Customer,
}

const discos = (client: AxiosInstance) =>
    client.get('/electricity/discos')
        .then(({data}) => data.bundles || data)

export const states = (client: AxiosInstance) => client.get('/electricity/states')
    .then(({data}) => data)

export const getMeterInfo = (client: AxiosInstance, disco: string, meter: string) =>
    client.post('/electricity/meter-info', {disco, meter})
        .then(({data}) => data)

export const vend = (client: AxiosInstance, {
    email,
    disco,
    meter,
    amount,
    accessToken,
    paymentRef,
    phoneNumber,
    customer
}: VendParams) =>
    client.post('/electricity/vend', {email, disco, meter, amount, accessToken, paymentRef, phoneNumber, customer})
        .then(({data}) => data)


export const useDiscos = (onError?: (e: Error) => void) => {
    const {client} = useHttp()
    const obs = reactive({
        discos: {},
        states: [],
        error: null,
    })

    Promise.all([discos(client), states(client)])
        .then(([discosInfos, states]) => {
            obs.states = states
            discosInfos.forEach(disco => {
                const {code} = disco
                !obs.discos[code] && (obs.discos[code] = disco)
            })
        })
        .catch(onError)

    return toRefs(obs)
}

export const useMeterInfo = () => {
    const obs = reactive({
        loading: false,
        meterInfo: null,
    })
    const fetchInfo = async (disco: string, meterNumber: string) => {
        obs.loading = true
        const {client} = useHttp()
        const data = await getMeterInfo(client, disco, meterNumber)
        obs.meterInfo = data
        obs.loading = false
    }

    return {fetchInfo, ...toRefs(obs)}
}

export const usePurchase = (onError?: (e: AxiosError) => void) => {
    const obs = reactive({
        data: null,
        loading: false,
    })
    const purchase = async (params: VendParams) => {
        obs.loading = true
        try {
            const {client} = useHttp()
            const data = await vend(client, params)
            obs.data = {...data, paymentRef: params.paymentRef}
        } catch (e) {
            onError?.(e)
        }
        obs.loading = false
    }

    return {purchase, ...toRefs(obs)}
}
