import { httpClient } from './httpClient';

export type AuthRequest = {
  username?: string;
  password?: string;
};

export type RegisterRequest = {
  username?: string;
  password?: string;
  email?: string;
  cpf?: string;
  cep?: string; // Backend usa cep
  roles?: string[];
};

export type AuthResponse = {
  token: string;
  userId?: string;
};

export type StatsResponse = {
  userId: string;
  username: string;
  level: number;
  vitorias: number;
  derrotas: number;
};

export const register = async (data: RegisterRequest): Promise<{ token: string; userId?: string }> => {
  const payload = {
    username: data.username,
    password: data.password,
    email: data.email,
    cep: data.cep || data.cpf || '00000000',
  };
  const response = await httpClient.post<AuthResponse>('/fatec/login/v1/create', payload);
  return { token: response.data.token, userId: response.data.userId };
};

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/fatec/login/v1/auth', data);
  return { token: response.data.token, userId: response.data.userId };
};

export const getStats = async (userId: string): Promise<StatsResponse> => {
  // O backend local não possui a rota /stats, retornamos um mock para não dar erro no console
  return {
    userId,
    username: userId,
    level: 1,
    vitorias: 0,
    derrotas: 0
  };
};
