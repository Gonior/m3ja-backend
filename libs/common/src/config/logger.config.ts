export default () => ({
  logger: {
    level: process.env.LOG_LEVELS ?? 'debug',
  },
});
