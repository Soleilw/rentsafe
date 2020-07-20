var user = require('../../../../model/user');
var infomation = require('../../../../model/personal/infomation');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        idenInfoList: [],
        wxInfo: {},
        area_id: '',
        address_id: '',
        detailedAddress_id: ''
    },

    onShow() {
        this.getIdenInfo()
    },

    getIdenInfo() {
        var self = this;
        if(wx.getStorageSync('token')) {
            infomation.idenInfo(wx.getStorageSync('token'), 1, 10000).then(res => {
                console.log('getIdenInfo', res.data);
                self.setData({
                    idenInfoList: res.data,
                })
            })
        }
    },

    toIndex(e) {
        var self = this;
        console.log(e);
        var typestring = e.currentTarget.dataset.typestring;
        var address = e.currentTarget.dataset.address;
        var area_id = e.currentTarget.dataset.area_id;
        var address_id = e.currentTarget.dataset.addresses_id;
        var detailedAddress_id = e.currentTarget.dataset.add;
        wx.reLaunch({
            url: '../../infomation/register/register?typestring=' + typestring + '&address=' + address + '&area_id=' + area_id + '&address_id=' + address_id + '&detailedAddress_id=' + detailedAddress_id
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