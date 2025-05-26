import { NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Cloudflare R2 Configuration
const BUCKET_NAME = 'amorify';
const REGION = 'auto';
const ACCESS_KEY_ID = 'a6e01fdab2df734763a96574b2220208';
const SECRET_ACCESS_KEY = 'c73a6256470438fe31395a252a9b2176ee888be460182e88ab796ac2644b116a';
const ENDPOINT = 'https://4a70439408224d3b1cbc533a0947d576.r2.cloudflarestorage.com/amorify';

const s3Client = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const uploadToCloudflare = async (file: File, folder: string = 'adwah') => {
  try {
    if (!file || !file.name) {
      throw new Error('Invalid file object');
    }

    const randomName = `${Date.now()}-${Math.floor(Math.random() * 1000000)}${file.name.substring(
      file.name.lastIndexOf('.')
    )}`;
    const key = `${folder}/${randomName}`;

    const uploadParams = {
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.stream(),
        ContentType: file.type,
      },
    };

    const upload = new Upload(uploadParams);
    await upload.done();

    return `https://pub-59803289c55c4b2bb5cf893c37208875.r2.dev/amorify/${key}`;
  } catch (error) {
    console.error('Error uploading to Cloudflare:', error);
    throw new Error('Failed to upload image');
  }
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded or file format incorrect', success: false },
        { status: 400 }
      );
    }

    const imageUrl = await uploadToCloudflare(file, 'uploads');

    return NextResponse.json(
      { message: 'File uploaded successfully', imageUrl, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', success: false },
      { status: 500 }
    );
  }
}
