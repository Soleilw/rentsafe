// pages/home/home.js
var classList = [{ name: '社区资讯', icon: '/icon/information1.png', id: '1' },
{ name: '社区活动', icon: '/icon/information2.png', id: '2' },
{ name: '警讯通知', icon: '/icon/information3.png', id: '3' },
{ name: '居委快讯', icon: '/icon/information4.png', id: '4' }
]
var bannerList = [{icon: '/icon/banner1.png'}]

var banner = require("../../model/home/banner")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    classFication: []
  },

    // 获取轮播图
    getBanner: function () {
      banner.banners(1, 100).then(res => {
        console.log('banner', res);

      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      classFication: classList,
      banner: bannerList
    })
    this.getBanner()
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