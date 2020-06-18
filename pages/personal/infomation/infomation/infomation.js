const REG_PHONE = /^1[3-9]\d{9}$/;
const REG_ID = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
const qiniuUploader = require("../../../../utils/qiniu");

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
            nickname: '',
            name: 'soleil',
            sex: 1,
            id_card: '',
            phone: '123456',
            id_type: '',
            address: '',
            href: ''
        },
        id_card_select: '', // 身份类型选择
        identityList: [{
            'name': '户主',
            'type': 1
        }, {
            'name': '租客',
            'type': 2
        }], // 身份类型列表
        showCamera: false, // 显示相机
        cameraConfig: {
            position: 'front',
            flash: 'off'
        },
    },

    onLoad(options) {
        var address = 'userInfo.address';
        this.setData({
            [address]: options.address
        })
        // 初始化
        this.showCamera = false //是否显示照相机
        this.cameraConfig = { //照相机参数配置
            flash: 'off',
            position: 'front'
        }
    },

    onShow() {},

    subInfomation(e) {
        var self = this;
        console.log(e)

        // var phone = e.detail.value.phone;
        // if (!REG_PHONE.test(phone)) {
        //     wx.showToast({
        //         icon: "none",
        //         title: '请正确的手机号',
        //     })
        // }

        // var id_card = e.detail.value.id_card;
        // if (!REG_ID.test(id_card)) {
        //     wx.showToast({
        //         icon: "none",
        //         title: '请输入有效的身份证号码',
        //     })
        // }

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

    bindIdentityChange(e) {
        var self = this;
        console.log(e)
        console.log(self.data.identityList)
        self.setData({
            id_card_select: e.detail.value
        })
    },


    toChooseAddress() {
        wx.navigateTo({
            url: '../address/address'
        })
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
                    duration: 100000
                });
                qiniuUploader.upload(res.tempImagePath, res => {
                    console.log(res)
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