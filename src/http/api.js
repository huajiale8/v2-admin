import api from './request'
import store from "@/store";

// 请求登录接口
export function LoginApi(params) {
    return api({
        url: '/api/auth/login',
        method: 'POST',
        params
    })
}

// 退出登录
export const apiLogout = () => {
    return new Promise((resolve, reject) => {
        api.post('/api/auth/logout').then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error)
        })
    })
}
export const apiGetUser = () => {
    return new Promise((resolve, reject) => {
        api.get('/api/auth/userInfo').then(res => resolve(res.data)).catch(error => reject(error))
    })
}
export const menuApi = () => {
    return new Promise((resolve, reject) => {
        api.get('/api/system/menu/roleMenu').then(res => resolve(res.data)).catch(error => reject(error))
    })
}


// 区域配置
export const attributesApi = () => {
    return new Promise((resolve, reject) => {
        api.get('/api/system/attributes/area/index').then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 分类列表
export function categoryApi(params) {
    return api({
        url: '/api/system/attributes/category/lists',
        method: 'GET',
        params
    })
}

// 删除分类
export const categoryDeleteApi = (id) => {
    return new Promise((resolve, reject) => {
        api.post(`/api/system/attributes/category/delete/`, {id})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 新增全景分类
export const addCateApi = (param) => {
    return new Promise((resolve, reject) => {
        api.post('/api/system/attributes/category/update', param)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 分类详情
export const ParticularsCateApi = (id) => {
    console.log('ParticularsCateApi', {id})
    return new Promise((resolve, reject) => {
        api.get('/api/system/attributes/category/detail', {
            params: {
                id: id
            }
        }).then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 请求权限
export function getJurisdictionApi() {
    return api({
        url: "/api/system/menu/roleNode",
        method: 'GET'

    })
}

export function userInfoApi() {
    return api({
        url: "/api/auth/userInfo",
        method: 'GET'

    })
}

export function profileApi(params) {
    return api({
        url: "/api/profile/save",
        method: 'post',
        params

    })
}


export const auth = (name) => {
    let obj = store.state.JurisdictionArray
    return obj.indexOf(name) >= 0;
}
