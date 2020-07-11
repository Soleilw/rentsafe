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
    areas_id: null // 社区id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getBanner();
    // this.getDoc();
    // this.getSelected();
    this.getAreas();
    // this.setData({
    //   areas_id: 0
    // })
  },

  // 获取用户社区
  getAreas() {
    var self = this;
    // 用户未登录时
    if (!wx.getStorageSync('token')) {
      self.getBanner();
      self.getDoc();
      self.getSelected();
    } else {
      // 用户登录了
      areasId.userAreas(wx.getStorageSync('token')).then(res => {
        console.log('getAreas', res);
        self.setData({
          areasList: res,
          areas: res[0].title,
          areas_id: res[0].id
        })
        // 该用户存在社区
        if (res.length > 0) {
          banner.banners(1, 100, res[0].id).then(res => {
            console.log('banner', res.data);
            self.setData({
              banners: res.data
            })
          })
          doc.documentType(1, 100, res[0].id).then(res => {
            console.log('doc', res);
            self.setData({
              classFication: res.data
            })
          })
          doc.documents(1, 100, res[0].id).then(res => {
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
        } else {
          self.getBanner();
          self.getDoc();
          self.getSelected();
        }
      })
    }

  },

  // 选中社区
  areasChange(e) {
    console.log('areasChange', e.detail.value);
    var self = this;
    self.setData({
      areas_index: e.detail.value,
      areas: ''
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
    var self = this;
    console.log(111,self.data.areas_id);
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

})