var api = require('../../api/index')

var infomation = {};

infomation.register = function(id, token, name, sex, card_number, phone, type, address_id, address, href) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.Household, {
            id: id,
            token: token,
            name: name,
            sex: sex,
            card_number: card_number,
            phone: phone,
            type: type,
            address_id: address_id,
            address: address,
            href: href
        }, function(response) {
            if(response.msg === 'ok') {
                var res = response.data;
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

// 获取个人信息
infomation.userInfo = function(token) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Household, {
            token: token
        }, function(response) {
            if(response.msg === 'ok') {
                var res = response.data;
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
},

// 获取审核列表
infomation.auditList = function(token) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Households, {
            token: token
        }, function(response) {
            if(response.msg === 'ok') {
                var res = response.data;
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
},

// 审核租客
infomation.audit = function(token, id, state) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.CheckHousehold, {
            token: token,
            id: id,
            state: state
        }, function(response) {
            if(response.msg === 'ok') {
                var res = response.data;
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
},



module.exports = infomation;
