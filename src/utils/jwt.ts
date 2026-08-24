import { jwtDecode } from 'jwt-decode';

export type TokenPayload = {
  sub: string;
  exp: number;
  roles?: string[];
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (exp?: number): boolean => {
  if (!exp) return true;
  return Date.now() >= exp * 1000;
};
