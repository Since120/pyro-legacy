import axios from 'axios';

import './config/config';

// Erstelle den Axios-Client mit Basis-URL (aus .env oder Default)
const apiClient = axios.create({
	baseURL: process.env.API_URL || 'http://localhost:3002', // API_URL aus .env; passe ggf. an
	timeout: 10000, // 10 Sekunden Timeout
	headers: {
		'Content-Type': 'application/json',
	},
});

// Optional: Füge einen Response-Interceptor hinzu
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('API-Fehler:', error);
		return Promise.reject(error);
	}
);

export default apiClient;
