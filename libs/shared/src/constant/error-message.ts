import { ErrorCode } from './error-code';
export type Lang = 'en' | 'id';
export const ERROR_MESSAGES: Record<ErrorCode, Record<Lang, string>> = {
  INTERNAL_SERVER_ERROR: {
    en: 'Internal server error',
    id: 'Terjadi kesalahan di server',
  },
  IS_EMAIL: {
    en: '{{field}} must be a valid email address',
    id: '{{field}} harus berupa email yang valid',
  },
  MIN_LENGTH: {
    en: '{{field}} must be at least {{min}} characters',
    id: '{{field}} minimal {{min}} karakter',
  },
  MAX_LENGTH: {
    en: '{{field}} must be at most {{max}} characters',
    id: '{{field}} maksimal {{max}} karakter',
  },
  IS_NOT_EMPTY: {
    en: '{{field}} must not be empty',
    id: '{{field}} tidak boleh kosong',
  },

  ALREADY_EXISTS: {
    en: '{{field}} already exists',
    id: '{{field}} sudah terdaftar',
  },
  FILE_TOO_LARGE: {
    en: 'The file is too large. Maximum {{max}}MB',
    id: 'Ukuran file terlalu besar, maksimum {{max}}MB ',
  },
  FILE_NOT_ALLOWED: {
    en: '{{type}} file is not supported',
    id: 'Jenis file {{type}} tidak didukung ',
  },
  USER_NOT_FOUND: {
    en: 'User not found',
    id: 'Pengguna tidak ditemukan',
  },
  WHITELIST_VALIDATION: {
    en: 'Property {{field}} should not exist',
    id: 'Kata kunci {{field}} tidak terdaftar',
  },
  DATABASE_ERROR: {
    en: 'Database Error',
    id: 'Terjadi kesalahan pada database',
  },
  NOT_FOUND: {
    en: '{{prop}} is not found',
    id: '{{prop}} tidak ditemukan',
  },
  UNAUTHORIZED: {
    en: 'Invalid credential',
    id: 'Kredensial tidak valid',
  },
  DATABASE_UPLOAD_ERROR: {
    en: 'An error occured during upload',
    id: 'Terjadi kesalahan saat upload',
  },
  DATABASE_DELETE_ERROR: {
    en: 'An error occured during upload',
    id: 'Terjadi kesalahan saat hapus',
  },
  VALIDATE_ERROR: {
    en: 'Validate error',
    id: 'Validasi gagal',
  },
  REGISTER_ACCOUNT_ERROR: {
    en: 'Cannot register account',
    id: 'Tidak dapat membuat akun',
  },
  FORBIDDEN: {
    en: 'Forbidden access',
    id: 'Akses tidak diizinkan',
  },
  UNREGISTERED_ERROR: {
    en: 'Error not registered, see the console for more details',
    id: 'Error tidak terdaftar, lihat console untuk melihat detailnya',
  },
} as const;
