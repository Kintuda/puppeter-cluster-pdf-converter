import { Cluster } from 'puppeteer-cluster'
import CONFIG from '../config/bootstrap'

export default class PuppeteerCluster {
    private config: {};
    private cluster: Cluster<any, any> = null;

    constructor(config?: Record<string, string>){
        this.config = {
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: CONFIG.puppeteer.maxConcurrency,
            puppeteerOptions: CONFIG.puppeteer.args,
            monitor: CONFIG.env === 'development',
            ...config
        }
    }

    public static initCluster = async() => {
        this.cluster =  await Cluster.launch(this.config)
        await this.cluster.task(async ({ page, data: url }) => {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: CONFIG.puppeteer.timeout })
            return page.pdf(CONFIG.pageOptions)
        })
    }
}

// const spawnCluster = async (config?: Record<string, string>) => {
//     // const defaultConfig = {
//     //     concurrency: Cluster.CONCURRENCY_CONTEXT,
//     //     maxConcurrency: CONFIG.puppeteer.maxConcurrency,
//     //     puppeteerOptions: CONFIG.puppeteer.args,
//     //     monitor: CONFIG.env === 'development',
//     //     ...config
//     // }
//     const cluster = await Cluster.launch(defaultConfig)
//     await cluster.task(async ({ page, data: url }) => {
//         await page.goto(url, { waitUntil: 'networkidle2', timeout: CONFIG.puppeteer.timeout })
//         return page.pdf(CONFIG.pageOptions)
//     })

//     return cluster
// }

// export default spawnCluster()