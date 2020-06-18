var address = require('../../../../model/personal/address')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [] // 搜索列表
    },

    onLoad() {
        this.getAddress();
    },

    bindRegionChange() {

    },

    // 获取地址列表
    getAddress(){
        var self = this;
        address.areas(1, 10, 0).then(res => {
debugger
        })
    },

    handleFocus() {
        this.search();
    },

    search() {
        this.setData({
            addressList: ['广东省广州市', '广东省深圳市广东省深圳市广东省深圳市广东省深圳市广东省深圳市', '海南省海口市']
        })
    },

    toInfomation(e) {
        var self = this;
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];
        var prevPage = pages[pages.length - 2];
        var address = 'userInfo.address';
        prevPage.setData({
            [address]: self.data.addressList[e.currentTarget.dataset.index]
        })
        wx.navigateBack({
            delta: 1
        })
    }
})