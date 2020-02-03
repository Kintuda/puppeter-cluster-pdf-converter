import S3, { PutObjectRequest } from 'aws-sdk/clients/s3'
import CONFIG, { isLocal } from '../config/bootstrap'
import http from 'http'
import nano from 'nanoid'

const agent = new http.Agent({ keepAlive: true })

const s3 = new S3({
    region: CONFIG.aws.region,
    httpOptions: { agent },
    endpoint: isLocal() ? 'http://localhost:4572' : undefined,
    s3ForcePathStyle: true
})

export const uploadContent = async (content: Buffer) => {
    const random: string = nano(10)
    const config: PutObjectRequest = {
        Bucket: CONFIG.aws.mainBucket,
        Key: random,
        Body: content,
        ContentType: 'application/pdf'
    }
    await s3.upload(config).promise()
    return random

}