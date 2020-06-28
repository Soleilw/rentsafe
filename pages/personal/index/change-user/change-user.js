var user = require('../../../../model/user');
var infomation = require('../../../../model/personal/infomation');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        idenInfoList: [],
        wxInfo: {},
    },

    onShow() {
        this.getIdenInfo()
    },

    getIdenInfo() {
        if(wx.getStorageSync('token')) {
            infomation.idenInfo(wx.getStorageSync('token')).then(res => {
                this.setData({
                    idenInfoList: res.data
                })
            })
        }
    },

    toIndex(e) {
        var self = this;
        console.log(e)
        wx.reLaunch({
            url: '../../infomation/register/register?typestring=' + e.currentTarget.dataset.typestring + '&address=' + e.currentTarget.dataset.address
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
})