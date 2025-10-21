import { AppLogger } from '@app/common';
// import { existsSync } from 'fs';
// import path from 'path';

let currentLocale: string = 'en';

export function setLocale(locale: string) {
  //const logger = new AppLogger();
  //logger.setContext('Locale');
  if (!['en', 'id', 'jp'].includes(locale)) {
    console.warn(`⚠️ Locale '${locale}' tidak dikenal. Pakai default: 'en'.`);
  }
  currentLocale = locale;
}

export function getLocale() {
  return currentLocale;
}
