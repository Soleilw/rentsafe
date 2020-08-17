var infomation = require('../../../../model/personal/infomation');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        renterList: [],
        detailedAddress_id: '',
        typestring: ''
        // name: '秦时明月汉时关'
    },

    onLoad(options) {
        console.log(options);

        this.setData({
            detailedAddress_id: options.detailedAddress_id,
            typestring: options.typestring
        })
        this.getAuditList()
    },

    // 获取审核列表
    getAuditList() {
        let self = this;
        if (self.data.typestring == '户主') {
            infomation.auditList(wx.getStorageSync('token'), self.data.detailedAddress_id, 1, 2).then(res => {
                console.log('获取审核列表', res);
                self.setData({
                    renterList: res.data
                })
            })
        } else if (self.data.typestring == '物业') {
            infomation.auditList(wx.getStorageSync('token'), self.data.detailedAddress_id, 4, 2).then(res => {
                console.log('获取审核列表', res);
                self.setData({
                    renterList: res.data
                })
            })
        }
        
    },

    // 查看租客详情
    renterDetail(e) {
        console.log(e)
        var self = this
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
        console.log('审核', id);

        wx.showModal({
            title: '审核提示',
            content: '是否通过该租客的申请？',
            cancelText: '不通过',
            confirmText: '通过',
            success: function (res) {
                if (self.data.typestring == '户主') {
                    if (res.confirm) {
                        infomation.audit(wx.getStorageSync('token'), id, 2, 1).then(res => {
                            wx.showToast({
                                icon: "none",
                                title: '提交成功'
                            })
                            self.getAuditList();
                        })
                    } else if (res.cancel) {
                        infomation.audit(wx.getStorageSync('token'), id, 3, 1).then(res => {
                            wx.showToast({
                                icon: "none",
                                title: '提交成功'
                            })
                            self.getAuditList();
                        })
                    }
                } else if (self.data.typestring == '物业') {
                    if (res.confirm) {
                        infomation.audit(wx.getStorageSync('token'), id, 2, 4).then(res => {
                            wx.showToast({
                                icon: "none",
                                title: '提交成功'
                            })
                            self.getAuditList();
                        })
                    } else if (res.cancel) {
                        infomation.audit(wx.getStorageSync('token'), id, 3, 4).then(res => {
                            wx.showToast({
                                icon: "none",
                                title: '提交成功'
                            })
                            self.getAuditList();
                        })
                    }
                }
                
            }
        })
    },

    // 删除租客
    delete(e) {
        var self = this;
        var id = e.currentTarget.dataset.id;
        console.log('删除租客', id);
        wx.showModal({
            title: '提示',
            content: '是否删除该租客',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    infomation.delHousehold(id).then(res => {
                        wx.showToast({
                            icon: "none",
                            title: '删除成功'
                        });
                        self.getAuditList();
                    })

                } else if (res.cancel) {
                    console.log('用户点击取消');
                    wx.showToast({
                        icon: "none",
                        title: '取消成功'
                    });
                }
            }
        })

    }
})