import api from './request'

// 更新区域
export const apiUpdateArea = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/system/attributes/area/update', params).then(res => resolve(res.data)).catch(error => reject(error))
    })
}

export const areaDeleteApi = (data) => {
    return new Promise((resolve, reject) => {
        api.post('/api/system/attributes/area/delete', data)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}






















