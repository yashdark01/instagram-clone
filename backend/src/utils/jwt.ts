import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign({ userId }, secret, { expiresIn });
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.verify(token, secret) as JWTPayload;
};

