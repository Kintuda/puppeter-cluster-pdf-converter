import cluster from './utils/spawn'
import { Cluster } from 'puppeteer-cluster'
import { parseJson } from './utils/json'

const processMessage = async (message: string, cluster: Cluster) => {
    const data = parseJson(message)
    if (!data) return null
    await cluster.queue(data)
}

export default processMessage