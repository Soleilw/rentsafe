// pages/home/socialInformation/details/details.js
var WxParse = require('../../../../wxParse/wxParse.js');
var doc = require('../../../../model/home/document')

Page({

      /**
       * 页面的初始数据
       */
      data: {
        details: null,
        id: ''
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        this.setData({
          id: options.details_id
        })
        this.getDetails();
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function () {

      },

      // 获取资讯详情
      getDetails() {
        var self = this;
        wx.showLoading({
          title: '数据加载中...',
        })
        doc.docsDetails(self.data.id).then(res => {
          console.log('created_at', res.created_at);
          
          WxParse.wxParse('article', 'html', res.detail, self, 2);
          self.setData({
            details: res
          })
          wx.hideLoading({
            success: (res) => {},
          })
        })
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