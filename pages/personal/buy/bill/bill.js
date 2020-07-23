// pages/personal/buy/bill/bill.js
var buy = require('../../../../model/personal/buy')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    user_id: '',
    addresses_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    
    this.setData({
      user_id: options.user_id,
      detailedAddress_id: options.detailedAddress_id
    })
    this.getRecordList()
  },

  // 获取账单
  getRecordList() {
    var self = this;
    buy.orders(self.data.user_id, self.data.detailedAddress_id).then(res => {
      console.log('getRecordList', res);
      self.setData({
        recordList: res
      })
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