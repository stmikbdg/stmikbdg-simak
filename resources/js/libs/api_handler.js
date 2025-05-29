import axios, { isAxiosError } from "axios"

const api_handler = {
    get: async ({
        url = '/',
        base_url = `${import.meta.env.VITE_API_BASE_URL}`,
        payload,
        headers = {},
        token
    }) => {
        try {
            const response = payload
                ? await axios({
                    url: `${base_url}${url}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        ...headers
                    },
                    data: payload,
                    timeout: 60000,
                    timeoutErrorMessage: 'Tampaknya ada masalah di server, silahkan coba lagi'
                })
                : await axios.get(`${base_url}${url}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        ...headers
                    },
                    timeout: 60000,
                    timeoutErrorMessage: 'Tampaknya ada masalah di server, silahkan coba lagi'
                })

            if(response?.data?.status === 'success') {
                return {
                    success: true,
                    data: response?.data?.data,
                    message: response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: response?.data?.message
                }
            }
        } catch (error) {
            if(isAxiosError(error)) {
                if(error.code === 'ECONNABORTED') {
                    return {
                        success: false,
                        message: 'Tampaknya ada masalah di server, silahkan coba lagi'
                    }
                }
                return {
                    success: false,
                    message: error?.response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: error?.message || error?.error,
                    debug: error?.stack
                }
            }
        }
    },
    post: async ({
        url = '/',
        base_url = `${import.meta.env.VITE_API_BASE_URL}`,
        payload,
        headers = {},
        token
    }) => {
        try {
            const response = await axios.post(`${base_url}${url}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...headers
                },
                timeout: 60000,
                timeoutErrorMessage: 'Tampaknya ada masalah di server, silahkan coba lagi'
            })

            console.log(response?.data, response)

            if(response?.data?.status === 'success' || response?.data?.success) {
                return {
                    success: true,
                    data: response?.data?.data,
                    message: response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: response?.data?.message
                }
            }
        } catch (error) {
            if(isAxiosError(error)) {
                if(error.code === 'ECONNABORTED') {
                    return {
                        success: false,
                        message: 'Tampaknya ada masalah di server, silahkan coba lagi'
                    }    
                }
                return {
                    success: false,
                    message: error?.response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: error?.message || error?.error,
                    debug: error?.stack
                }
            }
        }
    },
    postForm: async ({
        url = '/',
        base_url = `${import.meta.env.VITE_API_BASE_URL}`,
        payload,
        headers = {},
        token
    }) => {
        try {
            const response = await axios.postForm(`${base_url}${url}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...headers
                },
                timeout: 60000,
                timeoutErrorMessage: 'Tampaknya ada masalah di server, silahkan coba lagi'
            })

            if(response?.data?.status === 'success'  || response?.data?.success) {
                return {
                    success: true,
                    data: response?.data?.data,
                    message: response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: response?.data?.message
                }
            }
        } catch (error) {
            if(isAxiosError(error)) {
                if(error.code === 'ECONNABORTED') {
                    return {
                        success: false,
                        message: 'Tampaknya ada masalah di server, silahkan coba lagi'
                    }    
                }
                return {
                    success: false,
                    message: error?.response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: error?.message || error?.error,
                    debug: error?.stack
                }
            }
        }
    },
    put: async ({
        url = '/',
        base_url = `${import.meta.env.VITE_API_BASE_URL}`,
        payload,
        headers = {},
        token
    }) => {
        try {
            const response = await axios.put(`${base_url}${url}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...headers
                },
                timeout: 60000,
                timeoutErrorMessage: 'Tampaknya ada masalah di server, silahkan coba lagi'
            })

            if(response?.data?.status === 'success') {
                return {
                    success: true,
                    data: response?.data?.data,
                    message: response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: response?.data?.message
                }
            }
        } catch (error) {
            if(isAxiosError(error)) {
                if(error.code === 'ECONNABORTED') {
                    return {
                        success: false,
                        message: 'Tampaknya ada masalah di server, silahkan coba lagi'
                    }    
                }
                return {
                    success: false,
                    message: error?.response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: error?.message || error?.error,
                    debug: error?.stack
                }
            }
        }
    },

    delete: async ({
        url = '/',
        base_url = `${import.meta.env.VITE_API_BASE_URL}`,
        payload,
        headers = {},
        token
    }) => {
        try {

            const response = await axios({
                method: 'DELETE',
                url: `${base_url}${url}`,
                data: payload,
                timeout: 60000,
                timeoutErrorMessage: 'Tampaknya ada masalah di server, silahkan coba lagi',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...headers
                }
            })

            if(response?.data?.status === 'success') {
                return {
                    success: true,
                    data: response?.data?.data,
                    message: response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: response?.data?.message
                }
            }
        } catch (error) {
            if(isAxiosError(error)) {
                if(error.code === 'ECONNABORTED') {
                    return {
                        success: false,
                        message: 'Tampaknya ada masalah di server, silahkan coba lagi'
                    }    
                }
                return {
                    success: false,
                    message: error?.response?.data?.message
                }
            }else{
                return {
                    success: false,
                    message: error?.message || error?.error,
                    debug: error?.stack
                }
            }
        }
    },
    multi: {
        delete: async ({
            token, base_url, requests = []
        }) => {

            const results = await Promise.allSettled(requests.map(req => api_handler.delete({...req, token, base_url})))
            console.log(results)

            return results.map((res, i) => {
                if(res.status === 'fulfilled') {
                    return {
                        ...res.value,
                        request: requests[i]
                    }
                }else{
                    return {
                        success: false,
                        message: res.reason?.message || 'Terjadi kesalahan pada server, silahkan hubungi Administrator',
                        request: requests[i]
                    }
                }
            })
        }
    }
}

export default api_handler