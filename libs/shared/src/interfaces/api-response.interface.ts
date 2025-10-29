import { CookieOptions } from 'express';
import { COOKIE_KEY } from '../constant';
type CookieKey = (typeof COOKIE_KEY)[keyof typeof COOKIE_KEY];

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  clearCookies?: CookieKey[];
  setCookies?: {
    name: (typeof COOKIE_KEY)[keyof typeof COOKIE_KEY];
    value: string;
    options?: CookieOptions;
  }[];
}
