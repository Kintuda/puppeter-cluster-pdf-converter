import axios, { AxiosRequestConfig } from 'axios'


const triggerWebhook = async (url: string, hash: string) => {
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: url,
        params: {
            processed: true,
            hash: hash
        }
    }
    return axios(config)
}

export default triggerWebhook