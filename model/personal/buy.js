var api = require('../../api/index')

var buy = {}

// 获取服务
buy.buys = function(page, limit) {
  return new Promise((resolve, reject) => {
      api.get(api.baseUrl.host, api.url.Buys, {
          page: page,
          limit: limit,
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

// 获取开通的服务
buy.userServes = function(token) {
  return new Promise((resolve, reject) => {
      api.get(api.baseUrl.host, api.url.UserServes, {
          token: token
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

// 续费提示
buy.renew = function(token) {
  return new Promise((resolve, reject) => {
      api.get(api.baseUrl.host, api.url.Renew, {
          token: token
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

// 创建订单
buy.order = function(user_id, areas_id, product_id, addresses_id, price) {
  return new Promise((resolve, reject) => {
      api.post(api.baseUrl.host, api.url.Order, {
        user_id: user_id,
        areas_id: areas_id,
        product_id: product_id,
        addresses_id: addresses_id,
        price: price
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

// 支付
buy.buy = function(token, order_id) {
  return new Promise((resolve, reject) => {
      api.post(api.baseUrl.host, api.url.Buy, {
        token: token,
        order_id: order_id
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

module.exports = buy;
