import cluster from './utils/spawn'
import { Types } from 'aws-sdk/clients/sqs'

const processMessage = async (message: Types.Message) => {
    await cluster.queue(message.)
}

export default processMessage