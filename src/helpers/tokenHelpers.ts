import jwt from "jsonwebtoken";

import {JWT_SECRET, JWT_EXPIRES_IN} from '../Config/index';

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





export const generateRefreshToken = (payload: {}) => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

// export const verifyRefreshToken = (token: string) => {
//   return jwt.verify(token, JWT_SECRET as string);
// };

// export const decodeRefreshToken = (token: string) => {
//   return jwt.decode(token);
// };

// export const generatePasswordResetToken = (payload: {}) => {
//   return jwt.sign(payload, JWT_SECRET as string, {
//     expiresIn: '1h',
//   });
// };


