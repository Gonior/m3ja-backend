import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  APP_NAME: Joi.string().default('m3ja'),
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  HOST: Joi.string().hostname().required(),
  API_PORT: Joi.number().default(3000),
  WORKER_PORT: Joi.number().default(3001),

  JWT_SECRET_KEY: Joi.string().min(8).required(),
  SALT: Joi.number().default(10),

  DB_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required(),
  RABBITMQ_URL: Joi.string().uri().required(),

  R2_ACCOUNT_ID: Joi.string().required(),
  R2_ACCESS_KEY_ID: Joi.string().required(),
  R2_SECRET_ACCESS_KEY: Joi.string().required(),
  R2_BUCKET_NAME: Joi.string().required(),
  R2_TOKEN_VALUE: Joi.string().required(),
  R2_ENDPOINT: Joi.string().uri().required(),
  R2_PUBLIC_URL: Joi.string().uri().required(),

  LOG_LEVELS: Joi.string().valid('debug', 'info', 'warn', 'error').default('debug'),
});
