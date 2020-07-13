// pages/home/socialInformation/socialInformation.js
var doc = require('../../../model/home/document')
var areasId = require('../../../model/home/userAreas')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docList: [],
    classFication: [],
    num: 0,
    class_id: null,
    areas_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      class_id: options.class_id,
      areas_id: options.areas_id
    })
    this.getDoc()
  },

  // 获取类型--nav
  getDoc() {
    var self = this;
    if (!wx.getStorageSync('token')) {
      doc.documentType(1, 100, 0).then(res => {
        self.setData({
          classFication: res.data
        })
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id == self.data.class_id) {
            self.setData({
              num: i
            })
          }
        }
        self.getDocuments()
      })
    } else {
      areasId.userAreas(wx.getStorageSync('token')).then(res => {
        console.log('nav res', res);
        doc.documentType(1, 100, self.data.areas_id).then(res => {
          console.log('nav doc', res);
          self.setData({
            classFication: res.data
          })
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].id == self.data.class_id) {
              self.setData({
                num: i
              })
            }
          }
          self.getDocuments()
        })
      })
    }
  },

  // nav点击事件
  nav(e) {
    console.log('nav', e.currentTarget.dataset.id);
    var self = this;
    self.setData({
      num: e.currentTarget.dataset.index
    })
 
      doc.documents(1, 100, self.data.areas_id, e.currentTarget.dataset.id).then(res => {
        console.log('getDocuments res', res);
        self.setData({
          docList: res.data,
        })
      })

  },

  // 获取资讯
  getDocuments() {
    var self = this;
    doc.documents(1, 100, self.data.areas_id, self.data.class_id).then(res => {
      console.log('getDocuments res', res);
      self.setData({
        docList: res.data,
      })
    })
  },

  // 跳转详情页面
  openDetails(e) {
    var self = this;
    console.log(e)
    wx.navigateTo({
      url: './details/details?details_id=' + e.currentTarget.dataset.id,
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