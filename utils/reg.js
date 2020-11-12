let reg = {};

// 验证身份证
reg.IDCard = function (idCard) {
    // ^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$ // 15位
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
// 港澳身份验证
reg.HK = function (idCard) {
    // 港澳居民来往内地通行证
    // 规则： H/M + 10位或6位数字
    // 样本： H1234567890
    var reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/;
    if (reg.test(idCard)) {
        return true;
    } else {
        wx.showToast({
            icon: "none",
            title: '请输入有效的身份证号码'
        })
    }
}

reg.foreign = function (idCard) {
    var reg = /^[A-Z]{3}\d{6}(?:0[1-9]|1[021])(?:0[1-9]|[21]\d|3[10])\d{2}$/;
    if (reg.test(idCard)) {
        return true
    } else {
        wx.showToast({
            icon: "none",
            title: '请输入有效的身份证号码'
        })
    }
}

reg.passport = function (idCard) {
    var reg = /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/;
    if (reg.test(idCard)) {
        return true
    } else {
        wx.showToast({
            icon: "none",
            title: '请输入有效的护照'
        })
    }
}

module.exports = reg;