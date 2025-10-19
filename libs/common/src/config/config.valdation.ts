import * as Joi from 'joi'

export const configValidationSchema = Joi.object({
  APP_NAME:Joi.string().default('m3ja'),
  NODE_ENV: Joi.string().valid('development', 'staging', 'production', 'test').default('development'),
  HOST : Joi.string().hostname().required(),
  APP_PORT: Joi.number().default(3000),
  WORKER_PORT: Joi.number().default(3001),

  JWT_SECRET_KEY : Joi.string().min(8).required(),
  SALT: Joi.number().default(10),

  DB_URL : Joi.string().uri().required(),
  REDIS_URL : Joi.string().uri(),
  RABBITMQ_URL :Joi.string().uri(),


  LOG_LEVELS : Joi.string().valid('debug', 'info', 'warn', 'error').default('debug')
})