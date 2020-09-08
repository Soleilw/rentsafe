// pages/personal/buy/buy.js
var buy = require('../../../../model/personal/buy')
var infomation = require('../../../../model/personal/infomation')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 购买服务
    page: 1,
    pageSize: 10,
    navIndex: 0, // nav下标
    user_id: null,
    areas_id: null,
    product_id: null,
    address_id: null,
    price: null,
    serviceList: [],
    serviceIndex: 0,
    order_id: null,
    globalShow: null,
    renter_type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('buy', options);
    this.setData({
      areas_id: options.area_id,
      detailedAddress_id: options.detailedAddress_id,
      renter_type: options.renter_type
    })

    this.getUerInfo();
    this.getGoodsList();
  },

  // 跳转账单明细
  toBill() {
    var self = this;
    wx.navigateTo({
      url: '../bill/bill?user_id=' + self.data.user_id + '&detailedAddress_id=' + self.data.detailedAddress_id
    })
  },

  // 获取用户信息
  getUerInfo() {
    var self = this;
    infomation.userInfo(wx.getStorageSync('token')).then(res => {
      console.log('getUerInfo', res);
      self.setData({
        user_id: res.user_id,
      })
    })
  },

  // 获取服务
  getGoodsList() {
    var self = this;
    buy.buys(self.data.page, self.data.pageSize).then(res => {
      console.log('getGoodsList', res);
      self.setData({
        goodsList: res.data,
        serviceList: res.data[0].service,
        product_id: res.data[0].id,
        price: res.data[0].price
      })
    })
  },

  // 支付
  purchase() {
    var self = this;
    // 创建订单
    console.log(self.data.renter_type);
    
    buy.order(self.data.user_id, self.data.areas_id, self.data.product_id, self.data.detailedAddress_id, self.data.price, self.data.renter_type).then(res => {
      console.log('createOeder', res);
      self.setData({
        order_id: res
      })
      // 支付
      buy.buy(wx.getStorageSync('token'), self.data.order_id).then(res => {
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
              title: '购买成功'
            });
            setTimeout(function () {
              wx.navigateTo({
                url: '../../../personal/index/change-user/change-user',
              })
            }, 1500)
          },
          fail(res) {
            console.log(222, res);
            buy.cancelBuy(wx.getStorageSync('token'), self.data.order_id).then(res => {
              console.log('取消支付', res);
              if (res == 1) {
                wx.showToast({
                  icon: "none",
                  title: '取消成功'
                });
              }
            })
          }
        })
      })
    })
  },

  // 点击事件-商品nav
  nav(e) {
    var self = this;
    console.log('点击事件-商品nav', e);
    self.setData({
      navIndex: e.currentTarget.dataset.index
    })

    // 根据商品获取包含的服务
    buy.buys(self.data.page, self.data.pageSize).then(res => {
      console.log('getGoodsList', res);
      self.setData({
        serviceList: res.data[self.data.navIndex].service,
        product_id: res.data[self.data.navIndex].id,
        price: res.data[self.data.navIndex].price
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