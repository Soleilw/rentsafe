// pages/home/rent-msg/rent-detail/rent-detail.js
var infomation = require('../../../../model/personal/infomation')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    rent_intro: [],
    latitude: '',
    longitude: '',
    markers: [],
    id: ''
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id
    })
    this.getDetail()
  },

  getDetail() {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    infomation.msgDetail(self.data.id).then(res => {
      console.log(res);
      self.setData({
        detail: res,
        latitude: res.latitude,
        longitude: res.longitude
      })
      let markersArray = [{
        iconPath: "../../../../icon/address.png",
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        width: 30,
        height: 30,
        // title: '广州市图巴诺信息科技有限公司',
        anchor: {
          x: .5,
          y: 1
        },
        alpha: 1
      }];
      this.setData({
        markers: markersArray,
      })
      wx.hideLoading()
    })
  },

  toPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.phone
    })
  },

  map() {
    var self = this;
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        console.log(res);
        wx.chooseLocation({
          success(res) {
            wx.openLocation({ //​使用微信内置地图查看位置。
              latitude: res.latitude, //要去的纬度-地址
              longitude: res.longitude, //要去的经度-地址
              name: res.name,
              address: res.address
            })
          },
        })
      }
    })
  },
  // 复制
  copyAdd: function () {
    let self = this;
    console.log(self.data.password);
    var address = self.data.detail.address
    wx.setClipboardData({
      data: JSON.stringify(address), //只能复制字符串
      success(res) {
        console.log(res)
      }
    })
  },

  // 分享
  onShareAppMessage: (e) => {
    return {
      title: '安域智慧安防',
      path: 'pages/home/rent-msg/rent-detail/rent-detail?id=' + self.data.id,
    }
  }
})