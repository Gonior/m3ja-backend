import { TUser } from '../entities';
import { IUploadFileResponse } from './upload-service.interface';

export interface IUploadEvent extends IUploadFileResponse {
  userId: number;
  avatarResizeStatus: TUser['avatarResizeStatus'];
}
