import api from './request'

// 获取账户管理列表
export const accountApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/account/lists', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 添加账户
export const saveApiList = (param) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/account/save', param)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 详情

export const detailApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/account/detail', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 启用

export const enableApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/account/enable', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 禁用
export const forbiddenApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/account/forbidden', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 日志列表
export const logsApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/account/logs/lists', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 操作差异比较
export const diffApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/account/logs/diff', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 服务分类列表
export const categoryApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/service/category/lists', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 服务分类管理保存
export const categorySaveApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/service/category/save',params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 服务分类管理编辑
export const categoryDetailApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/service/category/detail', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 服务分类管理启用


export const categoryEnableApiList = (params) => {
    const id = params.id
    return new Promise((resolve, reject) => {
        api.post('/api/quote/service/category/enable',{id:id})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 服务分类管理禁用


export const categoryForbiddenApiList = (params) => {
    const id = params.id
    return new Promise((resolve, reject) => {
        api.post('/api/quote/service/category/forbidden',{id:id})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


























