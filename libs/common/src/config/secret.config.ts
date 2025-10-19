export default () => ({
  secret: {
    jwt: process.env.JWT_SECRET_KEY,
    salt: parseInt(process.env.SALT as string) ?? 10,
  },
});
