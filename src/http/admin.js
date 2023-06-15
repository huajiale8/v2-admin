import api from "./request";
// 管理员列表
export const userListApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/admin/user/lists', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 新增管理员
export const addUserApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post("/api/admin/user/update", params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 禁用管理员
export const disableUserApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post("/api/admin/user/disable", params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 启用管理员


export const enableUserApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post("/api/admin/user/enable", params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 获取编辑内容


export const userDetailApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get(`/api/admin/user/detail?id=`, {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 管理员权限分配详情

export const userGroupApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get(`/api/admin/group/index`, {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 更新权限组分配

export const updateUserApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post("/api/admin/group/update", params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


// 权限组管理列表

export const roleListApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/admin/role/lists', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
export const rulesTreeApi = () => {
    return new Promise((resolve, reject) => {
        api.get('/api/admin/role/rules')
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 更新权限组


export const roleUpdateUserApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post("/api/admin/role/update", params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


export const roleDetailListApi = (id) => {
    return new Promise((resolve, reject) => {
        api.get(`/api/admin/role/detail`, {
            params: {
                id: id
            }
        })
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 启用权限组


export const roleDisableUserApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post("/api/admin/role/disable", params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 启用管理员


export const roleEnableUserApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post("/api/admin/role/enable", params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 日志列表
export const logListApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get(`/api/admin/log/lists`, {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

