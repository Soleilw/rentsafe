// pages/personal/house/rent-mag/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {

  },

  toPush() {
    wx.navigateTo({
      url: './renting/renting?address_id=' + app.globalData.detailedAddress_id,
    })
  },

  toList() {
    wx.navigateTo({
      url: '../../../home/rent-msg/rent-msg?address_id=' + app.globalData.detailedAddress_id,
    })
  },

})