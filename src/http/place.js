import api from "./request";
// 位置列表
export const placeListApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/system/attributes/place/lists', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 新增位置
export const addPlaceApi = (param) => {
    return new Promise((resolve, reject) => {
        api.post('/api/system/attributes/place/update', param)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 位置详情
export const detailPlaceApi = (id) => {
    return new Promise((resolve, reject) => {
        api.get('/api/system/attributes/category/detail', {
            params: {
                id
            }
        }).then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 请求权限列表
export function configDetailApi() {
    return api({
        url: '/api/system/config/detail',
        method: 'GET'
    })
}

// 站点更新
export const ConfigSaveApi = (param) => {
    return new Promise((resolve, reject) => {
        api.post('/api/system/config/save',param)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


