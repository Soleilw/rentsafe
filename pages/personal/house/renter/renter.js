var infomation = require('../../../../model/personal/infomation');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        renterList: []
    },

    onLoad() {
        this.getAuditList()
    },

    // 获取审核列表
    getAuditList() {
        let self = this;
        infomation.auditList(wx.getStorageSync('token')).then(res => {
            self.setData({
                renterList: res.data
            })
        })
    },

    // 查看租客详情
    renterDetail(e) {
        console.log(e)
        var name = e.currentTarget.dataset.name;
        var sex = e.currentTarget.dataset.sex;
        var card_number = e.currentTarget.dataset.card_number;
        var phone = e.currentTarget.dataset.phone;
        var address = e.currentTarget.dataset.address;
        var href = e.currentTarget.dataset.href;

        wx.navigateTo({
          url: '../renterDedail/renterDedail?name=' + name + '&sex=' + sex + '&card_number=' + card_number + '&phone=' + phone + '&address=' + address + '&href=' + href,
        })
    },
    // 审核
    toAudit(e) {
        let self = this;
        var id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '审核提示',
            content: '是否通过该租客的申请？',
            cancelText: '不通过',
            confirmText: '通过',
            success: function (res) {
                if (res.confirm) {
                    infomation.audit(wx.getStorageSync('token'), id, 2).then(res => {
                        wx.showToast({
                            icon: "none",
                            title: '提交成功'
                        })
                        self.getAuditList();
                    })
                } else if (res.cancel) {
                    infomation.audit(wx.getStorageSync('token'), id, 3).then(res => {
                        wx.showToast({
                            icon: "none",
                            title: '提交成功'
                        })
                        self.getAuditList();
                    })
                }
            }
        })
    }
})