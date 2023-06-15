import api from "./request";
// 菜单列表
export const MenuListApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get(`/api/system/menu/lists`,params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 账户权限节点
export const MenuRoleNodeApi = () => {
    return new Promise((resolve, reject) => {
        api.get('/api/system/menu/roleMenu')
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}
// 添加


export const MenuApi = (param) => {
    return new Promise((resolve, reject) => {
        api.post('/api/system/menu/update', param)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 删除菜单

export const MenuDeletelApi = (data) => {
    return new Promise((resolve, reject) => {
        api.post('/api/system/menu/delete', data)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 编辑
export const MenudetailApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/system/menu/detail',{params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}