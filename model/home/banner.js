var api = require('../../api/index')
var banner = {};

// 获取轮播图
banner.banners = function (page, limit, areas_id) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.Banner, {
      page: page,
      limit: limit,
      areas_id: areas_id
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
