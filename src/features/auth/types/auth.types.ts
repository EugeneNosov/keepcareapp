export type User = {
  id: string;
  email: string;
  displayName: string | null;
  emailVerifiedAt: string | null;
  timezone: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  displayName?: string;
};

export type GoogleAuthInput = {
  credential: string;
};
