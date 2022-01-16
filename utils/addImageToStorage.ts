import { promises as fs } from 'fs';

export const addImageToStorage = async (data: any) => {
  const imageFile = data.files.image;
  const imagePath = imageFile.filepath as string;
  const extension = imageFile.originalFilename.split('.').pop();
  const basePath = `/storage/${imageFile.newFilename}.${extension}`;
  const pathToWriteImage = `public${basePath}`;
  const image = await fs.readFile(imagePath);
  // Add file to storage folder
  await fs.writeFile(pathToWriteImage, image);

  return basePath;
};
