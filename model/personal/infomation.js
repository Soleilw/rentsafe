var api = require('../../api/index')

var infomation = {};

// 新增/修改个人信息
infomation.register = function (id, token, name, sex, card_number, phone, href) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.UserInfo, {
            id: id,
            token: token,
            name: name,
            sex: sex,
            card_number: card_number,
            phone: phone,
            href: href
        }, function (response) {
            if (response.msg === 'ok') {
                var res = response.data;
                resolve(res);
            } else {
                reject(response);
            }
        })
    })
}

// 获取个人信息
infomation.userInfo = function (token) {
        return new Promise((resolve, reject) => {
            api.get(api.baseUrl.host, api.url.UserInfo, {
                token: token
            }, function (response) {
                if (response.msg === 'ok') {
                    var res = response.data;
                    resolve(res);
                } else {
                    reject(response);
                }
            })
        })
    },

    infomation.user = function (token, type, address_id, address, room_id) {
        return new Promise((resolve, reject) => {
            api.post(api.baseUrl.host, api.url.Household, {
                token: token,
                type: type,
                address_id: address_id,
                address: address,
                room_id: room_id
            }, function (response) {
                debugger

                if (response.msg === 'ok') {
                    var res = response.data;
                    resolve(res);
                } else {
                    debugger
                    reject(response);
                }
            })
        })
    }

// 获取身份信息
infomation.idenInfo = function (token, page, limit) {
        return new Promise((resolve, reject) => {
            api.get(api.baseUrl.host, api.url.MyHouseholds, {
                token: token,
                page: page,
                limit: limit
            }, function (response) {
                if (response.msg === 'ok') {
                    var res = response.data;
                    resolve(res);

                } else {
                    reject(response);
                }
            })
        })
    },



    // 获取审核列表
    infomation.auditList = function (token, page, limit) {
        return new Promise((resolve, reject) => {
            api.get(api.baseUrl.host, api.url.Households, {
                token: token,
                page: page,
                limit: limit
            }, function (response) {
                if (response.msg === 'ok') {
                    var res = response.data;
                    resolve(res);
                } else {
                    reject(response);
                }
            })
        })
    },

    // 审核租客
    infomation.audit = function (token, id, state) {
        return new Promise((resolve, reject) => {
            api.get(api.baseUrl.host, api.url.CheckHousehold, {
                token: token,
                id: id,
                state: state
            }, function (response) {
                if (response.msg === 'ok') {
                    var res = response.data;
                    resolve(res);
                } else {
                    reject(response);
                }
            })
        })
    },



    module.exports = infomation;