// pages/personal/buy/bill/bill.js
var buy = require('../../../../model/personal/buy')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    user_id: '',
    addresses_id: '',
    face_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    this.setData({
      user_id: options.user_id,
      detailedAddress_id: options.detailedAddress_id,
      face_id: options.face_id
    })
    this.getRecordList()
  },

  // 获取账单
  getRecordList() {
    var self = this;
    buy.orders(self.data.user_id, self.data.face_id).then(res => {
      console.log('getRecordList', res);
      self.setData({
        recordList: res
      })
    })
  },

  resetPay(e) {
    let self = this;
    let order_id = e.currentTarget.dataset.id;
    console.log(e);
    buy.buy(wx.getStorageSync('token'), order_id).then(res => {
      console.log('支付', res);
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: 'MD5',
        paySign: res.paySign,
        success(res) {
          console.log(111, res);
          wx.showToast({
            icon: "none",
            title: '购买成功',
          });
        },
        fail(res) {
          console.log(222, res);
          buy.cancelBuy(wx.getStorageSync('token'), order_id).then(res => {
            console.log('取消支付', res);
            if (res == 1) {
              wx.showToast({
                icon: "none",
                title: '取消成功'
              });
              self.getRecordList()
            }
          })
        }
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