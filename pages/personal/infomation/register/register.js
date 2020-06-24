const REG_ID = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
var infomation = require('../../../../model/personal/infomation');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            type: '',
            address_id: '',
            address: '',
            room_id: ''
        },
        id_card_select: '', // 身份类型选择
        identityList: [{ // 身份类型列表
            'name': '户主',
            'type': 1
        }, {
            'name': '租客',
            'type': 2
        }, {
            'name': '家庭成员',
            'type': 3
        }, {
            'name': '物业',
            'type': 4
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        var address = 'userInfo.address';
        var address_id = 'userInfo.address_id';
        var room_id = 'userInfo.room_id';

        this.setData({
            [address]: options.address
        });
    },

    subInfomation(e) {
        var self = this;
        console.log(e)

        var type = self.data.userInfo.type;
        var address = e.detail.value.address;
        var address_id = self.data.userInfo.address_id;
        var room_id = self.data.userInfo.room_id ? self.data.userInfo.room_id : 0;
        var token = wx.getStorageSync('token');
        infomation.user(token, type, address_id, address, room_id).then(res => {
            console.log(res);
            wx.showToast({
                icon: "none",
                title: '提交成功',
                success() {
                    setTimeout(function () {
                        wx.navigateTo({
                            url: '/pages/personal/index/index',
                        });
                    }, 2000);
                }
            });
            // self.setData({
            //     showSubmit: false
            // });
        })

    },

    // 验证身份证号
    regIdentity(e) {
        var self = this;
        if (!REG_ID.test(e.detail.value)) {
            wx.showToast({
                icon: "none",
                title: '请输入有效的身份证号码',
            })
        }
    },

    bindIdentityChange(e) {
        var self = this;
        var typeString = 'userInfo.typeString';
        var type = 'userInfo.type';
        var address = 'userInfo.address';
        self.setData({
            id_card_select: e.detail.value,
            // showSubmit: true,
            [type]: self.data.identityList[e.detail.value].type,
            [typeString]: self.data.identityList[e.detail.value].name,
            [address]: ''
        })
    },


    toChooseAddress() {
        wx.navigateTo({
            url: '../address/address?type=' + this.data.userInfo.type
        })
        // this.setData({
        //     showSubmit: true
        // })
    },
})