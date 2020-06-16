Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname: '',
      name: 'soleil',
      sex: 1,
      id_card: '',
      phone: '123456',
      address: ''
    },
    identityList: [{
        'name': '物业管理',
        'type': 1
      }, {
        'name': '户主',
        'type': 2
      }, {
        'name': '家庭成员',
        'type': 3
      }, {
        'name': '租客',
        'type': 4
      }], // 身份类型列表
    showCamera: false, // 显示相机
    cameraConfig: {
      position: 'front',
      flash: 'off'
    }
  },

  onLoad(options) {
    var address = 'userInfo.address';
    this.setData({
        [address]: options.address
    })
   
  },

  onShow() {
    
  },

  toChooseAddress() {
      wx.navigateTo({
        url: './address.wxml'
      })
  }

})

