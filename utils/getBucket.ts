import { Storage } from '@google-cloud/storage';

export const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEY,
  projectId: 'persistful',
});

export const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME || '');
