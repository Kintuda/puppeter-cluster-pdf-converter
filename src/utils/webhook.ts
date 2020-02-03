import axios, { AxiosRequestConfig } from 'axios'


export const triggerWebhook = async (url: string, hash: string) => {
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: url,
        params: {
            processed: true,
            hash: hash
        }
    }
    console.log(config);
    return axios(config)
}