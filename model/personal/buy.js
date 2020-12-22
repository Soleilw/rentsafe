var api = require('../../api/index')

var buy = {}

// 获取服务
buy.buys = function (page, limit) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Buys, {
            page: page,
            limit: limit,
        }, function (response) {
            if (response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

// 获取开通的服务
buy.userServes = function (token,face_id) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.UserServes, {
            token: token,
        
            face_id: face_id
        }, function (response) {
            if (response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

// 续费提示
buy.renew = function (token, addresses_id) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Renew, {
            token: token,
            addresses_id: addresses_id
        }, function (response) {
            if (response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

// 创建订单
buy.order = function (user_id, areas_id, product_id, addresses_id, price, face_id) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.Order, {
            user_id: user_id,
            areas_id: areas_id,
            product_id: product_id,
            addresses_id: addresses_id,
            price: price,
            face_id: face_id
        }, function (response) {
            if (response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

// 支付
buy.buy = function (token, order_id) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.Buy, {
            token: token,
            order_id: order_id
        }, function (response) {
            if (response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

// 取消支付
buy.cancelBuy =  function (token, order_id) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.CancelBuy, {
            token: token,
            order_id: order_id
        }, function (response) {
            if (response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

buy.orders = function (user_id, face_id) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Orders, {
            user_id: user_id,
            face_id: face_id
        }, function (response) {
            if (response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

module.exports = buy;