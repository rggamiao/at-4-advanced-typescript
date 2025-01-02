import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_default_secret_key';

export const generateToken = (payload: object, expiresIn: string = '1h'): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};