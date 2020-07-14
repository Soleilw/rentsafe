var user = require('../../../model/user');
var infomation = require('../../../model/personal/infomation');
var app = getApp();
var buy = require('../../../model/personal/buy')


Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxInfo: null,
        showHouse: false, // 只有户主才显示房屋管理
        typestring: '',
        address: '',
        userInfo: {},
        isExpire: false
    },

    onLoad: function (options) {
        this.setData({
            typestring: app.globalData.typestring,
            address: options.address
        })
        this.getRenew();
        // if(!wx.getStorageSync('token')) {
        //     wx.reLaunch({
        //       url: './change-user/change-user',
        //     })
        // }
    },
    onShow() {
        this.getPersonalInfo();
        this.setData({
            wxInfo: wx.getStorageSync('wxInfo'),
            typestring: this.data.typestring
        })
    },
    getPersonalInfo() {
        var self = this;
        if (wx.getStorageSync('token')) {
            if (!this.data.typestring) {
                wx.reLaunch({
                    url: '../index/change-user/change-user'
                })
            }
            // typeString为户主时才显示房屋管理
            if (this.data.typestring == "户主") {
                self.setData({
                    showHouse: true
                })
            }
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
                                wx.reLaunch({
                                    url: '../index/change-user/change-user'
                                })
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
            infomation.userInfo(wx.getStorageSync('token')).then(res => {
                if (res) {
                    wx.navigateTo({
                        url: '../index/change-user/change-user',
                    })
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '请先注册个人信息'
                    });
                }
            })
        }
    },

    // 跳转购买服务页面
    toBuy() {
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            wx.navigateTo({
                url: '../buy/buy/buy'
            })
        }
        // wx.navigateTo({
        //     url: '../buy/buy/buy'
        // })
    },

    // 续费提醒  
    getRenew() {
        var self = this;
        if (!wx.getStorageSync('token')) {
            self.setData({
                isExpire: false
            })
        } else {
            buy.renew(wx.getStorageSync('token')).then(res => {
                console.log('续费提示', res);
                if (res == 2) {
                    self.setData({
                        isExpire: true
                    })
                }
            })
        }
       
        // buy.userServes(wx.getStorageSync('token')).then(res => {
        //     console.log('获取开通的服务', res);
            
        // })
    },

    callPhone() {
        wx.makePhoneCall({
            phoneNumber: '110'
        })
    },

})