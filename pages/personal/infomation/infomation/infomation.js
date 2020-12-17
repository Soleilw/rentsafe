const REG_PHONE = /^1[3-9]\d{9}$/;
// const REG_ID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
const qiniuUploader = require("../../../../utils/qiniu");
var infomation = require('../../../../model/personal/infomation');
var app = getApp();
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
            sex: 1,
        },
        state: '', // 审核状态
        wxInfo: null,
        id_card_select: '', // 身份类型选择
        identityList: [{ // 身份类型列表
            'name': '户主(房东)',
            'type': 1
        }, {
            'name': '租客',
            'type': 2
        }, {
            'name': '家庭成员',
            'type': 3
        }, {
            'name': '物业',
            'type': 4
        }],
        IDList: [{ // 身份类型类型列表
                'name': '中国居民身份证',
                'type': 1
            }, {
                'name': '外国人永久居留身份证',
                'type': 2
            }, {
                'name': '港澳居民居住证',
                'type': 3
            },
            {
                'name': '护照',
                'type': 4
            }
        ],
        showCamera: false, // 显示相机
        cameraConfig: {
            position: 'front',
            flash: 'off'
        },
        showFace: false, // 开启人脸
        showRegister: false, // 初次注册提交按钮
        showSubmit: false, // 提交按钮
        disabled: false,
        isRegister: false, // 非初次注册用户
        id: '',
        check: '',
        index: '',
        idType: '',
        number_type: ''
    },

    onLoad(options) {
        console.log(options)
        this.getPersonalInfo();
        // var address = 'userInfo.address';
        // var address_id = 'userInfo.address_id';
        // var room_id = 'userInfo.room_id';

        if (wx.getStorageSync('openFace') == 'open') {
            this.setData({
                showFace: true
            });
        }
        this.setData({
            // [address]: options.address,
            // [address_id]: options.address_id,
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
                    isRegister: true,
                    check: res.check,
                    number_type: res.number_type
                })
                switch (res.number_type) {
                    case 1:
                        self.setData({
                            idType: '中国居民身份证',
                        })
                        break;
                    case 2:
                        self.setData({
                            idType: '外国人永久居留身份证',
                        })
                        break;
                    case 3:
                        self.setData({
                            idType: '港澳居民居住证',
                        })
                        break;
                }
            } else {
                self.setData({
                    showRegister: true,
                    isRegister: false,
                    idType: ''
                })
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
    subInfomation(e) {
        var self = this;
        console.log('subInfomation', e)
        // 验证手机号
        var phone = e.detail.value.phone;
        // var phone = '159765406547';
        if (!REG_PHONE.test(phone)) {
            wx.showToast({
                icon: "none",
                title: '请输入正确的手机号',
            })
        }
        // 验证身份证
        var card_number = e.detail.value.card_number;
        // var card_number = '440981199701285628';
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
        var id = self.data.userInfo.id ? self.data.userInfo.id : '';
        var name = e.detail.value.name;
        // var name = '安';
        var sex = e.detail.value.sex;
        var token = wx.getStorageSync('token');
        var href = self.data.userInfo.href;
        // var href = 'https://tu.fengniaotuangou.cn/tmp_d0f51769f20cb338e48111b6440f478a.jpg'
        
        if (phone && card_number && name && sex && href && self.data.number_type) {
            wx.showModal({
                title: '提示',
                content: '信息提交将无法修改, 请确保信息与身份证信息一致',
                cancelText: '取消',
                confirmText: '确定',
                success: function (res) {
                    if (res.confirm) {
                        infomation.register(token, name, sex, card_number, phone, href, self.data.number_type).then(res => {
                            console.log('self.data.userInfo', self.data.userInfo);
                            // 修改
                            if (self.data.isRegister) {
                                wx.showToast({
                                    icon: "none",
                                    title: '提交成功',
                                    success() {
                                        self.setData({
                                            disabled: true,
                                            showSubmit: false,
                                            isRegister: true
                                        })
                                    },
                                });
                            } else {
                                // 初次注册
                                wx.showToast({
                                    icon: "none",
                                    title: '提交成功, 请继续添加身份',
                                    success() {
                                        setTimeout(function () {
                                            infomation.userInfo(wx.getStorageSync('token')).then(res => {
                                                console.log('getPersonalInfo', res);
                                                self.setData({
                                                    userInfo: res,
                                                    // state: res.state,
                                                    disabled: true,
                                                    showSubmit: false,
                                                    showRegister: false,
                                                    isRegister: true
                                                })
                                            })
                                        }, 2000);
                                    },
                                });
                            }

                        })
                    } else if (res.cancel) {
                        console.log(111);
                        wx.showToast({
                            title: '取消成功',
                            icon: 'none'
                        })
                    }
                }
            })
        } else if (phone && card_number && sex && href && self.data.number_type) {
            wx.showToast({
                icon: "none",
                title: '请填写姓名',
            })
        } else if (phone && card_number && name && href && self.data.number_type) {
            wx.showToast({
                icon: "none",
                title: '请选择性别',
            })
        } else if (phone && card_number && name && sex && href) {
            wx.showToast({
                icon: "none",
                title: '请选择证件类型',
            })
        } else if (phone && name && sex && href && self.data.number_type) {
            wx.showToast({
                icon: "none",
                title: '请填写有效身份证',
            })
        } else if (card_number && name && sex && href && self.data.number_type) {
            wx.showToast({
                icon: "none",
                title: '请填写有效手机号',
            })
        } else if (phone && card_number && name && sex && self.data.number_typepe) {
            wx.showToast({
                icon: "none",
                title: '请上传人脸',
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
                showSubmit: true,
            })
        }
    },

    addIden() {
        var self = this
        wx.navigateTo({
            url: '../register/register'
        })
    },

    // 验证身份证号
    regIdentity(e) {
        var self = this;
        if (self.data.number_type == 1) {
            console.log(e.detail.value);
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
            console.log();

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