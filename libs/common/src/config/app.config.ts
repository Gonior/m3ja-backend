export default () => ({
  app: {
    name : process.env.APP_NAME,
    env : process.env.NODE_ENV,
    apiPort : parseInt(process.env.API_PORT ?? '3000', 10),
    workerPort : parseInt(process.env.WORKER_PORT ?? '3001',10),
    host : process.env.HOST
  }
})