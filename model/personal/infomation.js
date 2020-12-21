var api = require('../../api/index')

var infomation = {};

// 新增/修改个人信息
infomation.register = function (token, name, sex, card_number, phone, href, number_type) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.UserInfo, {
            token: token,
            name: name,
            sex: sex,
            card_number: card_number,
            phone: phone,
            href: href,
            number_type: number_type
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
            if (response.msg === 'ok') {
                var res = response.data;
                resolve(res);
            } else {
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
infomation.children = function (token, href, name, sex, address_id, address, room_id, card_number, phone, number_type) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.Child, {
            token: token,
            href: href,
            name: name,
            sex: sex,
            address_id: address_id,
            address: address,
            room_id: room_id,
            card_number: card_number,
            phone: phone,
            number_type: number_type
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
infomation.auditList = function (page, limit, token, address_id, type1, type2) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Households, {
            page: page,
            limit: limit,
            token: token,
            address_id: address_id,
            type1: type1,
            type2: type2
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

infomation.search = function (page, limit, token, address_id, type1, type2, name) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.Households, {
            page: page,
            limit: limit,
            token: token,
            address_id: address_id,
            type1: type1,
            type2: type2,
            name: name
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

// 审核租客/物业
infomation.audit = function (token, id, state, type, self) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.CheckHousehold, {
            token: token,
            id: id,
            state: state,
            type: type,
            self: self
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
// 审核家庭成员
infomation.auditFamily = function (token, id, state, type, self) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.CheckHousehold, {
            token: token,
            id: id,
            state: state,
            type: type,
            self: self
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

// 用户缴费列表
infomation.serverUser = function (address_id, page, limit) {
    return new Promise((resolve, reject) => {
        api.get(api.baseUrl.host, api.url.ServerUser, {
            address_id: address_id,
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

// 审核访客
infomation.auditVisitor = function (token, id, state) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.CheckVisitor, {
            token: token,
            id: id,
            state: state,
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

// 删除租客
infomation.delHousehold = function (id, self) {
    return new Promise((resolve, reject) => {
        api.delete(api.baseUrl.host, api.url.DelHousehold, {
            id: id,
            self: self
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

// 获取出租屋用户
infomation.addrressUser = function (addresses_id, room, page, limit) {
return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.AddrressUser, {
        addresses_id: addresses_id,
        room: room,
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
}

// 新增访客
infomation.visitor = function (token, addresses_id, name, href, phone, interviewee, visitor_date, room_id) {
return new Promise((resolve, reject) => {
    api.post(api.baseUrl.host, api.url.Visitor, {
        token: token,
        addresses_id: addresses_id,
        name: name,
        href: href,
        phone: phone,
        interviewee: interviewee,
        visitor_date: visitor_date,
        room_id: room_id
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
// 获取用户访客
infomation.visitors = function (token) {
return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.Visitors, {
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
}

// 修改
infomation.amend = function (id, token, name, sex, card_number, phone, href) {
return new Promise((resolve, reject) => {
    api.post(api.baseUrl.host, api.url.Amend, {
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
// 判断添加家庭成员身份
infomation.familyType = function (id) {
return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.FamilyType, {
        id: id
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

// 获取所在社区
infomation.areaMag = function (id) {
return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.AreasMsg, {
        id: id
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

// 获取门牌号
infomation.gainDoorNum = function (room_id) {
return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.Room, {
        room_id: room_id
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

// 修改门牌号
infomation.modifyDoorNum = function (room_id, id) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.Room, {
            room_id: room_id,
            id: id
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

// 访客码
infomation.passCode = function (address_id, expire, face_id) {
    return new Promise((resolve, reject) => {
        api.post(api.baseUrl.host, api.url.PassCode, {
            address_id: address_id,
            expire: expire,
            face_id: face_id
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

module.exports = infomation;