import axios from 'axios';
import { useAuthStore } from './store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    signup: (data: { name: string; email: string; password: string }) => api.post('/auth/signup', data),
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
};

// Customers API
export const customersAPI = {
    create: (data: any) => api.post('/customers', data),
    list: (params?: any) => api.get('/customers', { params }),
    getById: (id: string) => api.get(`/customers/${id}`),
    update: (id: string, data: any) => api.put(`/customers/${id}`, data),
    delete: (id: string) => api.delete(`/customers/${id}`),
};

// Invoices API
export const invoicesAPI = {
    create: (data: any) => api.post('/invoices', data),
    list: () => api.get('/invoices'),
    getById: (id: string) => api.get(`/invoices/${id}`),
    update: (id: string, data: any) => api.put(`/invoices/${id}`, data),
    delete: (id: string) => api.delete(`/invoices/${id}`),
    downloadPdf: (id: string) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
    sendEmail: (id: string) => api.post(`/invoices/${id}/send`),
};

// Quotations API
export const quotationsAPI = {
    create: (data: any) => api.post('/quotations', data),
    list: () => api.get('/quotations'),
    getById: (id: string) => api.get(`/quotations/${id}`),
    update: (id: string, data: any) => api.put(`/quotations/${id}`, data),
    delete: (id: string) => api.delete(`/quotations/${id}`),
    downloadPdf: (id: string) => api.get(`/quotations/${id}/pdf`, { responseType: 'blob' }),
    sendEmail: (id: string) => api.post(`/quotations/${id}/send`),
};

// Services API
export const servicesAPI = {
    create: (data: any) => api.post('/services', data),
    list: () => api.get('/services'),
    getById: (id: string) => api.get(`/services/${id}`),
    update: (id: string, data: any) => api.put(`/services/${id}`, data),
    delete: (id: string) => api.delete(`/services/${id}`),
};

// Projects API
export const projectsAPI = {
    create: (data: any) => api.post('/projects', data),
    list: () => api.get('/projects'),
    getById: (id: string) => api.get(`/projects/${id}`),
    update: (id: string, data: any) => api.put(`/projects/${id}`, data),
    delete: (id: string) => api.delete(`/projects/${id}`),
};

// Company API
export const companyAPI = {
    get: () => api.get('/company'),
    update: (data: any) => api.post('/company', data),
};

// AI API
export const aiAPI = {
    getInsights: () => api.get('/ai/insights'),
    downloadReport: () => api.get('/ai/report', { responseType: 'blob' }),
};

export default api;
