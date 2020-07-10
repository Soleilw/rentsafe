var banner = require("../../model/home/banner")
var doc = require('../../model/home/document')
var areasId = require('../../model/home/userAreas')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    classFication: [],
    docList: [],
    showTips: false,
    areasList: [],
    areas_index: '', // 下标
    areas: '',
    areas_id: '' // 社区id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBanner();
    this.getDoc();
    this.getSelected();
    this.getAreas();
    this.setData({
      areas_id: 0
    })
  },

  // 获取用户社区
  getAreas() {
    var self = this;
    areasId.userAreas(wx.getStorageSync('token')).then(res => {
      console.log('getAreas', res);
      self.setData({
        areasList: res,
        areas: res[0].title,
      })
    })
  },

  areasChange(e) {
    console.log('areasChange', e.detail.value);
    var self = this;
    self.setData({
      areas_index: e.detail.value,
      areas: '',
    })

  },

  // 获取轮播图
  getBanner() {
    var self = this;
    
    banner.banners(1, 100, 0).then(res => {
      console.log('banner', res.data);
      self.setData({
        banners: res.data
      })
    })
  },

  // 获取资讯
  getDoc() {
    var self = this;
    doc.documentType(1, 100, 0).then(res => {
      console.log('doc', res);
      self.setData({
        classFication: res.data
      })
    })
  },

  // 获取精选资讯
  getSelected() {
    var self = this;
    doc.documents(1, 100, 0).then(res => {
      console.log('getSelected', res);
      for (let i = 0; i < res.data.length; i++) {
        console.log(res.data[i].is_show);
        if (res.data[i].is_show == 1) {
          self.setData({
            docList: res.data
          })
        }
      }
      
    })
  },

  // 调转资讯页面
  openClassification(e) {
    console.log('e', e.currentTarget.dataset.id);
    wx.navigateTo({
      url: './socialInformation/socialInformation?type=' + e.currentTarget.dataset.id
    })
  },

  // 跳转详情页面
  openDetails(e) {
    wx.navigateTo({
      url: '../home/socialInformation/details/details?details_id=' + e.currentTarget.dataset.id,
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