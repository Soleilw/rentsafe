var api = require('../../api/index')

var address = {};

address.importAddress = function(page, limit, area_id) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Addresses, {
            page: page,
            limit: limit,
            area_id: area_id
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

module.exports = address;