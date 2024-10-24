import axios from 'axios';
import BaseUrl from "../settings.js";

const fetchClient = () => {
    const defaultOptions = {
        baseURL: BaseUrl,
    };

    let instance = axios.create(defaultOptions);

    instance.interceptors.request.use(function (config) {
        const token = localStorage.getItem('token');
        config.headers.Authorization = token ? `Token ${token}` : '';
        return config;
    });

    return instance;
};

export default fetchClient();
