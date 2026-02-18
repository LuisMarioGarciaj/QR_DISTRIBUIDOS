import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";

// Configuración base de la API
// CAMBIA ESTA IP POR LA IP DE TU COMPUTADORA
const API_URL = "http://192.168.3.55:3000/api"; // Ejemplo: 'http://192.168.1.100:3000/api'

// Interfaces para tipos
interface LoginResponse {
  success: boolean;
  token: string;
  user: UserData;
  message?: string;
}

interface UserData {
  id: string;
  name: string;
  lastname: string;
  secondLastname?: string;
  fullName: string;
  email: string;
  ci: string;
  phone: string;
  role: string;
}

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem("@auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o no válido
      await AsyncStorage.removeItem("@auth_token");
      await AsyncStorage.removeItem("@user_data");
      // Aquí puedes emitir un evento para redirigir al login
    }
    return Promise.reject(error);
  },
);

export default api;
export type { LoginResponse, UserData };

console.log("API URL:", API_URL);


