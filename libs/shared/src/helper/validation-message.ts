import { makeErrorMessage } from '../utils';
import {
  ERROR_MESSSAGE_MIN_LENGTH,
  ERROR_MESSAGE_MAX_LENGTH,
  ERROR_MESSAGE_INVALID_EMAIL,
  ERROR_MESSAGGE_IS_EMPTY,
  ERROR_MESSAGE_ALREADY_EXISTS,
  ERROR_MESSAGE_TO_LARGE,
  ERROR_MESSAGE_MIME_TYPE_NOT_ALLOWED,
} from '../constant';

export const minErrorMessage = makeErrorMessage(ERROR_MESSSAGE_MIN_LENGTH);
export const maxErrorMessage = makeErrorMessage(ERROR_MESSAGE_MAX_LENGTH);
export const isEmptyErrorMessage = makeErrorMessage(ERROR_MESSAGGE_IS_EMPTY);
export const isAlreadyExistsMessage = makeErrorMessage(ERROR_MESSAGE_ALREADY_EXISTS);
export const emailErrorMessage = makeErrorMessage(ERROR_MESSAGE_INVALID_EMAIL);
export const toLargeErrorMessage = makeErrorMessage(ERROR_MESSAGE_TO_LARGE);
export const typeFileNotAllowed = makeErrorMessage(ERROR_MESSAGE_MIME_TYPE_NOT_ALLOWED);
