const qiniuUploader = require("../../../../utils/qiniu");
var infomation = require('../../../../model/personal/infomation');
const REG_PHONE = /^1[3-9]\d{9}$/;
var reg = require('../../../../utils/reg')

function getQiniuToken() {
    var options = {
        region: 'SCN',
        uptoken: '',
        uptokenURL: 'https://api.fengniaotuangou.cn/api/upload/token',
        uptokenFunc: function () {},
        domain: 'https://tu.fengniaotuangou.cn',
        shouldUseQiniuFileName: false
    };
    qiniuUploader.init(options);
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            sex: 1
        },
        wxInfo: null,
        showCamera: false, // 显示相机
        cameraConfig: {
            position: 'front',
            flash: 'off'
        },
        showFace: false, // 开启人脸
        showRegister: false, // 初次注册提交按钮
        showSubmit: false, // 提交按钮
        disabled: false,
        isRegister: false, // 非初次注册用户,
        address_id: '',
        address: '',
        room_id: '',
        isSucceed: true,
        index: '',
        idType: '',
        number_type: '',
        IDList: [{ // 身份类型类型列表
            'name': '中国居民身份证',
            'type': 1
        }, {
            'name': '外国人永久居留身份证',
            'type': 2
        }, {
            'name': '港澳台居民居住证',
            'type': 3
        },
        {
            'name': '护照',
            'type': 4
        }
    ],
    },

    onLoad(options) {
        console.log(options)
        // this.getPersonalInfo();

        if (wx.getStorageSync('openFace') == 'open') {
            this.setData({
                showFace: true
            });
        }
        this.setData({
            wxInfo: wx.getStorageSync('wxInfo'),
            address_id: options.detailedAddress_id,
            address: options.address,
            room_id: options.room_id
        });

        // 初始化
        this.showCamera = false //是否显示照相机
        this.cameraConfig = { //照相机参数配置
            flash: 'off',
            position: 'front'
        }
    },

    onShow(e) {
        // this.getPersonalInfo();
    },
    // getPersonalInfo() {
    //     var self = this;
    //     infomation.userInfo(wx.getStorageSync('token')).then(res => {
    //         console.log('getPersonalInfo', res);
    //         if (res) {
    //             self.setData({
    //                 userInfo: res,
    //                 state: res.state,
    //                 disabled: true,
    //                 isRegister: true
    //             })
    //         } else {
    //             self.setData({
    //                 showRegister: true,
    //                 isRegister: false
    //             })
    //         }
    //     })
    // },

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

    IDChange(e) {
        var self = this;
        self.setData({
            index: e.detail.value,
            number_type: Number(e.detail.value) + 1
        })
        console.log(self.data.number_type);

    },
    subInfomations(e) {
        var self = this;
        console.log(e);
        // 验证手机号
        var phone = e.detail.value.phone;
        if (!REG_PHONE.test(phone)) {
            wx.showToast({
                icon: "none",
                title: '请输入正确的手机号',
            })
        }
        var card_number = e.detail.value.card_number;
        if (self.data.number_type == 1) {
            if (!reg.IDCard(card_number)) {
                wx.showToast({
                    icon: "none",
                    title: '请输入有效的身份证号码'
                })
            }
        } else if (self.data.number_type == 2) {
            if (!reg.foreign(card_numbere)) {
                wx.showToast({
                    icon: "none",
                    title: '请输入有效的身份证号码',
                })
            }
        } else if (self.data.number_type == 3) {
            if (!reg.HK(card_number)) {
                wx.showToast({
                    icon: "none",
                    title: '请输入有效的身份证号码',
                })
            }
        } else if (self.data.number_type == 4) {
            if (!reg.passport(card_number)) {
                wx.showToast({
                    icon: "none",
                    title: '请输入有效的护照',
                })
            }
        }

        var name = e.detail.value.name;
        var sex = e.detail.value.sex;
        var token = wx.getStorageSync('token');
        var address_id = self.data.address_id;
        var address = self.data.address;
        var room_id = self.data.room_id
        var href = self.data.userInfo.href;
        // var href = 'https://tu.fengniaotuangou.cn/a1ffb1c0620351e7f5845b10be42230a.jpg';

        if (phone && card_number && name && sex && href && self.data.number_type) {
            infomation.children(token, href, name, sex, address_id, address, room_id, card_number, phone, self.data.number_type).then(res => {
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

            })
        } else {
            wx.showToast({
                icon: "none",
                title: '请补充完整信息',
            })
        }
    },

    // 验证身份证号
    regIdentity(e) {
        var self = this;
        if (self.data.number_type == 1) {
            if (!reg.IDCard(e.detail.value)) {
                wx.showToast({
                    icon: "none",
                    title: '请输入有效的身份证号码',
                })
            }
        } else if (self.data.number_type == 2) {
            if (!reg.foreign(e.detail.value)) {
                wx.showToast({
                    icon: "none",
                    title: '请输入有效的身份证号码',
                })
            }
        } else if (self.data.number_type == 3) {
            if (!reg.HK(e.detail.value)) {
                wx.showToast({
                    icon: "none",
                    title: '请输入有效的身份证号码',
                })
            }
        } else if (self.data.number_type == 4) {
            if (!reg.passport(e.detail.value)) {
                wx.showToast({
                    icon: "none",
                    title: '请输入有效的护照',
                })
            }
        }


    },
    // 验证手机号
    regPhone(e) {
        var self = this;
        if (!REG_PHONE.test(e.detail.value)) {
            wx.showToast({
                icon: "none",
                title: '请输入正确的手机号',
            })
        }
    },

    // 修改个人信息
    changeInfo(e) {
        this.setData({
            showSubmit: true
        })
    },

    changeInfo() {
        this.setData({
            disabled: false,
            showSubmit: true
        })
    },



    toSubmit() {
        var self = this;
    },

    // 调用相机
    cameraDisable() {
        let self = this;
        self.showCamera = !self.showCamera;
        self.setData({
            showCamera: self.showCamera
        })
    },
    // 拍照
    takePhoto(e) {
        var self = this;
        getQiniuToken()
        console.log('点击拍照')
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'normal',
            success(res) {
                console.log(res)
                self.cameraDisable();
                wx.showToast({
                    title: '上传中...',
                    icon: 'loading',
                    duration: 1000
                });
                qiniuUploader.upload(res.tempImagePath, res => {
                    wx.hideToast();
                    console.log(res.fileURL);
                    var href = "userInfo.href";
                    self.setData({
                        [href]: res.fileURL,
                        showSubmit: true
                    })
                    console.log(self.data.userInfo.href)
                }, error => {
                    wx.showModal({
                        title: '错误提示',
                        content: '上传失败！',
                        showCancel: false,
                        success: function (res) {}
                    })
                })
            }
        })
    },

    // 显示隐藏相机
    cameraDisable: function () {
        console.log('隐藏相机')

        this.showCamera = !this.showCamera;
        this.setData({
            showCamera: this.showCamera
        })
    },
    // 照相机停止运行
    cameraStop: function (e) {
        console.log('相机停止运行')
        console.log(e)
        this.cameraDisable();
        app.showNone('相机停止运行')
    },
    // 照相机没授权
    cameraError: function (e) {
        var self = this;
        self.setData({
            showCamera: false
        })
        console.log(e)
        // app.showTip('相机错误')
        wx.showModal({
            title: '摄像头授权',
            content: '您未开启相机权限，无法上传照片，是否开启',
            cancelText: '取消',
            confirmText: '开启',
            success: function (res) {
                if (res.confirm) {
                    wx.getSetting({
                        success: (res) => {
                            if (!res.authSetting['scope.camera']) {
                                wx.authorize({
                                    scope: 'scope.camera',
                                    success: function () {
                                        console.log('允许')
                                    },
                                    fail: function () {
                                        console.log('拒绝')
                                        wx.openSetting({
                                            success: res => {
                                                self.cameraDisable(); // 开启相机
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                } else if (res.cancel) {
                    wx.showToast({
                        icon: "none",
                        title: '您未开启相机权限，无法上传照片,需要开启相机权限',
                        duration: 4000,
                        success: () => {
                            self.setData({
                                showCamera: false
                            })
                        }
                    })
                }
            }
        })
    },
    // 切换闪光灯状态
    flashChange: function () {
        switch (this.cameraConfig.flash) {
            case 'off':
                this.cameraConfig.flash = 'on';
                break;
            case 'on':
                this.cameraConfig.flash = 'auto';
                break;
            case 'auto':
                this.cameraConfig.flash = 'off';
                break;
        }
        this.setData({
            cameraConfig: this.cameraConfig
        })
    },
    // 切换前后置摄像头
    positionChange() {
        console.log(111)

        switch (this.cameraConfig.position) {
            case 'front':
                this.cameraConfig.position = 'back';
                break;
            case 'back':
                this.cameraConfig.position = 'front';
                break;
        }
        console.log(111)

        this.setData({
            cameraConfig: this.cameraConfig
        })
    }
})