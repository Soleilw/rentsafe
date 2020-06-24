var api = require('../../api/index')

var address = {};

address.addresses = function(page, limit, area_id, address) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Addresses, {
            page: page,
            limit: limit,
            area_id: area_id,
            address: address
        }, function(response) {
            if(response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

address.areas = function(page, limit, parent_id) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Areas, {
            page: page,
            limit: limit,
            parent_id: parent_id
        }, function(response) {
            if(response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

// 获取门牌号
address.room = function(page, limit, address_id) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Rooms, {
            page: page,
            limit: limit,
            address_id: address_id
        }, function(response) {
            if(response.msg === 'ok') {
                var res = response.data
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}
module.exports = address;