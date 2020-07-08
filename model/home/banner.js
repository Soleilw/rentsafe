var api = require('../../api/index')
var banner = {};

// 获取轮播图
banner.banners = function (page, limit) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.hosts, api.url.Banner, {
      page: page,
      limit: limit
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

module.exports = banner;
