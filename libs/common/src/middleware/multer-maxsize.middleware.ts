import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UploadConfigs } from '../config/upload.config';

@Injectable()
export class MulterMaxSizeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.includes('avatar') || req.originalUrl.includes('register'))
      req['multerMaxSize'] = UploadConfigs.avatar.maxSize;
    else if (req.originalUrl.includes('document'))
      req['multerMaxSize'] = UploadConfigs.document.maxSize;
    next();
  }
}
