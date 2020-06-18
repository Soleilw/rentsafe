// pages/personal/house/renter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // 查看租客详情
    renterDetail() {
        wx.navigateTo({
          url: '../renterDedail/renterDedail',
        })
    },
    // 审核
    toAudit() {
        let self = this;
        wx.showModal({
            title: '审核提示',
            content: '是否通过该租客的申请？',
            cancelText: '不通过',
            confirmText: '通过',
            success: function (res) {
                if (res.confirm) {} else if (res.cancel) {}
            }
        })
    }
})