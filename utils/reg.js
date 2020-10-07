let reg = {};

// 验证身份证
reg.IDCard = function(idCard) {
    var regIdCard =
        /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10,
                5, 8, 4, 2);
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2);
            var idCardWiSum = 0;
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
            }
            var idCardMod = idCardWiSum % 11;
            var idCardLast = idCard.substring(17);
            if (idCardMod == 2) {
                if (idCardLast == "X" || idCardLast == "x") {
                    return true;
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '身份证号码错误！'
                    })
                    return false;
                }
            } else {
                if (idCardLast == idCardY[idCardMod]) {
                    return true;
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '身份证号码错误！'
                    })
                    return false;
                }
            }
        } else {
            return true;
        }
    } else {
        wx.showToast({
            icon: "none",
            title: '请输入有效的身份证号码'
        })
    }
}

// 验证手机号
reg.phone = function (phone) {
    let reg_phone = /^(\+)?(0|86|17951)?1(3\d|4[579]|5\d|6\d|7\d|8\d|9\d)\d{8}$/;
    if (reg_phone.test(phone)) {
        return true;
    } else {
        return false;
    }
}

module.exports = reg;