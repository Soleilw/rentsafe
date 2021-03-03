var banner = require("../../model/home/banner")
var doc = require('../../model/home/document')
var areasId = require('../../model/home/userAreas')
var app = getApp();

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
    areas_id: null, // 社区id,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAreas();
    this.getBanner();
    this.getSelected();
    if (wx.getStorageSync('openFace') == 'open') {
      this.getDoc();
    }
  },
  onShow: function () {

  },

  // 获取用户社区
  getAreas() {
    var self = this;
    areasId.userAreas(wx.getStorageSync('token')).then(res => {
      console.log('getAreas', res);
      // 该用户存在社区
      self.setData({
        areasList: res,
      })
    })

  },

  // 选中社区
  areasChange(e) {
    console.log('areasChange', e.detail.value);
    var self = this;
    self.setData({
      areas_index: e.detail.value,
      areas: '',
    })
    // 用户登录了
    areasId.userAreas(wx.getStorageSync('token')).then(res => {
      console.log('getAreas', res);
      self.setData({
        areas_id: res[self.data.areas_index].id
      })
      // 该用户存在社区
      if (res.length > 0) {
        banner.banners(1, 100, self.data.areas_id).then(res => {
          console.log('banner', res.data);
          self.setData({
            banners: res.data
          })
        })
        doc.documentType(1, 100, self.data.areas_id).then(res => {
          console.log('doc', res);
          self.setData({
            classFication: res.data
          })
        })
        doc.documents(1, 100, self.data.areas_id).then(res => {
          console.log('111 getSelected', res);
          var list = [];
          for (let i = 0; i < res.data.length; i++) {
            console.log(res.data[i].is_show);
            if (res.data[i].is_show == 1) {
              list.push(res.data[i])
            }
          }
          self.setData({
            docList: list
          })
        })
      }
    })
  },

  // 获取轮播图
  getBanner() {
    var self = this;
    banner.banners(1, 100, 0).then(res => {
      console.log('banner', res.data);
      this.setData({
        banners: res.data
      })
    })
  },

  // 获取资讯
  getDoc() {
    var self = this;
    doc.documentType(1, 100, 0).then(res => {
      console.log('doc', res);
      this.setData({
        classFication: res.data
      })
    })
  },

  // 获取精选资讯
  getSelected() {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    doc.documents(1, 100, 0).then(res => {
      console.log('getSelected', res);
      var list = [];
      for (let i = 0; i < res.data.length; i++) {
        console.log(res.data[i].is_show);
        if (res.data[i].is_show == 1) {
          list.push(res.data[i])
        }
      }
      this.setData({
        docList: list
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },

  // 调转资讯页面
  openClassification(e) {
    var self = this;
    console.log(111, self.data.areas_id);
    wx.navigateTo({
      url: './socialInformation/socialInformation?class_id=' + e.currentTarget.dataset.id + '&areas_id=' + self.data.areas_id
    })
  },

  // 跳转详情页面
  openDetails(e) {
    wx.navigateTo({
      url: '../home/socialInformation/details/details?details_id=' + e.currentTarget.dataset.id,
    })
  },

  // 人才招聘
  toRecruit() {
    wx.navigateTo({
      url: './recruit/recruit',
    })
  },

})