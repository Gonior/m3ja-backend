import { ErrorCode, ERROR_MESSAGES, Lang } from '../constant';
import { camelToScreamingSnake, interpolate } from './string.helper';

export function translateValidationError(
  key: string | ErrorCode,
  lang: Lang,
  params: Record<string, any> = {},
  fallback?: string,
) {
  const code = camelToScreamingSnake(key);
  const dict = ERROR_MESSAGES[code as ErrorCode];

  const template = dict?.[lang] ?? dict?.['en'] ?? fallback ?? 'validation error';
  return interpolate(template, params);
}
