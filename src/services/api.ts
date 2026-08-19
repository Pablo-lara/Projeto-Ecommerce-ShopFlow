import axios from 'axios';

// Certifique-se de ajustar a porta caso sua API esteja em outra
export const api = axios.create({
    baseURL: 'http://localhost:5008/api',
});

// Interceptor para adicionar o token JWT em requisições autenticadas
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('shopflow_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});