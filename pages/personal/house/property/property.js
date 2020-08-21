var infomation = require('../../../../model/personal/infomation');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        renterList: [],
        detailedAddress_id: '',
        // name: '秦时明月汉时关'
    },

    onLoad(options) {
        console.log(options);

        this.setData({
            detailedAddress_id: options.detailedAddress_id
        })
        this.getAuditList()
    },

    // 获取审核列表
    getAuditList() {
        let self = this;
        infomation.auditList(wx.getStorageSync('token'), self.data.detailedAddress_id, 1, 4).then(res => {
            console.log('获取审核列表', res);

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
        var check = e.currentTarget.dataset.check;
        
        console.log('审核', id);

        if (check == 1) {
            wx.showModal({
                title: '审核提示',
                content: '是否通过该租客的申请？',
                cancelText: '不通过',
                confirmText: '通过',
                success: function (res) {
                    if (res.confirm) {
                        infomation.audit(wx.getStorageSync('token'), id, 2, 1, 1).then(res => {
                            wx.showToast({
                                icon: "none",
                                title: '提交成功'
                            })
                            self.getAuditList();
                        }).catch(err => {
                            if (err.code == 10002) {
                                wx.showToast({
                                    icon: "none",
                                    title: '身份核验失败!'
                                })
                            }
                        })
                    } else if (res.cancel) {
                        infomation.audit(wx.getStorageSync('token'), id, 3, 1, 1).then(res => {
                            wx.showToast({
                                icon: "none",
                                title: '提交成功'
                            })
                            self.getAuditList();
                        })
                    }
                }
            })
        } else if (check == 0) {
            wx.showToast({
                icon: "none",
                title: '该用户身份未核验, 不能审核'
            })
        } else if (check == 2) {
            wx.showToast({
                icon: "none",
                title: '该用户身份信息错误, 不能审核'
            })
        }

        
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