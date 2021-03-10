// pages/home/rent-msg/rent-detail/rent-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    rent_intro: []
  },

  onLoad: function (options) {
    console.log(JSON.parse(options.detail));
    this.setData({
      detail: JSON.parse(options.detail),
      rent_intro: JSON.parse(options.detail).intro.split('\n')
    })
  },

  toPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.phone
    })
  },
})