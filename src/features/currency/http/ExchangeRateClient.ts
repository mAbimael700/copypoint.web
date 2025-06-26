import axios from 'axios';

const ExchangeApiClient = axios.create({
    baseURL: ` https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_RATE_SECRET}`,  // URL base de la API
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,  // Configuración de tiempo de espera
});

// Interceptores de respuesta o petición, si es necesario
ExchangeApiClient.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
);

export default ExchangeApiClient;