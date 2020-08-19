// pages/personal/house/setting/setting.js
var door = require('../../../../model/personal/door')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    detailedAddress_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detailedAddress_id: options.detailedAddress_id,
      open: app.globalData.open_door
    })
    if (app.globalData.open_door == 1) {
      this.setData({
        open: true
      })
    } else if (app.globalData.open_door == 2) {
      this.setData({
        open: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    if (app.globalData.open_door == 1) {
      this.setData({
        open: true
      })
    } else if (app.globalData.open_door == 2) {
      this.setData({
        open: false
      })
    }
  },

  openDoor(e) {
    var self = this;
    var state = self.data.open;
    wx.showToast({
      icon: "none",
      title: '设置成功',
      success: () => {
        door.allowOpen(self.data.detailedAddress_id).then(res => {
          self.setData({
            open: !state
          })
          app.globalData.open_door = !state == true ? 1 : 2;
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})