import axios from 'axios'
import store from '@/store'
import {Message} from 'element-ui'
import router from '@/router'

const api = axios.create({
    timeout: 5000,
});

api.interceptors.request.use(function (request) {
    request.headers['authorization'] = `Bearer ` + sessionStorage.getItem('token')
    return request
}, function (error) {
    return Promise.reject(error)
})

api.interceptors.response.use(function (response) {
    if (response.data.code === 403) {
        Message.error({message: '登录信息失效，请重新登录', center: true})
        router.push('/login').then()
    }

    if (response.data.code === 1) {
        Message.error({message: response.data.message, center: true})
    }
    return response
}, function (error) {
    return Promise.reject(error)
})


export default api