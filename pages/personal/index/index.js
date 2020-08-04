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
        area_id: '',
        // address_id: '',
        userInfo: {},
        // isExpire: false, // 续费提醒
        // isRenew: false,
        hasBuyList: [], // 已经购买的服务
        showBuy: false, // 显示购买服务功能--只有租客身份
        house_owner: [], // 用户身份列表
        show: false, // 只有租客身份时显示
        detailedAddress_id: null
    },

    onLoad: function (options) {
        console.log('options', options);

        this.setData({
            typestring: app.globalData.typestring,
            area_id: app.globalData.area_id,
            // address_id: app.globalData.address_id,
            address: options.address,
            detailedAddress_id: app.globalData.detailedAddress_id
        })
        console.log(this.data.typestring);
        
    },
    onShow() {
        this.getPersonalInfo();
        // isBuy为true时才调用this.getIdenInfo()
        if (app.globalData.isBuy == 'true') {
            this.getIdenInfo();
        }
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
            // typeString为户主/物业时才显示房屋管理
            if (this.data.typestring == "户主" || this.data.typestring == "物业") {
                self.setData({
                    showHouse: true
                })
            }
        }
    },
    loginout() {
        var self = this;
        app.globalData.typestring = null;
        wx.reLaunch({
            url: "/pages/personal/index/change-user/change-user"
        })
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
        var self = this
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            console.log('房屋管理', self.data.detailedAddress_id);
            console.log('房屋管理', self.data.typestring);

            wx.navigateTo({
                url: '../house/house/house?detailedAddress_id=' + self.data.detailedAddress_id + '&typestring=' + self.data.typestring
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
        var self = this;
        console.log('跳转购买服务页面', self.data.area_id);
        console.log('跳转购买服务页面', self.data.detailedAddress_id);

        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
        } else {
            wx.navigateTo({
                url: '../buy/buy/buy?area_id=' + self.data.area_id + '&detailedAddress_id=' + self.data.detailedAddress_id
            })
        }
    },

    // 获取用户身份
    getIdenInfo() {
        var self = this;
        if (wx.getStorageSync('token')) {
            infomation.idenInfo(wx.getStorageSync('token'), 1, 10000).then(res => {
                if (res.data.length > 0) {
                    console.log('getIdenInfo', res.data);
                    res.data.forEach(item => {
                        // console.log(item.type);
                        self.data.house_owner.push(item.type);
                    })
                    // console.log(self.data.house_owner);
                    if (!self.data.house_owner.includes(1) && !self.data.house_owner.includes(4)) {
                        console.log('只存在租客身份');
                        self.setData({
                            show: true,
                            showBuy: true
                        })
                        // 续费提醒
                        buy.userServes(wx.getStorageSync('token'), self.data.detailedAddress_id).then(res => {
                            console.log('获取开通的服务', res);
                            self.setData({
                                hasBuyList: res
                            })
                            // 没有购买了服务
                            if (res.length == 0) {
                                // 给用户自行选择
                                wx.showModal({
                                    title: '开通服务提示',
                                    content: '您未开通服务,无法刷脸进出,请先开通服务',
                                    cancelText: '稍后开通',
                                    confirmText: '开通',
                                    success: function (res) {
                                        if (res.confirm) {
                                            wx.navigateTo({
                                                url: '../buy/buy/buy?area_id=' + self.data.area_id + '&detailedAddress_id=' + self.data.detailedAddress_id
                                            })
                                        } else if (res.cancel) {
                                            wx.showToast({
                                                icon: "none",
                                                title: '未开通服务无法刷脸进出，可点击物业管理栏的购买服务进行服务开通',
                                                duration: 4000,
                                            })
                                        }
                                    }
                                })

                                // wx.showToast({
                                //     icon: "none",
                                //     title: '没有开通服务,无法刷脸进出,请先购买服务',
                                //     duration: 3000,
                                //     success() {
                                //         setTimeout(function () {
                                //             wx.navigateTo({
                                //                 url: '../buy/buy/buy?area_id=' + self.data.area_id + '&detailedAddress_id=' + self.data.detailedAddress_id
                                //             })
                                //         }, 3000);
                                //     }
                                // });
                            }
                        })
                    }
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '您还未添加身份，无法使用部分功能，请先添加身份',
                        duration: 4000,
                    })
                }

            })
        } else {
            self.setData({
                show: true,
                showBuy: true
            })
        }
    },


    callPhone() {
        wx.makePhoneCall({
            phoneNumber: '110'
        })
    },

})