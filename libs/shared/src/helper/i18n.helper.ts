import { ErrorCode } from '@app/common/errors/error-code';
import { camelToScreamingSnake, interpolate } from './string.helper';
import { ERROR_MESSAGES, Lang } from '@app/common/errors/error-message';

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
