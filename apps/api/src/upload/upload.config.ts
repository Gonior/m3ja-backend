import {
  IUploadConfigs,
  MAX_FILE_AVATAR_SIZE,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPE,
  ALLOWED_FILE_AVATAR_TYPE,
} from '@app/shared';
export const UploadConfigs: IUploadConfigs = {
  avatar: {
    folder: 'avatars',
    maxSize: MAX_FILE_AVATAR_SIZE,
    allowedTypes: ALLOWED_FILE_AVATAR_TYPE,
  },
  document: {
    folder: 'documents',
    maxSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_FILE_TYPE,
  },
};
