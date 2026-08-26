import { Request } from 'express';
import { AuthLevel, User } from '@prisma/client';
import { SignOptions, sign, verify } from 'jsonwebtoken';
import { AES, enc } from 'crypto-js';
import { prisma } from '..';
import { compareSync } from 'bcryptjs';

export const errorIsAccessTokenExpiration = (e: any) =>
  e?.message === 'Your access token is expired.';

// Refresh Token: Signed { id, password (encrypted) }
// Access Token: Signed { id, authLevel }

export const signData = (data: any, expiration?: string) => {
  const options: SignOptions = {};
  if (expiration) options.expiresIn = expiration;
  return sign(data, process.env.JWT_SECRET as string, options);
};

export const verifyToken = <T = any>(
  token: string,
): T & {
  iat: number;
  exp?: number;
} => verify(token, process.env.JWT_SECRET as string) as any;

export const encrypt = (data: string) =>
  AES.encrypt(data, process.env.JWT_SECRET as string).toString();

export const decrypt = (data: string) =>
  AES.decrypt(data, process.env.JWT_SECRET as string).toString(
    enc.Utf8,
  ) as string;

export const authLevelToNumber = (level: AuthLevel): number =>
  Object.keys(AuthLevel).indexOf(level);

export const getRefreshToken = (id: string, password: string) =>
  signData({ id, password: encrypt(password) });

export const userFromRefreshToken = async (token?: string) => {
  if (!token) {
    throw new Error('You must be logged in to do this.', {
      cause: new Error('401'),
    });
  }

  const verified = verifyToken<{ id: string; password: string }>(token);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: verified.id },
  });

  if (!compareSync(decrypt(verified.password), user.password)) {
    throw new Error(
      'Your account has changed its password. Please log back in.',
      { cause: new Error('401') },
    );
  }

  return user;
};

export const userToAccessToken = (user: User) =>
  signData({ id: user.id, authLevel: user.authLevel }, '15m');

export const userFromAccessToken = (
  req: Request,
): { id: string; authLevel: AuthLevel } => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new Error('You must be logged in to do this.', {
      cause: new Error('401'),
    });
  }

  try {
    return verifyToken(token);
  } catch {
    throw new Error('Your access token is expired.', {
      cause: new Error('401'),
    });
  }
};

export const requireAuth = (req: Request, idMatch: string) => {
  const { id } = userFromAccessToken(req);
  if (id !== idMatch) {
    throw new Error('You must be logged into the correct account do this.', {
      cause: new Error('403'),
    });
  }
};

export const requireAuthLevel = (req: Request, level: AuthLevel) => {
  const { authLevel } = userFromAccessToken(req);
  const levelNumber = authLevelToNumber(authLevel);
  if (levelNumber < authLevelToNumber(level)) {
    throw new Error('You must be of a higher authorization level to do this.', {
      cause: new Error('403'),
    });
  }
};
