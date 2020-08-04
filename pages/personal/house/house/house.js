// pages/personal/house/house.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailedAddress_id: '',
        typestring: ''
    },

    onLoad: function (options) {
        console.log('options', options);
        this.setData({
            detailedAddress_id: options.detailedAddress_id,
            typestring: options.typestring
        })
    },
    // 租客审核
    toManage() {
        var self = this;
        wx.navigateTo({
            url: '../renter/renter?detailedAddress_id=' + self.data.detailedAddress_id + '&typestring=' + self.data.typestring
        })
    },
    // 物业审核
    toProperty() {
        var self = this;
        wx.navigateTo({
            url: '../property/property?detailedAddress_id=' + self.data.detailedAddress_id
        })
    },
    // 多房屋地址管理
    toHouseManage() {
        wx.navigateTo({
            url: '../address-manage/show/address'
        })
    }
})