import CONFIG, { ensureEnvs } from './config/bootstrap'
import { receiveMessages,deleteMessage } from './utils/sqs'
import Logger from './utils/logger'
import processMessage from './process'
import spawnCluster from './utils/spawn'
import { Cluster } from 'puppeteer-cluster'

const poolMessages = async (cluster: Cluster): Promise<Function> => {
    const message = await receiveMessages(CONFIG.aws.mainQueue)
    try {
        if (message && message.Messages && message.Messages.length > 0) {
            const { Body, ReceiptHandle } = message.Messages[0]
            Logger.info(`Processing message: ${Body}`)
            await processMessage(Body!, cluster)
            await deleteMessage(CONFIG.aws.mainQueue, ReceiptHandle!)

        }
        return poolMessages(cluster)
    } catch (error) {
        Logger.error(`Error processing messages, ${error && error.message}`)
        return poolMessages(cluster)
    }
}

const startProcedure = async () => {
    try {
        const cluster = await spawnCluster()
        Logger.info(`Worker started reciving messages, ENV=${CONFIG.env}`)
        ensureEnvs()
        await poolMessages(cluster)
    } catch (error) {
        Logger.error(`Error pooling messages ${error && error.message}`, { stack: error.stack })
        throw error
    }
}

startProcedure().catch(error => process.exit(1))