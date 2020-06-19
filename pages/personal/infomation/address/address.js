var address = require('../../../../model/personal/address')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        proList: [], // 省级列表
        cityList: [], // 市级列表
        areaList: [], // 区级列表
        communityList: [], // 社区列表
        detailList: [], // 详细列表
        province: '',
        city: '',
        area: '',
        community: '',
        detail: '',
        parent_id: 0, // 用于取地区值
        is_pro: '', // 选中省级
        is_city: '', // 选中市级
        is_area: '', // 选中区级
        is_community: '', // 选中社区
        is_detail: '', // 选中详细地址

    },

    onLoad() {
        this.getPro();
    },

    sumAddress(e) {
        var self = this;
        var all_address = e.detail.value.province + e.detail.value.city + e.detail.value.area + e.detail.value.community + e.detail.value.detail;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var address = 'userInfo.address';
        prevPage.setData({
            [address]: all_address
        })
        wx.navigateBack({
            delta: 1
        })
    },

    // 获取省级
    getPro() {
        var self = this;
        address.areas(1, 10).then(res => {
            self.setData({
                proList: res.data
            })
        })
    },

    // 选择省级
    ProChange(e) {
        var self = this;
        self.setData({
            is_pro: e.detail.value
        })
        self.data.parent_id = self.data.proList[self.data.is_pro].id;
        self.getCity(self.data.parent_id)
    },

    // 获取市级
    getCity(val) {
        var self = this;
        address.areas(1, 10, val).then(res => {
            self.setData({
                cityList: res.data
            })
        })
    },

    // 选择市级
    cityChange(e) {
        var self = this;
        self.setData({
            is_city: e.detail.value
        })
        self.data.parent_id = self.data.cityList[self.data.is_city].id;
        self.getArea(self.data.parent_id)
    },

    // 获取区级
    getArea(val) {
        var self = this;
        address.areas(1, 10, val).then(res => {
            self.setData({
                areaList: res.data
            })
        })
    },

    // 选择区级
    areaChange(e) {
        var self = this;
        self.setData({
            is_area: e.detail.value
        })
        self.data.parent_id = self.data.areaList[self.data.is_area].id;
        console.log(self.data.parent_id)
        self.getCommunity(self.data.parent_id)
    },

    // 获取社区地址
    getCommunity(val) {
        var self = this;
        address.areas(1, 10, val).then(res => {
            self.setData({
                communityList: res.data
            })
        })
    },

    // 选择社区
    communityChange(e) {
        var self = this;
        self.setData({
            is_community: e.detail.value
        })
        self.data.parent_id = self.data.communityList[self.data.is_community].id;
        console.log(self.data.parent_id)
        self.getDetail(self.data.parent_id)
    },

    // 获取详细地址
    getDetail(val) {
        var self = this;
        address.addresses(1, 10, val).then(res => {
            self.setData({
                detailList: res.data
            })
        })
    },

    // 选择详细地址
    detailChange(e) {
        var self = this;
        self.setData({
            is_detail: e.detail.value
        })
    }
})