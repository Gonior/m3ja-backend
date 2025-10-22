import { Lang, ErrorCode } from '../constant';
import { translateValidationError } from './i18n.helper';

export function formatErrors(errors: any[], lang: Lang) {
  return errors.map((err) => {
    let message = Object.entries(err.constraints || {}).map(([key, raw]) => {
      const params = {
        field: err.property,
        ...(err.contexts?.[key] || {}),
      };

      return translateValidationError(key as ErrorCode, lang, params, raw as any);
    });

    return { field: err.property, message };
  });
}
