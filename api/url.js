const url = {
    'Login': '/login', // 手机号授权登录
    'UserInfo': '/user/info', // 后台获取个人用户信息
    'Face': '/face', //上传人脸图像
    'Configs': '/configs', // 图像开关配置


    // 个人信息
    'Household': '/household', // post提交个人信息,get获取个人信息
    'MyHouseholds': '/my/households', // post提交个人信息,get获取个人信息

    'Households': '/households', // 获取审核列表
    'CheckHousehold': '/check/household', // 审核租客




    // 获取地址
    'Addresses': '/addresses', // 获取出租屋列表
    'Areas': '/areas', // 获取地址列表
    'Rooms': '/rooms', // 门牌号

    // 轮播图
    "Banner": '/banners', // 获取轮播图

    // 获取资讯类型
    "DocumentType": '/document/type', // 获取资讯类型
    "Documents": '/documents', // 获取资讯
    "DocsDetails": '/document' // 获取资讯详情

};

module.exports = url;