// pages/home/home.js
// var classList = [{
//     name: '社区资讯',
//     icon: '/icon/information1.png',
//     id: '1'
//   },
//   {
//     name: '社区活动',
//     icon: '/icon/information2.png',
//     id: '2'
//   },
//   {
//     name: '警讯通知',
//     icon: '/icon/information3.png',
//     id: '3'
//   },
//   {
//     name: '居委快讯',
//     icon: '/icon/information4.png',
//     id: '4'
//   }
// ]

var banner = require("../../model/home/banner")
var doc = require('../../model/home/document')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    classFication: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBanner();
    this.getDoc()
  },

  // 获取轮播图
  getBanner() {
    var self = this;
    banner.banners(1, 100, 0).then(res => {
      console.log('banner', res.data);
      self.setData({
        banners: res.data
      })
    })
  },

  // 获取资讯
  getDoc() {
    var self = this;
    doc.documentType(1, 100, 0).then(res => {
      console.log('doc', res);
      self.setData({
        classFication: res.data
      })
    })
  },

  // 调转资讯页面
  openClassification(e) {
    console.log('e', e.currentTarget.dataset.id);
    wx.navigateTo({
      url: './socialInformation/socialInformation?type=' + e.currentTarget.dataset.id
    })
    // switch(e.currentTarget.dataset.id) {
    //   case '1':
    //     wx.navigateTo({
    //       url: './socialInformation/socialInformation?type=' + e.currentTarget.dataset.id
    //     })
    //   break;
    //   case '2':
    //     wx.navigateTo({
    //       url: './activity/activity',
    //     })
    //   break;
    //   case '3':
    //     wx.navigateTo({
    //       url: './warningNotice/warningNotice',
    //     })
    //   break;
    //   case '4':
    //     wx.navigateTo({
    //       url: './news/news',
    //     })
    //   break;
    // }
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