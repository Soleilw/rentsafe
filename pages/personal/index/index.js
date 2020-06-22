var user = require('../../../model/user');
var infomation = require('../../../model/personal/infomation');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxInfo: null,
        showHouse: false, // 只有户主才显示房屋管理
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    onShow() {
        this.getPersonalInfo();
        this.setData({
            wxInfo: wx.getStorageSync('wxInfo')
        })
    },
    getPersonalInfo() {
        var self = this;
        infomation.userInfo(wx.getStorageSync('token')).then(res => {
            if (res.type === 1) {
                self.setData({
                    showHouse: true
                })
            }
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
                                self.getPersonalInfo();

                            })
                        }
                    })
                }
            }
        });
    },

    // 去个人信息
    toInfomation() {
        wx.navigateTo({
            url: '../infomation/infomation/infomation'
        })
    },
    // 去房屋管理
    toHouse() {
        wx.navigateTo({
            url: '../house/house/house'
        })
    },

    callPhone() {
        wx.makePhoneCall({
            phoneNumber: '110'
        })
    },

})