import { randomBytes } from 'crypto';
export const generateFilename = (file: Express.Multer.File) => {
  // biar ga bentrok sama user lain
  return `${randomBytes(12).toString('hex')}-${file.originalname}`;
};
