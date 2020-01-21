import S3, { PutObjectRequest } from 'aws-sdk/clients/s3'
import CONFIG from '../config/bootstrap'
import http from 'http'
import nano from 'nanoid'

const agent = new http.Agent({ keepAlive: true })
const s3 = new S3({ region: CONFIG.aws.region, httpOptions: { agent } })

export const uploadContent = async (content: Buffer) => {
    const random: string = nano(10)
    const config: PutObjectRequest = {
        Bucket: CONFIG.aws.mainBucket,
        Key: random,
        ContentType: 'application/pdf',
        ContentLength: content.byteLength
    }
    await s3.upload(config).promise()
    return random

}