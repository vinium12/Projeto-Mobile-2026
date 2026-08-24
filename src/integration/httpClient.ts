import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_LOCAL_API_URL || 'http://192.168.0.10:8082';

export const httpClient = axios.create({
  baseURL: API_URL,
});

httpClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@Auth:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access - Token might be invalid or expired.');
      // Opcional: Aqui poderíamos emitir um evento ou usar um DeviceEventEmitter
      // para forçar o logout no AuthContext se desejado globalmente.
    }
    return Promise.reject(error);
  }
);
