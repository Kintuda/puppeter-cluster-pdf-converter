import CONFIG, { ensureEnvs } from './config/bootstrap'
import { hasMessages, receiveMessages } from './utils/sqs'
import Logger from './utils/logger'
import processMessage from './process'

const poolMessages = async () => {
    const message = await receiveMessages(CONFIG.aws.mainQueue)
    console.log(message);
    try {
        if (hasMessages(message)) {
            await processMessage(message)
        }
        return poolMessages()
    } catch (error) {
        Logger.error(`Error processing messages, ${error && error.message}`)
        return poolMessages()
    }
}

const startProcedure = async () => {
    try {
        ensureEnvs()
        await poolMessages()
    } catch (error) {
        Logger.error(`Error pooling messages ${error && error.message}`, { stack: error.stack })
        throw error
    }
}

startProcedure().catch(error => process.exit(1))