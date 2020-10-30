var api = require('../../api/index')

var door = {}
// 允许开门
door.allowOpen = function (address_id) {
  return new Promise((resolve, reject) => {
    api.post(api.baseUrl.host, api.url.AllowOpen, {
      address_id: address_id
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
// 一键开门
door.openDoor = function (uuid, token, address_id, face_id) {
  return new Promise((resolve, reject) => {
    api.post(api.baseUrl.host, api.url.OpenDoor, {
      uuid: uuid,
      token: token,
      address_id: address_id,
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
// 地址设备列表
door.addressDevices = function (address_id) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.AddressDevices, {
      address_id: address_id
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

module.exports = door;