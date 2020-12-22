var user = require('../../../../model/user');
var infomation = require('../../../../model/personal/infomation');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        idenInfoList: [],
        wxInfo: {},
        area_id: '',
        address_id: '',
        detailedAddress_id: '',
        user_type: '',
        showCamera: null,
        userInfo: {
            type: '',
            address_id: '',
            address: '',
            room_id: ''
        },
        status: null,
        id: '',
        showFace: false, // 开启人脸
    },

    onLoad(options) {
        this.getIdenInfo();
        if (wx.getStorageSync('openFace') == 'open') {
            this.setData({
                showFace: true
            });
        }
        this.setData({
            showCamera: app.globalData.showCamera
        })
        wx.getSetting({
            success: (res) => {
                console.log(1, res);
                if (res.authSetting['scope.camera'] == false) {
                    wx.showModal({
                        title: '摄像头授权',
                        content: '您未开启相机权限，无法上传照片，是否开启',
                        cancelText: '取消',
                        confirmText: '开启',
                        success: (res) => {
                            console.log(2, res);

                            if (res.confirm) {
                                wx.openSetting({
                                    success: res => {
                                        this.cameraDisable(); // 开启相机
                                    }
                                })

                            } else if (res.cancel) {
                                wx.showToast({
                                    icon: "none",
                                    title: '您未开启相机权限，无法上传照片,需要开启相机权限',
                                    duration: 4000,
                                })
                            }
                        }
                    })
                }
            }
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

    getIdenInfo() {
        var self = this;
        if (wx.getStorageSync('token')) {
            infomation.idenInfo(wx.getStorageSync('token'), 1, 10000).then(res => {
                if (res.data.length > 0) {
                    console.log('getIdenInfo', res.data);
                    self.setData({
                        idenInfoList: res.data,
                    })
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '您还未添加身份，无法使用部分功能，请先添加身份。如已添加身份，请等待户主(房东)审核通过',
                        duration: 4000,
                        success: () => {
                            this.setData({
                                showCamera: false
                            })
                        }
                    })
                }
            })
        }
    },

    toIndex(e) {
        var self = this;
        console.log(1,e);
        app.globalData.typeString = e.currentTarget.dataset.typestring;
        app.globalData.userType = e.currentTarget.dataset.type;
        app.globalData.isBuy = 'true';
        app.globalData.area_id = e.currentTarget.dataset.area_id;
        app.globalData.detailedAddress_id = e.currentTarget.dataset.addresses_id;
        app.globalData.address = e.currentTarget.dataset.address;
        app.globalData.room_id = e.currentTarget.dataset.roomid;
        app.globalData.open_door = e.currentTarget.dataset.opendoor;
        app.globalData.id = e.currentTarget.dataset.id;
        app.globalData.renter_type = e.currentTarget.dataset.renter_type;
        app.globalData.face_id = e.currentTarget.dataset.face_id;
        app.globalData.payState = e.currentTarget.dataset.paystate;
        app.globalData.userName = e.currentTarget.dataset.username;
        // app.globalData.passAddressId = e.currentTarget.dataset.addressid;

        wx.switchTab({
            url: '/pages/personal/index/index'
        })
    },
    // 修改
    toAmend(e) {
        var self = this;
        console.log(e);
        self.setData({
            status: e.target.dataset.state,
            id: e.target.dataset.id
        })
        wx.navigateTo({
            url: '../../infomation/infomation-amend/infomation-amend?status=' + self.data.status + '&id=' + self.data.id
        })
    },
    // 访客申请
    visitorApply() {
        var self = this;
        wx.navigateTo({
            url: '../../infomation/visitor-apply/visitor-apply',
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
                                self.getPersonalInfo()
                            })
                        }
                    })
                }
            }
        });
    },

    getPersonalInfo() {
        var self = this;
        wx.navigateTo({
            url: '../../infomation/infomation/infomation',
        })
    },

    // 分享转发
    onShareAppMessage: function () {
        return {
            title: '安域智慧安防',
            imageUrl: "../../../../icon/cover_img.png"
        }
    }
})