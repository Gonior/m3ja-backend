export const DB_PROVIDER = 'DB_PROVIDER';
export const WORKER_SERVICE = 'WORKER_SERVICE';
export const WORKER_UPLOAD_AVATAR = 'WORKER_UPLOAD_AVATAR';
export const WORKER_UPLOAD_DONE = 'WORKER_UPLOAD_DONE';

export const MIN_LENGTH_PASSWORD = 8;
export const MIN_LENGTH_DISPLAY_NAME = 1;

export const MAX_LENGTH_DISPLAY_NAME = 100;
export const MAX_LENGTH_EMAIL = 100;
export const MAX_AVATAR_SIZE = 1 * 1024 * 1024; // 1MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_AVATAR_TYPE = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
export const ALLOWED_FILE_TYPE = [
  ...ALLOWED_AVATAR_TYPE,
  'application/pdf',
  'application/msword',
  'application/msexcel',
  'application/mspowerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
