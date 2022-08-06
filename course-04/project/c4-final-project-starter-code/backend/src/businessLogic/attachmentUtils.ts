import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

// export class TodoStorage {
//     constructor(
//         private bucketName = process.env.ATTACHMENT_S3_BUCKET,
//         private urlExpiration = process.env.SIGNED_URL_EXPIRATION,
//         private readonly s3 = new XAWS.S3({signature: 'v4'})
//     ){}

//     getStorageUrl(todoId: string){
//         return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
//     }

//     getUploadUrl(todoId: string){
//         return this.s3.getSignedUrl('putObject',{
//             Bucket: this.bucketName,
//             Key: todoId,
//             Expires: this.urlExpiration,
//         });
//     }
// }

//const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const bucketName = 'serverless-wawerudev-todo-images-dev'
const urlExpiration = 43000
//const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({signatureVersion: 'v4' })
const logger = createLogger('AttachmentUtils')

export function createAttachmentPresignedUrl(todoId: string) {
    try {
        logger.info('Attempting to get s3 presigned URL')
        const presignedUrl = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: urlExpiration
        });
        logger.info('Got presigned URL')
        return presignedUrl;
    }catch(e){
        logger.info(`Could not generate presigned URL due to ${ (e as Error).message }`);
    }
}

export function getStorageUrl(todoId: string){
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`;
}