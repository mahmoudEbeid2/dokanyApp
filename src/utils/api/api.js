import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";


const BASE_URL = `${API}/`;

export const authAPI = axios.create({
  baseURL: `${BASE_URL}auth/`,
});

export const sellerAPI = axios.create({

  baseURL: `${BASE_URL}`, 
});

sellerAPI.interceptors.request.use(
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

export const themeAPI = axios.create({
  baseURL: `${BASE_URL}/theme/`,
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
