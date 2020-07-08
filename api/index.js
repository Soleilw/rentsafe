const tools = require("../utils/tools.js");
const url = require("./url.js");
const baseUrl = require("./baseUrl.js");

var header = {
  'Accept': 'application/json',
  'content-type': 'application/x-www-form-urlencoded'
  // 'Authorization': null,
  // 'token': ''
}

// header.token = wx.getStorageSync('token')

function queryData(data) {
  var str = '';
  for (var i in data) {
    str += i + "=" + data[i] + '&';
  }
  if (str) {
    str = '?' + str;
    str = str.substr(0, str.length - 1);
  }
  return str;
}

function get(baseUrl, url, data, cb) {
  wx.request({
    url: baseUrl + url + queryData(data),
    method: 'get',
    header: header,
    success: function (res) {
      if (res.statusCode === 200) {
        tools.isFunction(cb) && cb(res.data);
      }
      if (res.statusCode === 401) {
        wx.removeStorageSync('wxInfo')
        wx.removeStorageSync('token')

        wx.reLaunch({
          url: "/pages/personal/index/index"
        });
      }
      if (res.statusCode === 403) {
        wx.showToast({
          icon: "none",
          title: res.data.message
        });
      }
      if (res.statusCode === 500) {
        wx.showToast({
          icon: "none",
          title: res.data.message
        });
      }
    },
    fail(res) {
      wx.showModal({
        showCancel: false,
        content: res.msg
      })
    }
  })
}


function post(baseUrl, url, data, cb) {
  wx.request({
    url: baseUrl + url,
    method: 'post',
    data: data,
    header: header,
    success: function (res) {
      if (res.statusCode === 200) {
        tools.isFunction(cb) && cb(res.data);
      }
      if (res.statusCode === 401) {
        wx.showToast({
          icon: "none",
          title: '请登录'
        });
        wx.removeStorageSync('wxInfo')
        wx.removeStorageSync('token')
        wx.reLaunch({
          url: "/pages/personal/index/index"
        });
      }
      if (res.statusCode === 422) {
        wx.showToast({
          icon: "none",
          title: '参数错误，请检查参数'
        });
      }
      if (res.statusCode === 403) {
        wx.showToast({
          icon: "none",
          title: '请登录'
        });
      }
      if (res.statusCode === 500) {
        wx.showToast({
          icon: "none",
          title: '请求系统错误,请检查数据'
        });
      }
    },
    fail(res) {
      wx.showModal({
        showCancel: false,
        content: res.msg
      })
    }
  });
}

// 导出
module.exports = {
  url: url,
  baseUrl: baseUrl,
  get: get,
  post: post
}