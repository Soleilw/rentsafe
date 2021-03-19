// pages/home/recruit/recruit.js
var infomation = require('../../../model/personal/infomation')
var add = require('../../../model/personal/address')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    page: 1,
    total: 0,
    showFoot: false,
    hasMore: true,
    isPage: false,
    address_id: '',
    num: 0,
    classFication: [{
      title: '户型',
      index: 0
    }, {
      title: '租金',
      index: 1
    }, {
      title: '地区',
      index: 2
    }],
    houseTypeList: [{
      label: '全部',
      value: 0
    }, {
      label: '自建房',
      value: 1
    }, {
      label: '小区房',
      value: 2
    }, {
      label: '别墅',
      value: 3
    }],
    rentList: [{
        label: '0 - 1000'
      },
      {
        label: '1000 - 2000'
      },
      {
        label: '2000 - 3000'
      },
      {
        label: '3000 - 4000'
      },
      {
        label: '4000 - 5000'
      },
      {
        label: '5000以上'
      },
    ],
    animationData: {}, // 动画
    hideModal: true, //模态框的状态  true-隐藏  false-显示
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
    province: '',
    city: '',
    area: '',
    community: '',
    type: '',
    areas_id: '',
    min_price: '',
    max_price: '',
  },

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
    this.getPro()
  },

  toRentDetail(e) {
    console.log(e);

    // var detail = e.currentTarget.dataset.detail
    if (this.data.address_id == '') {
      wx.navigateTo({
        url: './rent-detail/rent-detail?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  getList() {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    infomation.issueList(self.data.page, 10, 2, self.data.type, self.data.areas_id, self.data.min_price, self.data.max_price).then(res => {
      console.log('列表', res);
      console.log('列表', res.data.length);
      // if (isPage) {
      // 下一页的数据拼接在原有数据后面
      self.setData({
        listData: self.data.listData.concat(res.data)
      })
      // } else {
      //   // 第一页数据直接赋值
      //   self.setData({
      //     listData: res.data
      //   })
      // }
      // 如果返回的数据为空，那么就没有下一页了
      if (res.data.length == 0) {
        self.setData({
          hasMore: false,
          showFoot: true
        })
      }
      wx.hideLoading({})
    })
  },

  onReachBottom() {
    console.log('上拉')
    var self = this;
    var page = self.data.page + 1; //获取当前页数并+1
    self.setData({
      page: page, //更新当前页数
    })
    if (!self.data.showFoot) {
      if (self.data.address_id) {
        self.getOwnList()
      }
      self.getList(); //重新调用请求获取下一页数据
    }
  },

  getOwnList() {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    infomation.issueUserList(self.data.page, 10, self.data.address_id).then(res => {
      console.log('列表', res);
      self.setData({
        listData: self.data.listData.concat(res.data)
      })
      if (res.data.length == 0) {
        self.setData({
          hasMore: false,
          showFoot: true
        })
      }
      wx.hideLoading({})
    })
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
            self.setData({
              listData: [],
              page: 1
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

  houseTypeChange(e) {
    console.log(e);
    var self = this;
    var type, index;
    index = e.detail.value;
    self.setData({
      type: self.data.houseTypeList[index].value,
      page: 1,
      listData: []
    })
    wx.showLoading({
      title: '数据加载中...',
    })
    self.setData({
      showFoot: false
    })
    self.getList()
  },
  rentChange(e) {
    console.log(e);
    var self = this;
    var arr = [];
    self.setData({
      showFoot: false,
      page: 1,
      listData: []
    })
    switch (e.detail.value) {
      case '0':
        self.setData({
          min_price: 0,
          max_price: 1000
        })
        break;
      case '1':
        self.setData({
          min_price: 1000,
          max_price: 2000
        })
        break;
      case '2':
        self.setData({
          min_price: 2000,
          max_price: 3000
        })
        break;
      case '3':
        self.setData({
          min_price: 3000,
          max_price: 4000
        })
        break;
      case '4':
        self.setData({
          min_price: 4000,
          max_price: 5000
        })
        break;
      case '5':
        self.setData({
          min_price: 5000,
          max_price: 5000000
        })
        break;
    }
    self.getList()
  },

  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 200)
  },
  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true,
      })
    }, 720) //先执行下滑动画，再隐藏模块

  },
  // 动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
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
    self.setData({
      is_pro: e.detail.value,
      province: ''
    })
    self.data.parent_id = self.data.proList[self.data.is_pro].id;
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
      is_city: e.detail.value
    })
    self.data.parent_id = self.data.cityList[self.data.is_city].id;
    self.getArea(self.data.parent_id)
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
      is_area: e.detail.value
    })
    self.data.parent_id = self.data.areaList[self.data.is_area].id;
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
      areas_id: self.data.communityList[self.data.is_community].id
    })
  },

  // 按地区筛选
  toArea() {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    self.setData({
      page: 1,
      listData: []
    })
    if (self.data.areas_id) {
      self.getList();
      self.setData({
        cityList: [], // 市级列表
        areaList: [], // 区级列表
        communityList: [], // 社区列表
        is_pro: '', // 选中省级
        is_city: '', // 选中市级
        is_area: '', // 选中区级
        is_community: '', // 选中社区
        is_detail: '', // 选中详细地址
        parent_id: 0, // 用于取地区值
        province: '',
        city: '',
        area: '',
        community: '',
        showFoot: false,
        hideModal: true,
        areas_id: ''
      })
    } else {
      wx.showToast({
        title: '请选择社区',
        icon: 'none'
      })
    }

  },

  // 重置
  toReset() {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    self.setData({
      showFoot: false
    })
    self.setData({
      page: 1,
      type: '',
      areas_id: '',
      max_price: '',
      min_price: '',
      listData: []

    })
    self.getList()
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

})