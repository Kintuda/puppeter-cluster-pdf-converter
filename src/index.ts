import CONFIG, { ensureEnvs } from './config/bootstrap'
import { receiveMessages,deleteMessage } from './utils/sqs'
import Logger from './utils/logger'
import processMessage from './process'

const poolMessages = async (): Promise<Function> => {
    const message = await receiveMessages(CONFIG.aws.mainQueue)
    try {
        if (message && message.Messages && message.Messages.length > 0) {
            const { Body, ReceiptHandle } = message.Messages[0]
            Logger.info(`Processing message: ${Body}`)
            await processMessage(Body!)
            await deleteMessage(CONFIG.aws.mainQueue, ReceiptHandle!)

        }
        return poolMessages()
    } catch (error) {
        Logger.error(`Error processing messages, ${error && error.message}`)
        return poolMessages()
    }
}

const startProcedure = async () => {
    try {
        Logger.info(`Worker started reciving messages, ENV=${CONFIG.env}`)
        ensureEnvs()
        await poolMessages()
    } catch (error) {
        Logger.error(`Error pooling messages ${error && error.message}`, { stack: error.stack })
        throw error
    }
}

startProcedure().catch(error => process.exit(1))