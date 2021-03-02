// pages/home/recruit-detail/recruit-detail.js
var WxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    worker_intro: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detail: JSON.parse(options.detail),
      worker_intro: JSON.parse(options.detail).work_intro.split('\n')
    })
    console.log(this.data.detail);
    
  },
})