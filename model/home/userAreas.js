var api = require('../../api/index')
var areasId = {}

areasId.userAreas = function (token) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.UserAreas, {
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

module.exports = areasId;
