// pages/personal/house/renter-pay/renter-pay.js
var infomation = require('../../../../model/personal/infomation')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payList: [],
    address_id: '',
    page: 1,
    isPage: false,
    showFoot: false,
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      address_id: options.detailedAddress_id
    });
    this.getPayList();
  },

  getPayList(isPage) {
    var self = this;
    wx.showLoading({
      title: '加载中...',
    })
    infomation.serverUser(self.data.address_id, self.data.page, 10).then(res => {
      console.log(res);
      if (isPage) {
        // 下一页的数据拼接在原有数据后面
        self.setData({
          payList: self.data.payList.concat(res.data)
        })
      } else {
        // 第一页数据直接赋值
        self.setData({
          payList: res.data
        })
      }
      // 如果返回的数据为空，那么就没有下一页了
      if (res.total <= (self.data.page * 10)) {
        self.setData({
          hasMore: false,
          showFoot: true
        })
      }
      wx.hideLoading()
    })
  },

  scrollToLower(e) {
    if (this.data.hasMore) {
      this.setData({
        page: this.data.page + 1
      })
      this.getPayList(true);
    }
  },

})