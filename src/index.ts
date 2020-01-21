import { Consumer, ConsumerOptions } from 'sqs-consumer'
import SQS from 'aws-sdk/clients/sqs'
import http from 'http'
import CONFIG from './config/bootstrap'
import Logger from './utils/logger'

const agent = new http.Agent({ keepAlive: true })
const sqs = new SQS({ region: CONFIG.aws.region, apiVersion: '2012-11-05', httpOptions: { agent } })

const defaultOptions: ConsumerOptions = {
    batchSize: CONFIG.puppeteer.maxConcurrency,
    region: CONFIG.aws.region,
    sqs: sqs,
    queueUrl: CONFIG.aws.mainQueue,
    visibilityTimeout: 30,
    pollingWaitTimeMs: 100,
    handleMessage: 
}

const consumer: Consumer = Consumer.create(defaultOptions)

consumer.on('error', (error) => {
    Logger.error(`Error pooling messages: ${error && error.message}`, { stack: error.stack })
})

consumer.on('processing_error', (error, message) => {
    Logger.error(`Error while processing message: ${message}: ${error && error.message}`, { stack: error.stack })
})

consumer.on('timeout_error', (error) => {
    Logger.error(`Timeout error: ${error && error.message} - DEFAULT TIMEOUT: ${CONFIG.puppeteer.timeout}`, { stack: error.stack })
})

consumer.start()

