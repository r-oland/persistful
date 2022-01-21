import formidable from 'formidable';
import fs from 'fs';
import { FormDataParserTypes } from './formDataParser';
import { bucket } from './getBucket';

const getPublicUrl = (bucketName: string, fileName: string) =>
  `https://storage.googleapis.com/${bucketName}/${fileName}`;

export const addImageToStorage = async (
  data: FormDataParserTypes,
  folder: string
) => {
  const imageFile = data.files.image as formidable.File;
  const imagePath = imageFile.filepath;
  const extension = imageFile.originalFilename?.split('.').pop();
  const fileName = `${folder}/${imageFile.newFilename}.${extension}`;

  const file = bucket.file(fileName);

  await new Promise((resolve, reject) => {
    fs.createReadStream(imagePath)
      .pipe(file.createWriteStream({ resumable: false }))
      .on('finish', () => {
        resolve(true);
      })
      .on('error', (err) => {
        console.log(err);
        reject();
      });
  });

  return getPublicUrl(bucket.name, fileName);
};
