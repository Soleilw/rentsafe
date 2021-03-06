// pages/personal/buy/buy.js
var buy = require('../../../../model/personal/buy')
var infomation = require('../../../../model/personal/infomation')
var app = getApp()
let serviceName
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
    renter_type: '',
    face_id: '',
    goodsNameL: '',
    recordList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('buy', app.globalData.userName);

    this.setData({
      areas_id: options.area_id,
      detailedAddress_id: options.detailedAddress_id,
      renter_type: options.renter_type,
      face_id: options.face_id,
    })
    wx.showToast({
      icon: 'none',
      title: '购买成功之后, 请前往"我的"页面关注公众号, 即可接受相关推送消息',
      duration: 3000
    })

    this.getUerInfo();
    this.getGoodsList();
  },

  // 跳转账单明细
  toBill() {
    var self = this;
    wx.navigateTo({
      url: '../bill/bill?user_id=' + self.data.user_id + '&detailedAddress_id=' + self.data.detailedAddress_id + '&face_id=' + self.data.face_id
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
      self.getRecordList(self.data.user_id, self.data.face_id);
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
      serviceName = self.data.goodsList[0].title
      console.log(serviceName);
    })
  },

  // 获取订单列表
  getRecordList(order_id, face_id) {
    var self = this;
    var orderArr = []
    buy.orders(order_id, face_id).then(res => {
      console.log('getRecordList', res);
      self.setData({
        recordList: res
      })
      res.forEach(item => {
        if (item.status == 1) {
          orderArr.push(item)
          wx.showModal({
            title: '待支付订单',
            content: '您有' + orderArr.length + '笔待付款订单',
            cancelText: '稍后查看',
            confirmText: '查看详情',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../bill/bill?user_id=' + self.data.user_id + '&detailedAddress_id=' + self.data.detailedAddress_id + '&face_id=' + face_id,
                })
                // buy.buy(wx.getStorageSync('token'), self.data.order_id).then(res => {
                //   console.log('支付', res);
                //   wx.requestPayment({
                //     timeStamp: res.timeStamp,
                //     nonceStr: res.nonceStr,
                //     package: res.package,
                //     signType: 'MD5',
                //     paySign: res.paySign,
                //     success(res) {
                //       console.log(111, res);
                //       wx.showToast({
                //         icon: "none",
                //         title: '购买成功',
                //       });
                //     },
                //     fail(res) {
                //       console.log(222, res);
                //     }
                //   })
                // })
              } else if (res.cancel) {
                // buy.cancelBuy(wx.getStorageSync('token'), order_id).then(res => {
                //   console.log('取消支付', res);
                //   if (res == 1) {
                //     wx.showToast({
                //       icon: "none",
                //       title: '取消成功'
                //     });
                //   }
                // })
              }
            }
          })
        }
      })
    })
  },

  // 支付
  purchase() {
    var self = this;
    // 创建订单
    console.log(self.data.renter_type);
    wx.showModal({
      title: '支付提示',
      content: '您是否要为用户--(' + app.globalData.userName + '), 开通(' + serviceName + ')',
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在创建订单...',
          })
          buy.order(self.data.user_id, self.data.areas_id, self.data.product_id, self.data.detailedAddress_id, self.data.price, self.data.face_id).then(res => {
            console.log('createOeder', res);
            wx.hideLoading()
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
                    title: '购买成功',
                  });
                },
                fail(res) {
                  console.log(222, res);
                  wx.showToast({
                    icon: "none",
                    title: '取消成功',
                  });
                }
              })
            })
          })
        } else if (res.cancel) {
          wx.showToast({
            icon: "none",
            title: '取消成功',
            duration: 4000,
          })
        }
      }
    })

  },

  goodsChange(e) {
    console.log(e);
    var self = this;
    buy.buys(self.data.page, self.data.pageSize).then(res => {
      console.log('getGoodsList', res);
      self.setData({
        navIndex: e.detail.value,
        serviceList: res.data[e.detail.value].service,
        product_id: res.data[e.detail.value].id,
        price: res.data[e.detail.value].price
      })
    })
    serviceName = self.data.goodsList[e.detail.value].title
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