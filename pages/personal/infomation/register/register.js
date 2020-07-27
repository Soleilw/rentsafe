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
        showSubmit: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options)
        var address = 'userInfo.address';
        var address_id = 'userInfo.address_id';
        var room_id = 'userInfo.room_id';

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
    subInfomation(e) {
        var self = this;
        if (!self.data.userInfo.type && !self.data.userInfo.address) {
            wx.showToast({
                icon: "none",
                title: '请填写完整信息'
            });
        } else {
            if (self.data.identityList[self.data.id_card_select].name && self.data.userInfo.address) {
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
                                        self.subInfo(e);
                                    }, 1000);
                                }
                            })
                        } else {
                            //用户拒绝了订阅，禁用订阅消息
                            wx.showToast({
                                title: '订阅失败',
                                success() {
                                    setTimeout(() => {
                                        self.subInfo(e);
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
        console.log(e)

        var type = self.data.userInfo.type;
        var address = e.detail.value.address;
        var address_id = self.data.userInfo.address_id;
        var room_id = self.data.userInfo.room_id ? self.data.userInfo.room_id : 0;
        var token = wx.getStorageSync('token');
        infomation.user(token, type, address_id, address, room_id).then(res => {
            console.log(res);
            if (type == 1) {
                wx.showToast({
                    icon: "none",
                    title: '提交成功,等待审核',
                    success() {
                        setTimeout(function () {
                            wx.navigateTo({
                                url: '../../index/change-user/change-user',
                            });
                        }, 2000);
                    }
                });
            } else {
                wx.showToast({
                    icon: "none",
                    title: '提交成功,等待户主审核',
                    success() {
                        setTimeout(function () {
                            wx.navigateTo({
                                url: '../../index/change-user/change-user',
                            });
                        }, 2000);
                    }
                });
            }

            // self.setData({
            //     showSubmit: false
            // });
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