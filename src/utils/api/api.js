import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";

const BASE_URL = `${API}/`;

// Log the API configuration for debugging
console.log('🔧 API Configuration:', {
  API_ENV: API,
  BASE_URL: BASE_URL,
  sellerAPI_baseURL: `${API}/api/`,
  authAPI_baseURL: `${API}/api/auth/`,
  themeAPI_baseURL: `${API}/api/theme/`
});

export const authAPI = axios.create({
  baseURL: `${BASE_URL}auth/`,
});

export const sellerAPI = axios.create({
  baseURL: `${BASE_URL}api/`, 
});

sellerAPI.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging
    console.log('🔗 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
sellerAPI.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const themeAPI = axios.create({
  baseURL: `${BASE_URL}api/theme/`,
});

themeAPI.interceptors.request.use(
  async (config) => {

    const token = await AsyncStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
