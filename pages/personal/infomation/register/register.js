const REG_ID = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
var infomation = require('../../../../model/personal/infomation');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            type: '',
            address_id: '',
            address: '',
            room_id: ''
        },
        id_card_select: '', // 身份类型选择
        identityList: [{ // 身份类型列表
                'name': '户主',
                'type': 1
            }, {
                'name': '租客',
                'type': 2
            },
            // {
            //     'name': '家庭成员',
            //     'type': 3
            // }, 
            {
                'name': '物业',
                'type': 4
            }
        ],
        typeString: '',
        disabled: false,
        showSubmit: true,
        isSucceed: true,
        status: null,
        id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options)
        var address = 'userInfo.address';
        var address_id = 'userInfo.address_id';
        var room_id = 'userInfo.room_id';
        this.setData({
            status: options.status,
            id: options.id
        })
        // this.setData({
        //     [address]: options.address,
        //     typeString: options.typestring,
        //     area_id: options.area_id,
        //     addresses_id: options.address_id,
        //     detailedAddress_id: options.detailedAddress_id
        // });
        // 查看身份
        if (options.typestring && options.address) {
            this.setData({
                disabled: true,
                showSubmit: false
            });
        }
    },

    onShow() {
        console.log(this.data.disabled)
        console.log(this.data.showSubmit)

    },
    // 查看授权信息
    checkAuth() {
        var self = this;
        wx.getSetting({
            withSubscriptions: true,
            success: (res) => {
                console.log(1, res);
                if (res.subscriptionsSetting.mainSwitch) {
                    // 用户点击了总是保持选择的状态
                    if (res.subscriptionsSetting.itemSettings) {
                        var modelCode = JSON.stringify(res.subscriptionsSetting.itemSettings)
                        var acceptModelCode = JSON.stringify({
                            '13BA3nJik4w0shVkmMnLyM01x3hQ6ZbN3wr9iJR-lpM': "accept"
                        })
                        var rejectModelCode = JSON.stringify({
                            '13BA3nJik4w0shVkmMnLyM01x3hQ6ZbN3wr9iJR-lpM': "reject"
                        })
                        if (modelCode == acceptModelCode) {
                            wx.showToast({
                                title: '您已授权接收审核结果通知的订阅消息',
                                icon: 'none',
                                duration: 4000,
                                success: function () {
                                    setTimeout(function () {
                                        wx.reLaunch({
                                            url: "/pages/personal/index/change-user/change-user"
                                        })
                                    }, 5000)
                                }
                            })
                        }
                        if (modelCode == rejectModelCode) {
                            wx.showToast({
                                title: '您已拒绝接收审核结果通知的订阅消息,请在小程序右上角的三个点，进入设置进行接收授权',
                                icon: 'none',
                                duration: 4000,

                                success: function () {
                                    setTimeout(function () {
                                        wx.reLaunch({
                                            url: "/pages/personal/index/change-user/change-user"
                                        })
                                    }, 5000)
                                }
                            })
                        }
                    } else {
                        self.setData({
                            isSucceed: false
                        })
                    }
                } else {
                    wx.showModal({
                        title: '授权订阅消息',
                        content: '您未打开设置中的订阅消息开关,请在小程序右上角的三个点，进入设置进行开启',
                        cancelText: '取消',
                        confirmText: '开启',
                        success: (res) => {
                            console.log(2, res);
                            if (res.confirm) {
                                wx.openSetting({
                                    withSubscriptions: true
                                })
                            } else if (res.cancel) {
                                wx.showToast({
                                    icon: "none",
                                    title: '您未打开设置中的订阅消息开关,请在小程序右上角的三个点，进入设置进行开启',
                                    duration: 4000,
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    presentInfomation(e) {
        var self = this;
        console.log('presentInfomation', e);
        var type = self.data.userInfo.type;
        // var address = e.detail.value.address;
        var address = self.data.userInfo.address;
        var address_id = self.data.userInfo.address_id;
        var room_id = self.data.userInfo.room_id ? self.data.userInfo.room_id : 0;
        var token = wx.getStorageSync('token');
        var id = self.data.id
        if (!self.data.userInfo.type && !self.data.userInfo.address) {
            wx.showToast({
                icon: "none",
                title: '请填写完整信息'
            });
        } else {
            if (self.data.identityList[self.data.id_card_select].name && self.data.userInfo.address) {
                    infomation.user(token, type, address_id, address, room_id).then(res => {
                        console.log(res);
                        if (type == 1) {
                            self.setData({
                                disabled: true
                            })
                            wx.showLoading({
                                title: '提交中',
                                icon: "loading",
                                success: () => {
                                    wx.hideLoading();
                                    wx.showToast({
                                        icon: "none",
                                        title: '提交成功,请等待审核',
                                        success() {
                                            setTimeout(function () {
                                                self.checkAuth();
                                            }, 1000);
                                        }
                                    });
                                }
                            })
    
                        } else {
                            self.setData({
                                disabled: true
                            })
                            wx.showLoading({
                                title: '提交中',
                                icon: "loading",
                                success: () => {
                                    wx.hideLoading();
                                    wx.showToast({
                                        icon: "none",
                                        title: '提交成功,请等待户主审核',
                                        success() {
                                            setTimeout(function () {
                                                self.checkAuth();
                                            }, 1000);
                                        }
                                    });
                                }
                            })
    
                        }
                    })
            
            } else {
                wx.showToast({
                    icon: "none",
                    title: '请填写完整信息'
                });
            }
        }
    },

    subInfo(e) {
        var self = this;
        console.log('subInfo', e);
        var templateId = '13BA3nJik4w0shVkmMnLyM01x3hQ6ZbN3wr9iJR-lpM';
        wx.requestSubscribeMessage({
            tmplIds: [templateId],
            success(res) {
                if (res[templateId] == 'accept') {
                    //用户同意了订阅，允许订阅消息
                    wx.showToast({
                        title: '订阅成功',
                        success() {
                            setTimeout(() => {
                                wx.reLaunch({
                                    url: "/pages/personal/index/change-user/change-user"
                                })
                            }, 1000);
                        }
                    })
                } else {
                    //用户拒绝了订阅，禁用订阅消息
                    wx.showToast({
                        title: '订阅失败',
                        icon: 'none',
                        success() {
                            setTimeout(() => {
                                wx.reLaunch({
                                    url: "/pages/personal/index/change-user/change-user"
                                })
                            }, 1000);
                        }
                    })
                }
            },
            fail(res) {
                console.log(res)
            },
            complete(res) {
                console.log(res)
            }
        })
    },

    // 验证身份证号
    regIdentity(e) {
        var self = this;
        if (!REG_ID.test(e.detail.value)) {
            wx.showToast({
                icon: "none",
                title: '请输入有效的身份证号码',
            })
        }
    },

    bindIdentityChange(e) {
        var self = this;
        var typeString = 'userInfo.typeString';
        var type = 'userInfo.type';
        var address = 'userInfo.address';
        self.setData({
            id_card_select: e.detail.value,
            // showSubmit: true,
            [type]: self.data.identityList[e.detail.value].type,
            [typeString]: self.data.identityList[e.detail.value].name,
            [address]: ''
        })
    },


    toChooseAddress() {
        if (this.data.disabled == false) {
            wx.navigateTo({
                url: '../address/address?type=' + this.data.userInfo.type
            })
        }

        // this.setData({
        //     showSubmit: true
        // })
    },

    toIndex() {
        app.globalData.typestring = this.data.typeString;
        app.globalData.area_id = this.data.area_id
        app.globalData.address_id = this.data.addresses_id
        app.globalData.detailedAddress_id = this.data.detailedAddress_id
        console.log('app.globalData.area_id', app.globalData.area_id);
        console.log('app.globalData.address_id', app.globalData.address_id);
        console.log('app.globalData.detailedAddress_id', app.globalData.detailedAddress_id);

        wx.switchTab({
            url: '/pages/personal/index/index'
        })
    },

    toIden() {
        wx.navigateTo({
            url: '../register/register'
        })
    }
})