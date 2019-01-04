import axios from 'axios';

axios.interceptors.request.use(config => config, err => Promise.reject(err));
axios.interceptors.response.use(response => response.data, err => Promise.reject(err));


module.exports = axios;
