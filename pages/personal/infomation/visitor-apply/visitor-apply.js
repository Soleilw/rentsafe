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
        showRegister: false, // 初次注册提交按钮
        disabled: false,
        status: null,
        id: '',
        check: ''
    },

    onLoad(options) {
        console.log(options)
        if (wx.getStorageSync('openFace') == 'open') {
            this.setData({
                showFace: true
            });
        }
        this.setData({
            wxInfo: wx.getStorageSync('wxInfo'),
            status: options.status,
            id: options.id
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
        // if (!wx.getStorageSync('token')) {
        //     wx.showToast({
        //         icon: "none",
        //         title: '请先登录',
        //         success() {
        //             setTimeout(function () {
        //                 wx.removeStorageSync('wxInfo');
        //                 wx.reLaunch({
        //                     url: "pages/personal/index/change-user/change-user"
        //                 });
        //             }, 2000);
        //         }
        //     });

        // }
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
                    isRegister: true,
                    check: res.check
                })
            } else {
                self.setData({
                    showRegister: true,
                    isRegister: false
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
    // 选择地址
    toChooseAddress() {
      var self = this;
      wx.navigateTo({
        url: '../../infomation/address/address',
      })
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
        var id = self.data.userInfo.id ? self.data.userInfo.id : '';
        var name = e.detail.value.name;
        // var name = '安';
        var sex = e.detail.value.sex;
        var token = wx.getStorageSync('token');
        // var href = self.data.userInfo.href;
        var href = 'https://tu.fengniaotuangou.cn/tmp_ff1b709c323f134045df80bea705bde2bfd57d1d90686b6f.jpg';

        if (REG_PHONE.test(phone) && self.reg(card_number) && name && sex && href) {
            
        } else {
            wx.showToast({
                icon: "none",
                title: '请补充完整信息',
            })
        }

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

    addIden() {
        var self = this
        console.log(1111, this.data.status);

        // wx.navigateTo({
        //     url: '../register/register?status=' + self.data.status + '&id=' + self.data.id
        // })
        wx.navigateTo({
            url: '../register/register'
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