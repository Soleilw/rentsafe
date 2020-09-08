var user = require('../../../model/user');
var infomation = require('../../../model/personal/infomation');
var app = getApp();
var buy = require('../../../model/personal/buy')
var door = require('../../../model/personal/door')

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
        detailedAddress_id: null,
        room_id: null,
        doorList: [],
        open_door: null,
        door_index: '',
        uuid: '',
        id: "",
        number: '',
        renter_type: ''
    },

    onLoad: function (options) {
        console.log('options', options);

        this.setData({
            typestring: app.globalData.typestring,
            area_id: app.globalData.area_id,
            // address_id: app.globalData.address_id,
            address: app.globalData.address,
            room_id: app.globalData.room_id,
            detailedAddress_id: app.globalData.detailedAddress_id,
            open_door: app.globalData.open_door,
            id: app.globalData.id,
            renter_type: app.globalData.renter_type
        })

        console.log(this.data.typestring);
        console.log(1112, this.data.detailedAddress_id);

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

        if (wx.getStorageSync('token') && this.data.detailedAddress_id) {
            // this.allowOpen();
            this.getEquipment();
        }
    },

    // 添加家庭成员的身份
    getFamily() {
        var self = this;
        infomation.familyType(self.data.id).then(res => {
            console.log(res);
            if (res == 1) {
                self.setData({
                    showBuy: false,
                    show: false
                })
            } else {
                self.setData({
                    showBuy: true,
                    show: true
                })
                self.getTip()
            }

        })
    },
    // 续费提醒
    getTip() {
        var self = this;
        buy.userServes(wx.getStorageSync('token'), self.data.renter_type, self.data.detailedAddress_id).then(res => {
            console.log('获取开通的服务', res);
            self.setData({
                hasBuyList: res
            })
            console.log(self.data.hasBuyList);
            
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
                                url: '../buy/buy/buy?area_id=' + self.data.area_id + '&detailedAddress_id=' + self.data.detailedAddress_id + '&renter_type=' + self.data.renter_type
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
            }
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
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            app.globalData.typestring = null;
            wx.reLaunch({
                url: "/pages/personal/index/change-user/change-user"
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

    // 绑定家庭成员
    tochildren() {
        var self = this;
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            var detailedAddress_id = self.data.detailedAddress_id
            var address = self.data.address;
            var room_id = self.data.room_id
            wx.navigateTo({
                url: '../infomation/children/children?detailedAddress_id=' + detailedAddress_id + '&address=' + address + '&room_id=' + room_id
            })
        }
    },
    // 一键开门
    toOpenDoor(e) {
        var self = this;
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            console.log(e);
            self.setData({
                door_index: e.detail.value
            })
            var index = self.data.door_index
            var uuid = self.data.doorList[index].uuid
            door.openDoor(uuid, wx.getStorageSync('token')).then(res => {
                console.log('一键开门', res);
                wx.showToast({
                    icon: "none",
                    title: '成功'
                });
            }).catch(err => {
                console.log(err);
                if (err.code == 10002) {
                    wx.showToast({
                        icon: "none",
                        title: '设备不在线! '
                    });
                } else if (err.code == 10001) {
                    wx.showToast({
                        icon: "none",
                        title: '请重新登陆! '
                    });
                } else if (err.code == 10005) {
                    wx.showToast({
                        icon: "none",
                        title: '没有权限! '
                    });
                }
            })
        }
    },
    toApply() {
        wx.showToast({
            icon: "none",
            title: '户主未开启一键开门功能, 请联系户主'
        });
    },

    // 获取设备
    getEquipment() {
        var self = this;
        door.addressDevices(self.data.detailedAddress_id).then(res => {
            console.log('getEquipment', res);
            res.forEach(item => {
                if (item.online == 0) {
                    item.remark += ' (离线)'
                } else if (item.online == 1) {
                    item.remark += ' (在线)'
                }
            })
            self.setData({
                doorList: res,
            })
        })
    },

    // 访客管理
    toVisitor() {
        var self = this;
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            // var detailedAddress_id = self.data.detailedAddress_id
            // var address = self.data.address;
            // var room_id = self.data.room_id
            wx.navigateTo({
                url: '../house/visitor/visitor'
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
                    wx.reLaunch({
                        url: "/pages/personal/index/change-user/change-user"
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
    // 去设置
    toSetting() {
        var self = this;
        if (!wx.getStorageSync('token')) {
            wx.showToast({
                icon: "none",
                title: '请先登录'
            });
            wx.removeStorageSync('wxInfo')
        } else {
            wx.navigateTo({
                url: '../house/setting/setting?detailedAddress_id=' + self.data.detailedAddress_id
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
                url: '../buy/buy/buy?area_id=' + self.data.area_id + '&detailedAddress_id=' + self.data.detailedAddress_id +'&renter_type=' + self.data.renter_type
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
                    if (self.data.typestring == '家庭成员') {
                        self.getFamily()
                    } else {
                        if (!self.data.house_owner.includes(1) && !self.data.house_owner.includes(4)) {
                            console.log('不存在户主或者物业');
                            self.setData({
                                show: true,
                                showBuy: true
                            })
                            // 续费提醒
                            self.getTip()
                        }
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