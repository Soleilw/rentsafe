var user = require('../../../model/user')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},
    onShow() {
        this.setData({
            userInfo: wx.getStorageSync('userInfo')
        })
    },

    getUserInfo(e) {
        var self = this,
            u_info = e.detail.userInfo;
        wx.login({
            success(res) {
                var code = res.code;
                if (code) {
                    wx.getUserInfo({
                        success: (res) => {
                            user.login(code, res.iv, res.encryptedData).then(res => {
                                console.log(res)
                                wx.setStorage({
                                    data: res.token,
                                    key: 'token',
                                })
                                // 全局
                                wx.setStorageSync('userInfo', res.info)
                                self.setData({
                                    userInfo: res.info
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