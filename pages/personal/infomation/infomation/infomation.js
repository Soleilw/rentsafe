const REG_PHONE = /^1[3-9]\d{9}$/;
const REG_ID = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
const qiniuUploader = require("../../../../utils/qiniu");
var infomation = require('../../../../model/personal/infomation');


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
        id_card_select: '', // 身份类型选择
        identityList: [{ // 身份类型列表
            'name': '户主',
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
        showCamera: false, // 显示相机
        cameraConfig: {
            position: 'front',
            flash: 'off'
        },
        showFace: false, // 开启人脸
        showRegister: false, // 初次注册提交
        showSubmit: false, // 提交按钮
        disabled: false
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
            wxInfo: wx.getStorageSync('wxInfo')
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
            if (res) {
                self.setData({
                    userInfo: res,
                    state: res.state,
                    disabled: true
                })
            } else {
                self.setData({
                    showRegister: true
                })
            }

        })
    },

    subInfomation(e) {
        var self = this;
        console.log(e)
        // 验证手机号
        var phone = e.detail.value.phone;
        if (!REG_PHONE.test(phone)) {
            wx.showToast({
                icon: "none",
                title: '请正确的手机号',
            })
        }
        // 验证身份证
        var card_number = e.detail.value.card_number;
        if (!REG_ID.test(card_number)) {
            wx.showToast({
                icon: "none",
                title: '请输入有效的身份证号码'
            })
        }
        var id = self.data.userInfo.id;
        var name = e.detail.value.name;
        var sex = e.detail.value.sex;
        var token = wx.getStorageSync('token');
        var href = self.data.userInfo.href;
        if (phone && card_number && name && sex && href) {
            infomation.register(id, token, name, sex, card_number, phone, href).then(res => {
                if (self.data.userInfo) {
                    wx.showToast({
                        icon: "none",
                        title: '提交成功',
                        success() {
                            setTimeout(function () {
                                wx.navigateTo({
                                    url: '../../index/index',
                                })
                                self.setData({
                                    disabled: true
                                })
                            }, 2000);
                        }
                    });
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '提交成功',
                        success() {
                            setTimeout(function () {
                                wx.navigateTo({
                                    url: '../register/register',
                                })
                                self.setData({
                                    disabled: true
                                })
                            }, 2000);
                        }
                    });
                }

            })
        } else {
            wx.showToast({
                icon: "none",
                title: '请填写完整信息'
            });
        }

    },

    // 修改个人信息
    changeInfo(e) {
        // this.setData({
        //     showSubmit: true
        // })
    },

    changeInfo() {
        this.setData({
            disabled: false,
            showSubmit: true
        })
    },

    addIden() {
        wx.navigateTo({
            url: '../register/register',
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
        console.log(e)
        // app.showTip('相机错误')
        this.cameraDisable(); //隐藏相机
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