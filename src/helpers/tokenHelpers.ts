import jwt from "jsonwebtoken";

import {
  JWT_SECRET, 
  JWT_EXPIRES_IN,
  ACCESS_TOKEN_SECRET, 
  REFRESH_TOKEN_SECRET, 
  REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN__EXPIRES_IN  } from '../Config/index';

  

export const generateToken = (payload:any) => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: '1h',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, String(JWT_SECRET));
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};





// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret';
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

interface JwtPayload {
  userId: string;
  roles: string[];
}


export const generateRefreshToken = (payload: {}) => {
  return  jwt.sign(payload, REFRESH_TOKEN_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};
// REFRESH_TOKEN_SECRET


export const generateAccessToken = (user: JwtPayload): string => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET as string, {expiresIn:ACCESS_TOKEN__EXPIRES_IN});
};

// export const generateRefreshToken = (user: JwtPayload): string => {
//   return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
// };

export const verifyAccessToken = (token: string): JwtPayload | string|null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET as string) as string | JwtPayload| null;
  } catch (error) {
    return  null;// Invalid token
  }
};

export const verifyRefreshToken = (token: string): JwtPayload |string| null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET as string) as string | JwtPayload | null;
  } catch (error) {
    return null;  // Invalid token
  }
};



