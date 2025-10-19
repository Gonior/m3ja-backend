import { renderTemplate } from '../utils';
import {
  ERROR_MESSSAGE_MIN_LENGTH,
  ERROR_MESSAGE_MAX_LENGTH,
  ERROR_MESSAGE_INVALID_EMAIL,
  ERROR_MESSAGGE_IS_EMPTY,
  ERROR_MESSAGE_ALREADY_EXISTS,
} from '../constant';
import { ValidationArguments } from 'class-validator';

export const minErrorMessage = (field: string, prop: string | number) => {
  return (_args: ValidationArguments) => renderTemplate(ERROR_MESSSAGE_MIN_LENGTH, { field, prop });
};
export const maxErrorMessage = (field: string, prop: string | number) => {
  return (_args: ValidationArguments) => renderTemplate(ERROR_MESSAGE_MAX_LENGTH, { field, prop });
};
export const isEmptyErrorMessage = (field: string) => {
  return (_args: ValidationArguments) => renderTemplate(ERROR_MESSAGGE_IS_EMPTY, { field });
};

export const isAlreadyExistsMessage = (field: string) => {
  return renderTemplate(ERROR_MESSAGE_ALREADY_EXISTS, { field });
};
export const emailErrorMessage = ERROR_MESSAGE_INVALID_EMAIL;
