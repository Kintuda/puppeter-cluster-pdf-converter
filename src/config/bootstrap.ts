import assert from 'assert'

const {
    NODE_ENV,
    MAX_CONCURRENCY,
    SQS_URL,
    AWS_REGION,
    AWS_DEFAULT_REGION,
    TIMEOUT,
    BUCKET_URL
} = process.env

interface Config {
    env: string
    aws: {
        mainQueue: string,
        region: string
        mainBucket: string
    }
    puppeteer: {
        maxConcurrency: number
        args: Array<string>
        timeout: number
    }
    pageOptions: {
        printBackground: boolean
        format: 'A4' | 'A5' | 'Letter'
    }
}

const config: Config = {
    env: NODE_ENV || 'development',
    aws: {
        mainQueue: SQS_URL!,
        region: AWS_REGION || AWS_DEFAULT_REGION || 'us-east-1',
        mainBucket: BUCKET_URL!
    },
    puppeteer: {
        maxConcurrency: parseInt(MAX_CONCURRENCY || '2'),
        args: [
            '--disable-setuid-sandbox',
            '--disable-gpu'
        ],
        timeout: parseInt(TIMEOUT || '30000')
    },
    pageOptions: {
        printBackground: true,
        format: 'A4',
    }
}

export const ensureEnvs = () => [
    config.env,
    config.aws.mainQueue,
    config.puppeteer.maxConcurrency,
    config.aws.mainBucket
].map(env => assert(env, `Missing required env`))

export const isLocal = () => NODE_ENV === 'development'

export default config