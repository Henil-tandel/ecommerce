import { SignOptions } from 'jsonwebtoken';

export default {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '15d',
    algorithm: 'HS256',
  } as SignOptions,
};
