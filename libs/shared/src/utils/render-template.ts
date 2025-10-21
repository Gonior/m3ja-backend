import { TTemplateInput } from '../entities';
import { getLocale, setLocale } from './local-manager';

/**
 * Render template string dengan data dinamis.
 * Contoh:
 *   renderTemplate('{{key}} must be at least {{value}} chars', { key: 'Password', value: 8 })
 *   → "Password must be at least 8 chars"
 *
 * - Aman kalau ada placeholder yang gak punya data
 * - Bisa handle nested key ({{user.name}})
 */
export default function renderTemplate(
  template: TTemplateInput,
  data: Record<string, any> = {},
  locale?: string,
): string {
  const lang = locale || getLocale();

  const text = typeof template === 'string' ? template : template[lang] || template['en'] || '';

  if (!text) return '';
  if (!data || typeof data !== 'object') return text;

  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    // dukung nested key: "user.name" → data.user.name
    const value = key
      .split('.')
      .reduce(
        (acc: { [x: string]: any }, part: string | number) => (acc ? acc[part] : undefined),
        data,
      );

    // fallback kalau gak ada datanya
    return value !== undefined && value !== null ? String(value) : `{{${key}}}`;
  });
}
