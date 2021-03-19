// pages/personal/house/renting/renting.js
const REG_PHONE = /^1[3-9]\d{9}$/;
// const REG_ID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
const qiniuUploader = require("../../../../../utils/qiniu");
var infomation = require('../../../../../model/personal/infomation')
var app = getApp()
var add = require('../../../../../model/personal/address')


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
    rentingInfo: {},
    address_id: '',
    id: '',
    proList: [], // 省级列表
    cityList: [], // 市级列表
    areaList: [], // 区级列表
    communityList: [], // 社区列表
    is_pro: '', // 选中省级
    is_city: '', // 选中市级
    is_area: '', // 选中区级
    is_community: '', // 选中社区
    is_detail: '', // 选中详细地址
    parent_id: 0, // 用于取地区值
    search_detail: '',
    detail: '',
    areas_id: '',
    province: '',
    city: '',
    area: '',
    community: '',
    floorList: [{
      label: '低',
      value: 1
    }, {
      label: '中',
      value: 2
    }, {
      label: '高',
      value: 3
    }],
    houseTypeList: [{
      label: '自建房',
      value: 1
    }, {
      label: '小区房',
      value: 2
    }, {
      label: '别墅',
      value: 3
    }],
    orientationList: [{
      label: '东',
      value: 1
    }, {
      label: '南',
      value: 2
    }, {
      label: '西',
      value: 3
    }, {
      label: '北',
      value: 4
    }],
    floorNum: '',
    is_floor: '',
    houseType: '',
    is_houseType: '',
    orientation: '',
    is_orientation: '',
    floor_type: '',
    house_type: '',
    orientation_type: '',
    address: '',
    latitude: '',
    longitude: '',
    payTypeList: [{
      label: '押一付一',
      value: 1
    }, {
      label: '押二付一',
      value: 2
    }, {
      label: '押一付三',
      value: 3
    }, {
      label: '面议',
      value: 4
    }],
    payType: '',
    is_payType: ''
  },

  onLoad: function (options) {
    this.getPro()

    if (options.detail) {
      console.log(JSON.parse(options.detail));

      this.setData({
        rentingInfo: JSON.parse(options.detail),
        pic: JSON.parse(options.detail).images,
        id: JSON.parse(options.detail).id,
        address_id: JSON.parse(options.detail).address_id,
        province: JSON.parse(options.detail).province.title,
        city: JSON.parse(options.detail).city.title,
        area: JSON.parse(options.detail).district.title,
        community: JSON.parse(options.detail).community.title,
        floor_type: JSON.parse(options.detail).floor_type,
        house_type: JSON.parse(options.detail).house_type,
        orientation_type: JSON.parse(options.detail).orientation,
        areas_id: JSON.parse(options.detail).areas_id,
        address: JSON.parse(options.detail).address,
        latitude: JSON.parse(options.detail).latitude,
        longitude: JSON.parse(options.detail).longitude,
        payType: JSON.parse(options.detail).pay_type,
      })

      switch (this.data.orientation_type) {
        case 1:
          this.setData({
            orientation: '东'
          })
          break;
        case 2:
          this.setData({
            orientation: '南'
          })
          break;
        case 3:
          this.setData({
            orientation: '西'
          })
          break;
        case 4:
          this.setData({
            orientation: '北'
          })
          break;
      }
      switch (this.data.floor_type) {
        case 1:
          this.setData({
            floorNum: '低'
          })
          break;
        case 2:
          this.setData({
            floorNum: '中'
          })
          break;
        case 3:
          this.setData({
            floorNum: '高'
          })
          break;
      }

      switch (this.data.house_type) {
        case 1:
          this.setData({
            houseType: '自建房'
          })
          break;
        case 2:
          this.setData({
            houseType: '小区房'
          })
          break;
        case 3:
          this.setData({
            houseType: '别墅'
          })
          break;
      }

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
    var phone = e.detail.value.phone;
    var price = e.detail.value.price;
    var title = e.detail.value.title;
    var proportion = e.detail.value.proportion;
    var floor = e.detail.value.floor;
    var house_type_text = e.detail.value.house_type_text;
    var pay_type = self.data.payType;
    console.log(self.data.pic);
    console.log(self.data.id);

    if (name && phone && address && intro && price && title && self.data.pic.length > 0) {
      wx.showLoading({
        title: '正在提交...',
      })
      if (self.data.id) {
        wx.request({
          url: 'https://chu.fengniaotuangou.cn/api/creation/message/issue',
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
            areas_id: self.data.areas_id,
            address_id: self.data.address_id,
            proportion: proportion,
            floor: floor,
            floor_type: self.data.floor_type,
            house_type: self.data.house_type,
            house_type_text: house_type_text,
            pay_type: pay_type,
            orientation: self.data.orientation_type,
            latitude: self.data.latitude,
            longitude: self.data.longitude,
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
          url: 'https://chu.fengniaotuangou.cn/api/creation/message/issue',
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
            areas_id: self.data.areas_id,
            address_id: self.data.address_id,
            proportion: proportion,
            floor: floor,
            floor_type: self.data.floor_type,
            house_type: self.data.house_type,
            house_type_text: house_type_text,
            pay_type: pay_type,
            orientation: self.data.orientation_type,
            latitude: self.data.latitude,
            longitude: self.data.longitude,
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
  },

  // 获取省级
  getPro() {
    var self = this;
    add.areas(1, 40000).then(res => {
      console.log('获取省级', res);

      self.setData({
        proList: res.data
      })
    })
  },

  // 选择省级
  proChange(e) {
    var self = this;
    console.log(e);

    self.setData({
      is_pro: e.detail.value,
      province: '',
      community: '',
      area: '',
      city: ''
    })
    self.data.parent_id = self.data.proList[self.data.is_pro].id;
    self.data.province = self.data.proList[self.data.is_pro].title;
    self.getCity(self.data.parent_id)
  },

  // 获取市级
  getCity(val) {
    var self = this;
    add.areas(1, 40000, val).then(res => {
      console.log('获取市级', res);
      self.setData({
        cityList: res.data
      })
    })
  },

  // 选择市级
  cityChange(e) {
    var self = this;
    self.setData({
      is_city: e.detail.value,
      city: ''
    })
    self.data.parent_id = self.data.cityList[self.data.is_city].id;
    self.data.city = self.data.cityList[self.data.is_city].title;
    self.getArea(self.data.parent_id)
    console.log(self.data.city);

  },

  // 获取区级
  getArea(val) {
    var self = this;
    add.areas(1, 40000, val).then(res => {
      console.log('获取区级', res);

      self.setData({
        areaList: res.data
      })
    })
  },

  areaChange(e) {
    var self = this;
    self.setData({
      is_area: e.detail.value,
      area: ''
    })
    self.data.parent_id = self.data.areaList[self.data.is_area].id;
    self.data.area = self.data.areaList[self.data.is_area].title;
    console.log(self.data.parent_id)
    self.getCommunity(self.data.parent_id)
  },

  // 获取社区地址
  getCommunity(val) {
    var self = this;
    add.areas(1, 40000, val).then(res => {
      self.setData({
        communityList: res.data
      })
    })
  },

  // 选择社区
  communityChange(e) {
    var self = this;
    self.data.is_community = e.detail.value;
    self.setData({
      is_community: e.detail.value,
      parent_id: self.data.communityList[self.data.is_community].id,
      areas_id: self.data.communityList[self.data.is_community].id,
      community: ''
    })
    self.data.community = self.data.communityList[self.data.is_community].title;
  },

  floorChange(e) {
    console.log(e);
    var self = this;

    self.setData({
      is_floor: e.detail.value,
      floorNum: ''
    })
    self.data.floor_type = self.data.floorList[self.data.is_floor].value;
    self.data.floorNum = self.data.floorList[self.data.is_floor].label;
  },
  houseTypeChange(e) {
    console.log(e);
    var self = this;

    self.setData({
      is_houseType: e.detail.value,
      houseType: ''
    })
    self.data.house_type = self.data.houseTypeList[self.data.is_houseType].value;
    self.data.houseType = self.data.houseTypeList[self.data.is_houseType].label;
  },
  orientationChange(e) {
    console.log(e);
    var self = this;

    self.setData({
      is_orientation: e.detail.value,
      orientation: ''
    })
    self.data.orientation_type = self.data.orientationList[self.data.is_orientation].value;
    self.data.orientation = self.data.orientationList[self.data.is_orientation].label;
  },

  // 点击图标选择地址
  map(e) {
    var self = this;
    console.log("开启地图")
    wx.chooseLocation({
      success(res) {
        console.log(res)
        self.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      fail: function (err) {
        console.log(123, err)
        wx.getSetting({
          success: (res) => {
            console.log(456, res)
            if (res.authSetting['scope.userLocation'] == false) {
              // self.display();
            }
          }
        })
      },
    })
    console.log("地图")
  },

  // 验证手机号
  regPhone(e) {
    var self = this;
    if (!REG_PHONE.test(e.detail.value)) {
      wx.showToast({
        icon: "none",
        title: '请输入正确的手机号',
      })
    }
  },

  payTypeChange(e) {
    var self = this;
    self.setData({
      is_payType: e.detail.value,
      payType: ''
    })
    // self.data.is_payType = self.data.payTypeList[self.data.is_payType].value;
    self.data.payType = self.data.payTypeList[self.data.is_payType].label;
  },

})