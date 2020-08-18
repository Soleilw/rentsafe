// pages/personal/house/setting/setting.js
var door = require('../../../../model/personal/door')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpen: false,
    detailedAddress_id: '',
    open_door: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detailedAddress_id: options.detailedAddress_id
    })
    this.getDoorState()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    this.getDoorState()
  },
  // 获取一键开门状态
  getDoorState() {
    var self = this;
    door.allowOpen(self.data.detailedAddress_id).then(res => {
      console.log(res);
      self.setData({
        open_door: res.open_door
      })
      if (self.data.open_door == 1) {
        self.setData({
          isOpen: true
        })
      } else {
        self.setData({
          isOpen: false
        })
      }
    })
  },
  openDoor(e) {
    var self = this;
    wx.showToast({
      icon: "none",
      title: '设置成功',
      success: () => {
        door.allowOpen(self.data.detailedAddress_id).then(res => {
          console.log(res);
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