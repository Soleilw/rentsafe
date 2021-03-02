var api = require('../../api/index')
var recruitAPI = {}

// 获取资讯类型
recruitAPI.postList = function (page, limit, type) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.PostList, {
      page: page,
      limit: limit,
      type: type
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

module.exports = recruitAPI;
