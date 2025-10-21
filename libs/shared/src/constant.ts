export const DB_PROVIDER = 'DB_PROVIDER';
export const WORKER_SERVICE = 'WORKER_SERVICE';

export const MIN_LENGTH_PASSWORD = 8;
export const MIN_LENGTH_DISPLAY_NAME = 1;

export const MAX_LENGTH_DISPLAY_NAME = 100;
export const MAX_LENGTH_EMAIL = 100;
export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 2MB

export const DEFAULT_ALLOWED_FILE_TYPE = ['image/jpeg', 'image/png', 'application/pdf'];

export const ERROR_MESSSAGE_MIN_LENGTH = {
  en: '{{field}} must be at least {{value}} characters',
  id: '{{field}} minimal {{value}} karakter',
};
export const ERROR_MESSAGE_MAX_LENGTH = {
  en: '{{field}} must not exceed {{value}} characters',
  id: '{{field}} maksimal {{value}} karakter',
};

export const ERROR_MESSAGGE_IS_EMPTY = {
  en: '{{field}} should not be empty',
  id: '{{field}} wajib diisi',
};

export const ERROR_MESSAGE_INVALID_EMAIL = {
  en: 'please provide valid {{field}}',
  id: '{{field}} tidak valid',
};
export const ERROR_MESSAGE_ALREADY_EXISTS = {
  en: '{{field}} already exists',
  id: '{{field}} sudah digunakan',
};

export const ERROR_MESSAGE_TO_LARGE = {
  en: 'the file is too large. Maximum {{maxSize}}MB',
  id: 'ukuran file terlalu besar, maksimum {{maxSize}} ',
};
export const ERROR_MESSAGE_MIME_TYPE_NOT_ALLOWED = {
  en: '{{type}} file type is not supported',
  id: 'File {{type}} tidak didukung',
};
