// pages/personal/house/renting/renting.js
const REG_PHONE = /^1[3-9]\d{9}$/;
// const REG_ID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
const qiniuUploader = require("../../../../../utils/qiniu");
var infomation = require('../../../../../model/personal/infomation')
var app = getApp()

function getQiniuToken() {
  var options = {
    region: 'SCN',
    uptoken: '',
    uptokenURL: 'https://api.fengniaotuangou.cn/api/upload/token',
    uptokenFunc: function () {},
    domain: 'https://tu.fengniaotuangou.cn',
    shouldUseQiniuFileName: false
  };
  qiniuUploader.init(options);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pic: [],
    // imgUrl: [],
    rentingInfo: {
      on_shelf: 1,
    },
    address_id: '',
    id: ''
  },

  onLoad: function (options) {


    if (options.detail) {
      
      this.setData({
        rentingInfo: JSON.parse(options.detail),
        pic: JSON.parse(options.detail).images,
        id: JSON.parse(options.detail).id,
        address_id: JSON.parse(options.detail).address_id
      })
      console.log(111, this.data.address_id);

    } else {
      
      this.setData({
        address_id: options.address_id,
      })
      console.log(222, this.data.address_id);

    }

    wx.showModal({
      title: '提示',
      content: '当前功能为免费体验期',
      confirmText: '我知道了',
      showCancel: false,
      success(res) {}
    })
  },

  // 上传图片
  bindUpload(e) {
    var self = this;
    console.log(e);
    getQiniuToken()
    var picLength = self.data.pic.length;
    var count = 9 - picLength;
    if (count != 0) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: function (res) {
          console.log('success', res);
          wx.showToast({
            title: '上传中...',
            icon: 'loading',
            duration: 1000
          });
          qiniuUploader.upload(res.tempFilePaths.toString(), res => {
            wx.hideToast();
            self.data.pic.push(res.fileURL);
            self.setData({
              pic: self.data.pic
            });
          }, error => {
            wx.showModal({
              title: '错误提示',
              content: '上传失败！',
              showCancel: false,
              success: function (res) {}
            })
          })
          // wx.showLoading({
          //   title: '上传中...',
          // })
          // const tempFilePaths = res.tempFilePaths;
          // tempFilePaths.map(function (item, index) {
          //   self.data.pic.push(tempFilePaths[index]);
          // })

        },
        fail: function (res) {
          console.log('fail', res);
        }
      })
    } else {
      wx.showToast({
        title: '最多上传9张照片',
        icon: "none"
      })
    }
  },

  // 删除图片
  bindDeleteImg(e) {
    var imgIndex = e.currentTarget.dataset.index;
    var self = this;
    self.data.pic.map(function (item, index) {
      if (imgIndex == index) {
        self.data.pic.splice(index, 1);
        self.setData({
          pic: self.data.pic
        })
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
      }
    })
    // self.data.imgUrl.map(function (item, index) {
    //   if (imgIndex == index) {
    //     self.data.imgUrl.splice(index, 1);
    //     self.setData({
    //       imgUrl: self.data.imgUrl
    //     })
    //   }
    // })
  },

  // 发布
  toIssue(e) {
    console.log(e);
    var self = this;
    var name = e.detail.value.name;
    var address = e.detail.value.address;
    var intro = e.detail.value.intro;
    var on_shelf = e.detail.value.on_shelf;
    var phone = e.detail.value.phone;
    var price = e.detail.value.price;
    var title = e.detail.value.title;
    console.log(self.data.pic);
    console.log(self.data.id);

    if (name && phone && address && intro && price && title && self.data.pic.length > 0) {
      wx.showLoading({
        title: '正在提交...',
      })
      if (self.data.id) {
        wx.request({
          url: 'http://192.168.0.110/api/creation/message/issue',
          method: 'post',
          data: {
            token: wx.getStorageSync('token'),
            name: name,
            phone: phone,
            title: title,
            intro: intro,
            images: self.data.pic,
            address: address,
            price: price,
            on_shelf: on_shelf,
            address_id: self.data.address_id,
            id: self.data.id
          },
          success: (res) => {
            wx.hideLoading()
            console.log(res);

            if (res.data.msg == 'ok') {
              wx.navigateBack({
                delta: 2,
              })
            } else {
              wx.showToast({
                title: res.data.toast,
                icon: 'none'
              })
            }
          }
        })
      } else {
        wx.request({
          url: 'http://192.168.0.110/api/creation/message/issue',
          method: 'post',
          data: {
            token: wx.getStorageSync('token'),
            name: name,
            phone: phone,
            title: title,
            intro: intro,
            images: self.data.pic,
            address: address,
            price: price,
            on_shelf: on_shelf,
            address_id: self.data.address_id,
          },
          success: (res) => {
            wx.hideLoading()
            console.log(res);

            if (res.data.msg == 'ok') {
              wx.navigateBack({
                delta: 1,
              })
            } else {
              wx.showToast({
                title: res.toast,
                icon: 'none'
              })
            }
          }
        })
      }

    } else {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
    }
  }

})