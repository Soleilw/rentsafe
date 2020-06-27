var user = require('../../../model/user');
var infomation = require('../../../model/personal/infomation');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxInfo: null,
        showHouse: false, // 只有户主才显示房屋管理
    },
   
    onLoad: function (options) {
        // if(!wx.getStorageSync('token')) {
        //     wx.reLaunch({
        //       url: './change-user/change-user',
        //     })
        // }
    },
    onShow() {
        this.getPersonalInfo();
        this.setData({
            wxInfo: wx.getStorageSync('wxInfo')
        })
    },
    getPersonalInfo() {
        var self = this;
        if(wx.getStorageSync('token')) {
            infomation.idenInfo(wx.getStorageSync('token')).then(res => {
                console.log(res)
                res.data.forEach(item => {
                    if(item.type === 1 && item.state === 2) {
                        self.setData({
                            showHouse: true
                        })
                    }
                })
            })
        } 
    },

    getUserInfo(e) {
        var self = this;
        wx.login({
            success(res) {
                var code = res.code;
                if (code) {
                    wx.getUserInfo({
                        success: (res) => {
                            console.log(code)
                            console.log(res.iv)
                            console.log(res.encryptedData)

                            user.login(code, res.iv, res.encryptedData).then(res => {
                                wx.setStorage({
                                    data: res.token,
                                    key: 'token',
                                })
                                // 全局
                                var wxInfo = {
                                    avatarUrl: res.info.avatarUrl,
                                    nickName: res.info.nickName
                                };
                                wx.setStorageSync('wxInfo', wxInfo)
                                self.setData({
                                    wxInfo: wxInfo
                                });
                                self.getPersonalInfo();

                            })
                        }
                    })
                }
            }
        });
    },

    // 去个人信息
    toInfomation() {
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            })
            wx.removeStorageSync('wxInfo')
        } else {
            wx.navigateTo({
                url: '../infomation/infomation/infomation'
            })
        }
    },
    // 去房屋管理
    toHouse() {
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            wx.navigateTo({
                url: '../house/house/house'
            })
        }
    },

     // 切换账号
     toRegister() {
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            wx.navigateTo({
                url: './change-user/change-user',
              })
        }
       
    },

    callPhone() {
        wx.makePhoneCall({
            phoneNumber: '110'
        })
    },

})