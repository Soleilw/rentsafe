var user = require('../../../model/user');
var infomation = require('../../../model/personal/infomation');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxInfo: null,
        showHouse: false, // 只有户主才显示房屋管理
        typestring: '',
        address: '',
        userInfo: {}
    },

    onLoad: function (options) {
        this.setData({
            typestring: options.typestring,
            address: options.address
        })
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


        // if(wx.getStorageSync('token')) {
        //     infomation.idenInfo(wx.getStorageSync('token')).then(res => {
        //         for(var i = 0; i < res.data.length; i++) {
        //             if(res.data[i].type == 1 && res.data[i].state == 2) {
        //                 self.setData({
        //                     showHouse: true
        //                 })
        //                 break;
        //             }
        //         }
        //     })
        // } 
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

    callPhone() {
        wx.makePhoneCall({
            phoneNumber: '110'
        })
    },

})