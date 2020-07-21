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
        if(res.data.code == 10001) {
          wx.showToast({
            icon: "none",
            title: '请重新登录'
          });
          wx.removeStorageSync('wxInfo')
          wx.removeStorageSync('token')
          wx.switchTab({
            url: "/pages/personal/index/index"
          });
        }
        if(res.data.code == 10002) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10003) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10004) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10005) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        tools.isFunction(cb) && cb(res.data);
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
        if(res.data.code == 10001) {
          wx.showToast({
            icon: "none",
            title: '请重新登录'
          });
          wx.removeStorageSync('wxInfo')
          wx.removeStorageSync('token')
          wx.switchTab({
            url: "/pages/personal/index/index"
          });
        }
        if(res.data.code == 10002) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10003) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10004) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10005) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        tools.isFunction(cb) && cb(res.data);
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

function del(baseUrl, url, data, cb) {
  wx.request({
    url: baseUrl + url + queryData(data),
    method: 'delete',
    header: header,
    success: function (res) {
      if (res.statusCode === 200) {
        if(res.data.code == 10001) {
          wx.showToast({
            icon: "none",
            title: '请重新登录'
          });
          wx.removeStorageSync('wxInfo')
          wx.removeStorageSync('token')
          wx.switchTab({
            url: "/pages/personal/index/index"
          });
        }
        if(res.data.code == 10002) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10003) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10004) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        if(res.data.code == 10005) {
          wx.showToast({
            icon: "none",
            title: res.data.toast
          });
        }
        tools.isFunction(cb) && cb(res.data);
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

// 导出
module.exports = {
  url: url,
  baseUrl: baseUrl,
  get: get,
  post: post,
  delete: del
}