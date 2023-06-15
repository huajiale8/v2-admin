import api from './request'

// 获取报价单列表
export const quoteOrderListApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/order/lists', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

// 报价单详情

export const quoteOrderDetailApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/order/detail', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}

export const apiExport = (id, name) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/order/detail', {params: {id, type: 'export'}, responseType: 'blob'}).then(res => {
            const blob = new Blob([res.data], {
                type: "application/pdf;charset=utf-8",
            });
            const blobURL = window.URL.createObjectURL(blob)
            const tempLink = document.createElement("a")
            tempLink.style.display = "none";
            tempLink.href = blobURL;
            tempLink.setAttribute("download", name);
            if (typeof tempLink.download === "undefined") {
                tempLink.setAttribute("target", "_blank");
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
            Message.success({
                message: "导出成功，下载即将开始，请稍后",
                center: true,
            });
            resolve(res.data)
        }).catch(error => reject(error))
    })
}

// 关闭报价单
export const quoteOrderCloseApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/order/close', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


// 同意报价单

export const quoteOrderPassApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/order/pass', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


// 拒绝报价单


export const quoteOrderRejectApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/order/reject', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}



export const quoteOrderSaveApi = (params) => {
    return new Promise((resolve, reject) => {
        api.post('/api/quote/order/save', params)
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


export const quoteOrderNameApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/account/query', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}


// 编辑
export const quoteOrderRedactApi = (params) => {
    return new Promise((resolve, reject) => {
        api.get('/api/quote/order/detail', {params})
            .then(res => resolve(res.data)).catch(error => reject(error))
    })
}