App({
  onShow: function () {
    // this.getUserInfo();
    var global = require('./model/global');
    var imfomation = require('./model/personal/infomation')
    var self = this;
    // 获取用户信息
    if (wx.getStorageSync('token')) {
      imfomation.userInfo(wx.getStorageSync('token')).then(res => {
        if (res) {
          wx.reLaunch({
            url: "pages/personal/index/change-user/change-user"
          })
        }
      })
    }
    // 开关配置
    var version = '1.0.4';
    global.configs(version).then(res => {
      wx.setStorageSync('openFace', res.config_value);
    })
  },
  onLaunch: function () {
    let self = this;
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    };
  },

  // 获取用户信息
  // getUserInfo() {
  //   if(wx.getStorageSync('token')) {
  //     imfomation.userInfo(wx.getStorageSync('token')).then(res => {
  //       if(res) {
  //         wx.reLaunch({
  //           url: "pages/personal/index/change-user/change-user"
  //         })
  //       }
  //     })
  //   }
  // },


  globalData: {
    userInfo: null,
    openFace: false
  }
})