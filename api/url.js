const url = {
    'Login': '/login', // 手机号授权登录
    'UserInfo': '/user/info', // 后台获取个人用户信息
    'Face': '/face', //上传人脸图像
    'Configs': '/configs', // 图像开关配置

    // 个人信息
    'Household': '/household', // post提交个人信息,get获取个人信息
    'MyHouseholds': '/my/households', // post提交个人信息,get获取个人信息
    'UserMandate': '/is/user/mandate', // 是否授权

    'Households': '/households', // 获取审核列表
    'CheckHousehold': '/check/household', // 审核租客
    'DelHousehold': '/household', // 删除租客



    // 获取地址
    'Addresses': '/addresses', // 获取出租屋列表
    'Areas': '/areas', // 获取地址列表
    'Rooms': '/rooms', // 门牌号
    "UserAreas": '/user/areas', // 获取用户社区
    "Child": '/household/child', // 添加孩子
    "Room": '/room', // 获取/修改门牌号
    "AreasMsg": '/areas/message', // 获取所在社区

    // 轮播图
    "Banner": '/banners', // 获取轮播图

    // 获取资讯类型
    "DocumentType": '/document/type', // 获取资讯类型
    "Documents": '/documents', // 获取资讯
    "DocsDetails": '/document', // 获取资讯详情
    "DocsList": '/help/docs', // 获取资讯列表

    // 购买
    "Buys": '/products', // 获取服务
    "UserServes": '/user/serves', // 获取开通的服务
    "Renew": '/product/renew', // 续费提示
    "Order": '/product/order', // 创建订单
    "Buy": '/buy/product', // 支付
    "CancelBuy": '/pay/cancel', // 取消支付
    "Orders": '/orders', // 获取服务订单列表
    "ServerUser": '/serve/user', // 已购买服务列表
    "AuthList": '/mandate/user', // 授权列表

    // 一键开门
    "AllowOpen": '/allow/open', // 允许开门
    "OpenDoor": '/open/door', // 一键开门
    "AddressDevices": '/address/devices', // 地址设备列表

    // 访客
    "AddrressUser": '/address/user', // 获取出租屋用户
    "Visitor": '/visitor', // 新增访客
    "Visitors": '/visitors', // 获取用户访客
    "CheckVisitor": '/check/visitor', // 审核访客
    "PassCode": '/create/pass/code', // 访客码

    // 修改
    "Amend": '/user/info/household', // 修改个人信息
    
    // 判断家庭成员
    "FamilyType": '/exist',

    "UserRegister": '/is/user/register', // 是否有新用户

    "PostList": '/post/lists', // 是否有新用户

    "IssueRent": '/creation/message/issue', // 发布出租屋
    "IssueUserList": '/user/message/issues', // 获取个人招租列表--户主
    "DelIssue": '/del/message/issue', // 删除
    "IssueList": '/message/issues', // 获取招租列表
    "MsgDetail": '/message/issue', // 获取招租列表详情
    
};

module.exports = url;