var infomation = require('../../../../model/personal/infomation');
let name;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        renterList: [],
        detailedAddress_id: '',
        // name: '秦时明月汉时关'
        page: 1,
        isPage: false,
        showFoot: false,
        hasMore: true
    },

    onLoad(options) {
        console.log(options);

        this.setData({
            detailedAddress_id: options.detailedAddress_id
        })
        this.getAuditList()
    },

    // 获取审核列表
    getAuditList(isPage) {
        let self = this;
        wx.showLoading({
            title: '加载中...',
        })
        infomation.auditList(self.data.page, 20, wx.getStorageSync('token'), self.data.detailedAddress_id, 1, 4).then(res => {
            if (isPage) {
                //下一页的数据拼接在原有数据后面
                self.setData({
                    renterList: self.data.renterList.concat(res.data)
                })
            } else {
                //第一页数据直接赋值
                self.setData({
                    renterList: res.data
                })
            }
            //如果返回的数据为空，那么就没有下一页了
            if (res.total == 0) {
                self.setData({
                    hasMore: false,
                    showFoot: true
                })
            }
            console.log('获取审核列表', res);
            wx.hideLoading({})

        })
    },

    // 搜索
    searchName(e) {
        name = e.detail.value
    },
    search() {
        var self = this;
        infomation.search(self.data.page, 20, wx.getStorageSync('token'), self.data.detailedAddress_id, 1, 4, name).then(res => {
            console.log(res);
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
                title: '该用户身份未核验! 请耐心等待'
            })
        } else if (check == 2) {
            wx.showToast({
                icon: "none",
                title: '该用户身份信息错误! 请用户重新提交'
            })
        }


    },

    // 删除租客
    delete(e) {
        var self = this;
        var id = e.currentTarget.dataset.id;
        var check = e.currentTarget.dataset.check;
        console.log('删除租客', e);
        if (check == 0) {
            wx.showToast({
                icon: "none",
                title: '该用户身份未核验! 无法删除'
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '是否删除该租客',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        infomation.delHousehold(id, 1).then(res => {
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

    },
    scrollToLower(e) {
        if (this.data.hasMore) {
            this.setData({
                page: this.data.page + 1
            })
            this.getAuditList(true);
        }
    },
})