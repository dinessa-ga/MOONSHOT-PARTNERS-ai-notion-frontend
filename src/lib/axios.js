import axios from 'axios';
import {clearToken, getToken} from "@/utils/tokens";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'content-type': 'application/json' }
});

instance.interceptors.request.use(
    config => {
      const token = getToken();

      if (token) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      return config;
    },
    error => Promise.reject(error)
);

instance.interceptors.response.use(
    response => response,
    error => {
      if (error?.response) {
        if (error.response.status === 403 || error.response.status === 401) {
          clearToken();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
);

export default instance;
