export const WORKER_SERVICE = 'WORKER_SERVICE';

export const EVENT = {
  WORKER_UPLOAD_AVATAR: 'user.created.avatar',
  WORKER_UPLOAD_DONE: 'user.avatar.done',
};
export const QUEUE = {
  WORKER_SERVICE_QUEUE: 'worker.service.queue',
  API_SERVICE_QUEUE: 'api.service.queue',
};

export const TTL = {
  STR_ACCESS_TOKEN: '15m',
  STR_REFRESH_TOKEN: '30d',
  SCD_ACCESS_TOKEN: 15 * 60,
  MSSCD_ACCESS_TOKEN: 15 * 60 * 1000,
  SCD_REFRESH_TOKEN: 7 * 24 * 60 * 60,
  MSSCD_REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000,
} as const;

export const MIN_LENGTH_PASSWORD = 8;
export const MIN_LENGTH_DISPLAY_NAME = 1;

export const MAX_LENGTH_DISPLAY_NAME = 100;
export const MAX_LENGTH_EMAIL = 100;
export const MAX_AVATAR_SIZE = 3 * 1024 * 1024; // 3MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB

export const ALLOWED_AVATAR_TYPE = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
export const ALLOWED_FILE_TYPE = [
  ...ALLOWED_AVATAR_TYPE,
  'application/pdf',
  'application/msword',
  'application/msexcel',
  'application/mspowerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
