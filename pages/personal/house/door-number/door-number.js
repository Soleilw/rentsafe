var add = require('../../../../model/personal/address')
var infomation = require('../../../../model/personal/infomation')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomList: [], // 门牌列表
        province: '',
        city: '',
        area: '',
        community: '',
        detail: '',
        room: '',
        parent_id: 0, // 用于取地区值
        is_room: '',
        room_id: '',
        area_id: '',
        address: '',
        detailedAddress_id: '',
        id: '',
        isChange: false
    },

    onLoad(options) {
        this.setData({
            area_id: options.area_id,
            address: options.address,
            room_id: options.room_id,
            detailedAddress_id: options.detailedAddress_id,
            id: options.id
        })
        this.getPro();
        this.getCity();
        this.getArea();
        this.getCommunity();
        this.getRoom();
    },

    sumAddress(e) {
        var self = this;
        console.log(e);
        if (self.data.isChange) {
            infomation.modifyDoorNum(self.data.room_id, self.data.id).then(res => {
                console.log(res);
                wx.showToast({
                    title: '提交成功, 请联系户主审核',
                    icon: 'none',
                    success() {
                        setTimeout(() => {
                            wx.reLaunch({
                                url: "/pages/personal/index/change-user/change-user"
                            })
                        }, 1000);
                    }
                })
            })
        } else {
            wx.showToast({
              title: '您未修改门牌号, 无法提交',
              icon: 'none'
            })
        } 
       
    },

    // 获取省级
    getPro() {
        var self = this;
        add.areas(1, 40000).then(res => {
            console.log('获取省级', res);
            self.setData({
                // proList: res.data
                province: res.data[0].title
            })
        })
    },

    // 获取市级
    getCity() {
        var self = this;
        add.areas(1, 40000, 1).then(res => {
            console.log('获取市级', res);
            self.setData({
                // cityList: res.data
                city: res.data[0].title
            })
        })
    },

    // 获取区级--沙溪镇
    getArea() {
        var self = this;
        add.areas(1, 40000, 2).then(res => {
            console.log('获取区级', res);
            self.setData({
                area: res.data[0].title
            })
        })
    },

    // 获取社区地址
    getCommunity() {
        var self = this;
        infomation.areaMag(self.data.area_id).then(res => {
            console.log('getCommunity', res);
            self.setData({
                community: res.title
            })
        })
    },

    // 获取门牌列表
    getRoom() {
        var self = this;
        add.room(1, 30000, self.data.detailedAddress_id).then(res => {
            console.log(res);
            self.setData({
                roomList: res.data
            })
        })
        infomation.gainDoorNum(self.data.room_id).then(res => {
            console.log(1, res);

            if (res) {
                self.setData({
                    room: res.door_number
                })
            }

        })
    },

    // 选择门牌号
    roomChange(e) {
        var self = this;
        console.log(e);
        
        self.setData({
            isChange: true,
            is_room: e.detail.value,
            room_id: self.data.roomList[e.detail.value].id,
            room: ''
        })
        console.log(self.data.room_id);
    },

})