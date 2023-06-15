import api from './request'
// 获取服务项目管理列表
export const categoryItemListApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/service/items/lists', {params})
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



// 启用服务项目
export const categoryItemsEnableApiList = (params) => {
    const id = params.id
    return new Promise((resolve, reject) => {
        api.post('/api/quote/service/items/enable',{id:id})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


// 禁用服务项目
export const categoryItemsForbiddenApiList = (params) => {
    const id = params.id
    return new Promise((resolve, reject) => {
        api.post('/api/quote/service/items/forbidden',{id:id})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


// 保存服务项目管理
export const categoryItemSaveApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/service/items/save',params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 编辑服务项目管理
export const categoryItemDetailApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/service/items/detail', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 优惠活动列表

export const ActivityApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/activity/lists', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 保存优惠活动
export const ActivitySaveApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/activity/save', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 优惠活动编辑

export const ActivityDetailApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/activity/detail', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 优惠活动启用

export const ActivityEnableApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/activity/enable', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 优惠活动禁用

export const ActivityForbiddenApiList = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/activity/forbidden', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}









