import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    headers: {
        Accept: 'application/json',
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use(
    async (config) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error("Error fetching token:", error);
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;