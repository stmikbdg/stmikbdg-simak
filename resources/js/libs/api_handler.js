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
                    timeout: 15000,
                    timeoutErrorMessage: 'Tampaknya ada masalah di server, silahkan coba lagi'
                })
                : await axios.get(`${base_url}${url}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        ...headers
                    },
                    timeout: 15000,
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
    }
}

export default api_handler