export default () => ({
  secret: {
    jwt: process.env.JWT_SECRET_KEY,
    slat: Number(process.env.SALT) ?? 10,
  },
});
