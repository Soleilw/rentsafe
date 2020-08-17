var infomation = require('../../../../model/personal/infomation');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        wxInfo: null,
        showFace: false
    },
    onLoad: function (options) {
        var userInfo = {
            name: options.name,
            sex: options.sex,
            card_number: options.card_number,
            phone: options.phone,
            address: options.address,
            href: options.href

        }
        this.setData({
            userInfo: userInfo
        });
        if (wx.getStorageSync('openFace') == 'open') {
            this.setData({
                showFace: true
            });
        }
    }
})