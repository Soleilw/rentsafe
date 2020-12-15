// pages/personal/house/house.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailedAddress_id: '',
        typeString: '',
        showFace: false,
        userType: null
    },

    onLoad: function (options) {
        console.log('options', options);
        this.setData({
            detailedAddress_id: options.detailedAddress_id,
            typeString: options.typeString,
            userType: app.globalData.userType
        })
        if (wx.getStorageSync('openFace') == 'open') {
            this.setData({
                showFace: true
            });
        }
        console.log(111, app.globalData.userType);
        
    },
    // 租客审核
    toManage() {
        var self = this;
        wx.navigateTo({
            url: '../renter/renter?detailedAddress_id=' + self.data.detailedAddress_id + '&typeString=' + self.data.typeString
        })
    },
    // 家庭成员审核
    toChild() {
        var self = this;
        wx.navigateTo({
            url: '../renter-child/renter-child?detailedAddress_id=' + self.data.detailedAddress_id + '&typeString=' + self.data.typeString
        })
    },
    // 物业审核
    toProperty() {
        var self = this;
        wx.navigateTo({
            url: '../property/property?detailedAddress_id=' + self.data.detailedAddress_id
        })
    },
    // 缴费列表
    toManagePay() {
        var self = this;
        wx.navigateTo({
            url: '../renter-pay/renter-pay?detailedAddress_id=' + self.data.detailedAddress_id + '&typeString=' + self.data.typeString
        })
    },
    // 多房屋地址管理
    toHouseManage() {
        wx.navigateTo({
            url: '../address-manage/show/address'
        })
    }
})