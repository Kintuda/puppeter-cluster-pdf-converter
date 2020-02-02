import CONFIG from '../config/bootstrap'
import SQS, { ReceiveMessageResult, ReceiveMessageRequest, SendMessageRequest } from 'aws-sdk/clients/sqs'
import http from 'http'

const agent = new http.Agent({ keepAlive: true })
const sqs = new SQS({ region: CONFIG.aws.region, apiVersion: '2012-11-05', httpOptions: { agent } })

export const hasMessages = (payload?: ReceiveMessageResult) => payload && payload.Messages && payload.Messages.length > 0

export const receiveMessages = async (queueUrl: string) => {
    const defaultConfig: ReceiveMessageRequest = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 60,
    }
    return sqs.receiveMessage(defaultConfig).promise
}

export const sendMessages = async (queueUrl: string, data: any) => {
    const defaultConfig: SendMessageRequest = {
        QueueUrl: queueUrl,
        MessageBody: data.toString()
    }
    return sqs.sendMessage(defaultConfig).promise()
}