import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  endpoint:    process.env.DO_SPACES_ENDPOINT || 'https://nyc3.digitaloceanspaces.com',
  region:      'us-east-1',
  credentials: {
    accessKeyId:     process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
  forcePathStyle: false,
})

const BUCKET = process.env.DO_SPACES_BUCKET || 'viabl-assets'
const CDN    = process.env.DO_SPACES_CDN

export function pdfKey(analysisId: string): string {
  return `reports/${analysisId}/report.pdf`
}

export function brandKitKey(analysisId: string): string {
  return `brand-kits/${analysisId}/brand-kit.pdf`
}

export async function uploadBuffer(key: string, buffer: Buffer, contentType = 'application/pdf'): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: contentType,
    ACL:         'private',
  }))
  return CDN ? `${CDN}/${key}` : `${process.env.DO_SPACES_ENDPOINT}/${BUCKET}/${key}`
}

export async function signedUrl(key: string, expiresIn = 604800): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn }
  )
}
