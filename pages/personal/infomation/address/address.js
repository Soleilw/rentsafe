var add = require('../../../../model/personal/address')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        proList: [], // 省级列表
        cityList: [], // 市级列表
        areaList: [], // 区级列表
        communityList: [], // 社区列表
        detailList: null, // 详细列表
        roomList: [], // 门牌列表
        province: '',
        city: '',
        area: '',
        community: '',
        detail: '',
        room: '',
        parent_id: 0, // 用于取地区值
        is_pro: '', // 选中省级
        is_city: '', // 选中市级
        is_area: '', // 选中区级
        is_community: '', // 选中社区
        is_detail: '', // 选中详细地址
        is_room: '',
        address_id: '',
        all_address: '',
        room_id: '',
        showRoom: true, // 户主type为1不显示房屋编号
        showForm: true,
        // return: '< 返回',
        search_detail: '',
        type: ''
    },

    onLoad(options) {
        this.getPro();
        this.setData({
            type: options.type

        })
        if (options.type === "1") {
            this.setData({
                showRoom: false
            })
        }
    },

    sumAddress(e) {
        var self = this;
        if (self.data.type == 1) {
            self.data.all_address = e.detail.value.province + e.detail.value.city + e.detail.value.area + e.detail.value.community + e.detail.value.detail;
        } else {
            self.data.all_address = e.detail.value.province + e.detail.value.city + e.detail.value.area + e.detail.value.community + e.detail.value.detail + e.detail.value.room;
        }
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var address = 'userInfo.address';
        var address_id = 'userInfo.address_id';
        var room_id = 'userInfo.room_id';
        prevPage.setData({
            [address]: self.data.all_address,
            [address_id]: self.data.address_id,
            [room_id]: self.data.room_id,
        })
        wx.navigateBack({
            delta: 1
        })
    },

    // 获取省级
    getPro() {
        var self = this;
        add.areas(1, 40000).then(res => {
            self.setData({
                proList: res.data
            })
        })
    },

    // 选择省级
    ProChange(e) {
        var self = this;
        self.setData({
            is_pro: e.detail.value,
            province: ''
        })
        self.data.parent_id = self.data.proList[self.data.is_pro].id;
        self.getCity(self.data.parent_id)
    },

    // 获取市级
    getCity(val) {
        var self = this;
        add.areas(1, 40000, val).then(res => {
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
        add.areas(1, 40000, val).then(res => {
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
        add.areas(1, 40000, val).then(res => {
            self.setData({
                communityList: res.data
            })
        })
    },

    // 选择社区
    communityChange(e) {
        var self = this;
        self.data.is_community = e.detail.value
        self.setData({
            is_community: e.detail.value,
            parent_id: self.data.communityList[self.data.is_community].id,
            area: '',
            community: '',
            detail: '',
            roomList: [],
            room: '',
            detailList: [],
            all_address: ''
        })
    },

    // 选择详细地址
    getDetail(e) {
        console.log(e);
        this.setData({
            search_detail: e.detail.value,
        })
    },

    detailChange(e) {
        var self = this;
        console.log(e)
        add.addresses(1, 40000, self.data.parent_id, self.data.search_detail).then(res => {
            self.setData({
                detailList: res.data
            })
        })
        // self.setData({
        //     is_detail: e.detail.value,
        //     address_id: self.data.detailList[e.detail.value].id,
        // })
        // console.log(self.data.all_address)
        // self.data.address_id = self.data.detailList[e.detail.value].address_id;
        // self.getRoom(self.data.address_id);
    },

    toDetail(e) {
        console.log(e)
        var self = this;

        self.setData({
            detail: e.currentTarget.dataset.address,
            showForm: true,
            address_id: e.currentTarget.dataset.id
        });
        if(self.data.type == 1) {
            self.setData({
                all_address: self.data.proList[self.data.is_pro].title + self.data.cityList[self.data.is_city].title + self.data.areaList[self.data.is_area].title + self.data.communityList[self.data.is_community].title + self.data.detail
            })
        }
        self.getRoom(e.currentTarget.dataset.id);
        self.showAllAddress();
    },

    // 获取门牌列表
    getRoom(val) {
        var self = this;
        // self.setData({
        //     all_address: self.data.proList[self.data.is_pro].title + self.data.cityList[self.data.is_city].title + self.data.areaList[self.data.is_area].title + self.data.communityList[self.data.is_community].title + self.data.detail
        // })
        add.room(1, 30000, val).then(res => {
            self.setData({
                roomList: res.data
            })
        })
    },

    // 选择门牌号
    roomChange(e) {
        var self = this;
        self.setData({
            is_room: e.detail.value,
            room_id: self.data.roomList[e.detail.value].id
        })
        if(self.data.roomList[e.detail.value].door_number) {
            self.setData({
                all_address: self.data.proList[self.data.is_pro].title + self.data.cityList[self.data.is_city].title + self.data.areaList[self.data.is_area].title + self.data.communityList[self.data.is_community].title + self.data.detail + self.data.roomList[self.data.is_room].door_number
            })
        }
        console.log(self.data.roomList[e.detail.value].door_number)
    },

    showAllAddress() {
        console.log(this.data.room)
        var self = this;
        self.setData({
            // all_address: self.data.proList[self.data.is_pro].title + self.data.cityList[self.data.is_city].title + self.data.areaList[self.data.is_area].title + self.data.communityList[self.data.is_community].title + self.data.detail + self.data.roomList[self.data.is_room].door_number
            all_address: self.data.proList[self.data.is_pro].title + self.data.cityList[self.data.is_city].title + self.data.areaList[self.data.is_area].title + self.data.communityList[self.data.is_community].title + self.data.detail

        })
    },

    showSearch() {
        this.setData({
            showForm: false,
            detailList: []
        })
    },
    hideSearch() {
        this.setData({
            showForm: true
        })
    }

})