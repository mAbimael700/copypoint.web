import axios from 'axios';

const ApiClient = axios.create({
    baseURL: `http://localhost:8080/api/`,  // URL base de la API
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,  // Configuración de tiempo de espera
});

// Interceptores de respuesta o petición, si es necesario
ApiClient.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
);

export default ApiClient;