import type { User, AuthLevel } from '@prisma/client';
import { exclude } from './exclude';

export type PrivateUser = Omit<User, 'password'>;

export type PublicUser = {
  id: string;
  name: string;
  authLevel: AuthLevel;
};

export const privateUser = (user: User): PrivateUser => ({
  ...exclude(user, 'password'),
});

export const publicUserSelect = {
  id: true,
  name: true,
  authLevel: true,
};

export const publicUser = (user: User): PublicUser => ({
  ...(Object.fromEntries(
    Object.entries(user).filter(([key]) =>
      Object.keys(publicUserSelect).includes(key),
    ),
  ) as PublicUser),
});
