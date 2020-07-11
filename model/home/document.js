var api = require('../../api/index')
var doc = {}

// 获取资讯类型
doc.documentType = function (page, limit, areas_id) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.DocumentType, {
      page: page,
      limit: limit,
      areas_id: areas_id
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

// 获取资讯
doc.documents = function (page, limit, areas_id, type_id) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.Documents, {
      page: page,
      limit: limit,
      areas_id: areas_id,
      type_id: type_id
    }, function (response) {
      if (response.msg === 'ok') {
        var res = response.data
        resolve(res);
      } else {
        reject(response);
      }
    })
  })
},

// 获取资讯详情
doc.docsDetails = function (id) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.DocsDetails, {
      id: id
    }, function (response) {
      if (response.msg === 'ok') {
        var res = response.data
        resolve(res);
      } else {
        reject(response);
      }
    })
  })
},

// 获取资讯列表
doc.DocsList = function (page, limit, areas_id, is_show, type_id) {
  return new Promise((resolve, reject) => {
    api.get(api.baseUrl.host, api.url.DocsList, {
      page: page,
      limit: limit,
      areas_id: areas_id,
      is_show: is_show,
      type_id: type_id
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
module.exports = doc;
