import CONFIG, { ensureEnvs } from './config/bootstrap'
import { receiveMessages } from './utils/sqs'
import Logger from './utils/logger'
import processMessage from './process'

const poolMessages = async (): Promise<Function> => {
    const message = await receiveMessages(CONFIG.aws.mainQueue)
    try {
        if (message && message.Messages && message.Messages.length > 0) {
            await processMessage(message.Messages[0].Body!)
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