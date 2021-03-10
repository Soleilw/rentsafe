// pages/home/recruit/recruit.js
var infomation = require('../../../model/personal/infomation')
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
    address_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.address_id) {
      this.setData({
        address_id: options.address_id
      })
      this.getOwnList()
    } else {
      this.getList()
    }
  },

  toRentDetail(e) {
    console.log(e);

    var detail = e.currentTarget.dataset.detail
    if (this.data.address_id == '') {
      wx.navigateTo({
        url: './rent-detail/rent-detail?detail=' + JSON.stringify(detail),
      })
    }
  },

  getList(isPage) {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    infomation.issueList(self.data.page, 20).then(res => {
      console.log('列表', res);
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

  getOwnList(isPage) {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    infomation.issueUserList(self.data.page, 20, self.data.address_id).then(res => {
      console.log('列表', res);
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
      if (this.data.address_id != '') {
        this.getOwnList(true)
      } else {
        this.getList(true);
      }
    }
  },

  toDel(e) {
    console.log(e);
    var self = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该招租信息',
      cancelText: '取消',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          infomation.delIssue(e.target.dataset.id).then(res => {
            wx.showToast({
              title: '删除成功',
            })
            this.getOwnList()
          })
        } else if (res.cancel) {
          console.log('取消');
        }
      }
    })

  },

  toEdit(e) {
    console.log(e);
    var detail = e.currentTarget.dataset.detail
    wx.navigateTo({
      url: '../../personal/house/rent-mag/renting/renting?detail=' + JSON.stringify(detail),
    })
  },

})