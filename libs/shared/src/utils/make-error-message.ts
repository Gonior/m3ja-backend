import { ValidationArguments } from 'class-validator';
import renderTemplate from '../utils/render-template';
import { TMessageData, TTemplateInput } from '../entities';
import { getLocale } from './local-manager';
/**
 * Membuat fungsi pembentuk pesan error fleksibel.
 * - Bisa dipakai di class-validator (return function)
 * - Bisa dipakai manual (return string)
 */
export default function makeErrorMessage(template: TTemplateInput) {
  // Overload: plain = true → string, plain = false → function
  function factory(data?: TMessageData, plain?: true, locale?: string): string;
  function factory(
    data?: TMessageData,
    plain?: false,
    locale?: string,
  ): (args: ValidationArguments) => string;
  function factory(data: TMessageData = {}, plain = false, locale = getLocale() || 'en') {
    if (plain) return renderTemplate(template, data, locale);
    return (_args: ValidationArguments) => renderTemplate(template, data, locale);
  }

  return factory;
}
