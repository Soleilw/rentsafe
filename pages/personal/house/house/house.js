// pages/personal/house/house.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // 租客审核
    toManage() {
        wx.navigateTo({
            url: '../renter/renter'
        })
    },
    // 多房屋地址管理
    toHouseManage() {
        wx.navigateTo({
            url: '../address-manage/show/address'
        })
    }
})