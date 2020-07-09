// pages/home/socialInformation/socialInformation.js
var doc = require('../../../model/home/document')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDocuments()
  },

  // 获取资讯
  getDocuments() {
    var self = this;
    doc.documents(1, 100, 0).then(res => {
      console.log('getDocuments res', res);
      self.setData({
        docList: res.data
      })
    })
  },

  // 跳转详情页面
  openDetails(e) {
    var self = this;
    wx.navigateTo({
      url: './details/details?details_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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