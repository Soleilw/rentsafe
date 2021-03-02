// pages/home/recruit/recruit.js
var recruitAPI = require('../../../model/home/recruit')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    page: 1,
    isPage: false,
    showFoot: false,
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  toRecruitDetail(e) {
    console.log(e);
    
    var detail = e.currentTarget.dataset.detail
    wx.navigateTo({
      url: '../recruit-detail/recruit-detail?detail=' + JSON.stringify(detail),
    })
  },

  getList(isPage) {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    recruitAPI.postList(self.data.page, 10, 2).then(res => {
      console.log('获取审核列表', res);
      if (isPage) {
        // 下一页的数据拼接在原有数据后面
        self.setData({
          listData: self.data.listData.concat(res.data)
        })
      } else {
        // 第一页数据直接赋值
        self.setData({
          listData: res.data
        })
      }
      // 如果返回的数据为空，那么就没有下一页了
      if (res.total == 0) {
        self.setData({
          hasMore: false,
          showFoot: true
        })
      }
      wx.hideLoading({})
    })
  },

  scrollToLower(e) {
    if (this.data.hasMore) {
        this.setData({
            page: this.data.page + 1
        })
        this.getList(true);
    }
},

})