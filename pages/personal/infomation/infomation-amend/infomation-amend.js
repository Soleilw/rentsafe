const REG_PHONE = /^1[3-9]\d{9}$/;
// const REG_ID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
const qiniuUploader = require("../../../../utils/qiniu");
var infomation = require('../../../../model/personal/infomation');
var app = getApp();


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
        state: '', // 审核状态
        wxInfo: null,
        showCamera: false, // 显示相机
        cameraConfig: {
            position: 'front',
            flash: 'off'
        },
        showFace: false, // 开启人脸
        // showRegister: false, // 初次注册提交按钮
        showSubmit: false, // 提交按钮
        disabled: false,
        // isRegister: false, // 非初次注册用户
        id: '',
        check: '',
        isSucceed: true,

    },

    onLoad(options) {
        console.log(options)
        this.getPersonalInfo();

        if (wx.getStorageSync('openFace') == 'open') {
            this.setData({
                showFace: true
            });
        }
        this.setData({
            wxInfo: wx.getStorageSync('wxInfo'),
            id: options.id,
        });

        // 初始化
        this.showCamera = false //是否显示照相机
        this.cameraConfig = { //照相机参数配置
            flash: 'off',
            position: 'front'
        }
    },

    onShow(e) {
        this.getPersonalInfo();
    },
    getPersonalInfo() {
        var self = this;
        infomation.userInfo(wx.getStorageSync('token')).then(res => {
            console.log('getPersonalInfo', res);
            if (res) {
                self.setData({
                    userInfo: res,
                    state: res.state,
                    disabled: true,
                    check: res.check
                })
            }
        })
    },
    reg(idCard) {
        var regIdCard =
            /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        if (regIdCard.test(idCard)) {
            if (idCard.length == 18) {
                var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10,
                    5, 8, 4, 2);
                var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2);
                var idCardWiSum = 0;
                for (var i = 0; i < 17; i++) {
                    idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                }
                var idCardMod = idCardWiSum % 11;
                var idCardLast = idCard.substring(17);
                if (idCardMod == 2) {
                    if (idCardLast == "X" || idCardLast == "x") {
                        return true;
                    } else {
                        wx.showToast({
                            icon: "none",
                            title: '身份证号码错误！'
                        })
                        return false;
                    }
                } else {
                    if (idCardLast == idCardY[idCardMod]) {
                        return true;
                    } else {
                        wx.showToast({
                            icon: "none",
                            title: '身份证号码错误！'
                        })
                        return false;
                    }
                }
            } else {
                return true;
            }
        } else {
            wx.showToast({
                icon: "none",
                title: '请输入有效的身份证号码'
            })
        }
    },

    subInfomation(e) {
        var self = this;
        console.log('subInfomation', e)
        // 验证手机号
        var phone = e.detail.value.phone;
        // var phone = '159765406547';
        if (!REG_PHONE.test(phone)) {
            wx.showToast({
                icon: "none",
                title: '请正确的手机号',
            })
        }
        // 验证身份证
        var card_number = e.detail.value.card_number;
        // var card_number = '440981199701285628';
        if (!self.reg(card_number)) {
            wx.showToast({
                icon: "none",
                title: '请输入有效的身份证号码'
            })
        }
        var id = self.data.id;
        var name = e.detail.value.name;
        // var name = '安';
        var sex = e.detail.value.sex;
        var token = wx.getStorageSync('token');
        var href = self.data.userInfo.href;
        // var href = 'https://tu.fengniaotuangou.cn/tmp_ff1b709c323f134045df80bea705bde2bfd57d1d90686b6f.jpg';

        if (REG_PHONE.test(phone) && self.reg(card_number) && name && sex && href) {
            infomation.amend(id, token, name, sex, card_number, phone, href).then(res => {
                wx.showModal({
                    title: '提示',
                    content: '信息提交将无法修改, 是否确定要提交',
                    cancelText: '取消',
                    confirmText: '确定',
                    success: function (res) {
                        if (res.confirm) {
                            wx.showToast({
                                icon: "none",
                                title: '提交成功',
                                success: () => {
                                    setTimeout(function () {
                                        self.checkAuth();
                                    }, 1000);

                                }
                            });
                        } else if (res.cancel) {
                            wx.showToast({
                                icon: "none",
                                title: '取消成功',
                            });
                        }
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

    // 修改个人信息
    changeInfo() {
        if (this.data.check == 1) {
            wx.showToast({
                icon: "none",
                title: '只允许修改人脸图片',
                success: () => {
                    this.setData({
                        disabled: true,
                        showSubmit: true
                    })
                }
            })
        } else {
            this.setData({
                disabled: false,
                showSubmit: true
            })
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
        if (!self.reg(e.detail.value)) {
            wx.showToast({
                icon: "none",
                title: '请输入有效的身份证号码',
            })
        }
    },

    // 验证手机号
    regPhone(e) {
        var self = this;
        if (!REG_PHONE.test(e.detail.value)) {
            wx.showToast({
                icon: "none",
                title: '请正确的手机号',
            })
        }
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