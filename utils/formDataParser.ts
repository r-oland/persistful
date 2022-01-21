import formidable, { IncomingForm } from 'formidable';
import { NextApiRequest } from 'next';

export type FormDataParserTypes = {
  fields: formidable.Fields;
  files: formidable.Files;
};

export const formDataParser = async (req: NextApiRequest) => {
  // custom body parser (for handling image)
  const data = (await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  })) as FormDataParserTypes;

  return data;
};
