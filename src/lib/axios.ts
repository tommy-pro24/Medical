import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND,
    headers: {
        'Accept': 'application/json'
    }
})

// Add request interceptor to handle FormData vs JSON
api.interceptors.request.use((config) => {
    // If data is FormData, don't set Content-Type (let browser set it automatically)
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    } else {
        // For JSON data, set Content-Type to application/json
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

export default api
