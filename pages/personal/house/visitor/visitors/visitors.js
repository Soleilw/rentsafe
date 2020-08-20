var infomation = require('../../../../../model/personal/infomation');

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
        console.log(options);
        
        var userInfo = {
            name: options.name,
            phone: options.phone,
            href: options.href,
            checkDate: options.checkDate
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