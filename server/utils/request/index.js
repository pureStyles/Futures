const axios = require("axios");
const { serverConfig, HEADERS } = require("./config.js");

const serviceAxios = axios.create({
    baseURL: serverConfig.baseURL,
    timeout: 10000,
    withCredentials: false,
});

serviceAxios.interceptors.request.use((config => {
    config.headers = { ...config.headers, ...HEADERS };
    return config;
}), error => {
    Promise.reject(error);
});

serviceAxios.interceptors.response.use((response) => {
    const { data: _data } = response || {};
    const { code, data, msg } = _data || {};
    if (code !== 0) {
        return Promise.reject(new Error(msg || '❌code is not 0'));
    }
    return data;
}, (error) => {
    return Promise.reject(error);
});

module.exports = serviceAxios;