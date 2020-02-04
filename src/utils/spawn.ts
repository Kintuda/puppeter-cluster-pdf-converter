import { Cluster } from 'puppeteer-cluster'
import CONFIG from '../config/bootstrap'
import { uploadContent } from './s3'
import { triggerWebhook } from './webhook'
import logger from './logger'

const spawnCluster = async (config?: Record<string, string>) => {
    const defaultConfig = {
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: CONFIG.puppeteer.maxConcurrency,
        puppeteerOptions: {
            args: CONFIG.puppeteer.args
        },
        monitor: CONFIG.env === 'development',
        ...config
    }
    const cluster = await Cluster.launch(defaultConfig)
    await cluster.task(async ({ page, data }) => {
        try {
            const { url, callbackUrl } = data
            await page.goto(url, { waitUntil: 'networkidle2', timeout: CONFIG.puppeteer.timeout })
            const result = await page.pdf(CONFIG.pageOptions)
            const key = await uploadContent(result)
            if (callbackUrl) {
                await triggerWebhook(callbackUrl, key)
            }
            return key
        } catch (error) {
            logger.error(`Error converting ${data} - ${error && error.message}`)
        }
    })

    cluster.on('taskerror', (err: Error, data: {}) => {
        logger.error(`Task error, ${data} - ${err.message}`);
    });

    return cluster
}

export default spawnCluster