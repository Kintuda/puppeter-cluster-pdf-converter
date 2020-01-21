import pino, { Logger, LoggerOptions } from 'pino'
import CONFIG from '../config/bootstrap'

const createLogger = (): Logger => {
    const defaultConfig: LoggerOptions = {
        prettyPrint: CONFIG.env === 'development'
    }

    return pino(defaultConfig)
}

export default createLogger()