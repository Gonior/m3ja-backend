import { v4 as uuid } from 'uuid';
export const generateFilename = (file: Express.Multer.File) => {
  // biar ga bentrok sama user lain
  return `${uuid()}-${file.originalname}`;
};
