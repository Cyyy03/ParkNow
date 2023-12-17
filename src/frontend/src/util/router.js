// export default {
//   APIS: {
//     OAUTH: {
//       LOGIN: '/oauth/login',
//       REGISTER: '/oauth/register',
//       WECHAT_LOGIN: '/oauth/wechatLogin',
//     },
//   },

//   // USER: 'user_data',
//   // TOKEN: 'user_token',
//   // SYSTEM: 'system_config',
//   // USER_CONFIG: 'user_config',
// };

/**
 * Copyright (c) 2017-present, Liu Jinyong
 * All rights reserved.
 *
 * https://github.com/huanxsd/MeiTuan
 * @flow
 */

// System

// Route::post('/user/getUserInfo', [UserController::class, 'getUserInfo']);
// Route::post('/user/list_user_power', [UserController::class, 'list_user_power']);
// Route::post('/user/getNotifySystem', [UserController::class, 'getNotifySystem']);

// Route::post('/user/list_user_integral', [UserController::class, 'list_user_integral']);
// Route::post('/user/clearAccount', [UserController::class, 'clearAccount']);

// Route::post('/user/changeLoginPassword', [UserController::class, 'changeLoginPassword']);
// Route::post('/user/authUser', [UserController::class, 'authUser']);

// Route::post('/user/list_user_order', [UserController::class, 'list_user_order']);
// Route::post('/user/readNotifySystem', [UserController::class, 'readNotifySystem']);

// Route::post('/user/real_authentication', [UserController::class, 'real_authentication']);
// Route::post('/user/listUserMessage', [UserController::class, 'listUserMessage']);

// Route::post('/user/bindAlipay', [UserController::class, 'bindAlipay']);
// Route::post('/user/settlementMoney', [UserController::class, 'settlementMoney']);

// Route::post('/user/getUserTeams', [UserController::class, 'getUserTeams']);
// Route::post('/user/changeSecurityPassword', [UserController::class, 'changeSecurityPassword']);

// Route::post('/user/changeTradePassword', [UserController::class, 'changeTradePassword']);
// Route::post('/user/updatePassword', [UserController::class, 'updatePassword']);

// // Product

// Route::post('/product/search', [ProductController::class, 'search']);
// Route::post('/product/info', [ProductController::class, 'info']);

// Route::post('/product/findOrder', [ProductController::class, 'findOrder']);
// Route::post('/product/orderDetail', [ProductController::class, 'orderDetail']);

// Route::post('/product/orderList', [ProductController::class, 'orderList']);

export default {
  OAUTH: {
    LOGIN: 'oauth/login',
    REGISTER: 'oauth/register',
    WECHAT_LOGIN: 'oauth/wechatLogin',
    CHECK_USER_DATA: 'oauth/checkUserData',
  },
  PRODUCT: {
    FIND_ORDER: 'api/product/findOrder',
    GET_QUICK_LINK: 'api/product/getQuickLink',
    GET_MEITUAN_LINK: 'api/product/getMeituanSmartLink',
    GET_MEITUAN_SHOPS: 'api/product/getMeituanTakeouts',
    // getMeituanSmartLink
  },
  AD: {
    INIT_AD: 'api/ad/initAd',
    CREATE_AD_LOG: 'api/ad/createAdLog',
  },

  VIDEO: {
    // INIT_AD: 'api/video/initAd',
    CREATE_VIDEO_LOG: 'api/video/createVideoLog',
  },
  USER: {
    GET_USER_INFO: 'api/user/getUserInfo',
    GET_NOTIFY_SYSTEM_MESSAGE: 'api/user/getNotifySystem',
    LIST_USER_POWER: 'api/user/listUserPower',
    LIST_USER_INTEGRAL: 'api/user/listUserIntegral',
    CLEAR_ACCOUNT: 'api/user/clearAccount',
    CHANGE_LOGIN_PASSWORD: 'api/user/changeLoginPassword',
    LIST_USER_ORDER: 'api/user/listUserOrder',
    REAL_AUTHENTICATION: 'api/user/realAuthentication',
    UPDATE_PASSWORD: 'api/user/updatePassword',
    CHANGE_TRADE_PASSWORD: 'api/user/changeTradePassword',
    CHANGE_SECURITY_PASSWORD: 'api/user/changeSecurityPassword',
    DO_NEWUSER_TASK: 'api/user/doNewUserTask',
    DO_NEWUSER_REWARD: 'api/user/doNewUserReward',
    UPDATE_WECHAT: 'api/user/updateWechat',

    CHECK_USER_ACCESS: "api/user/checkUserAccess",

    BIND_ALIPAY: 'api/user/bindAlipay',
    SETTLEMENT_MONEY: 'api/user/settlementMoney',
    GET_USER_TEAMS: 'api/user/getUserTeams',
    GET_USER_POWER: 'api/user/list_user_power',
    GET_USER_INTEGRAL: 'api/user/list_user_integral',
    GET_USER_MESSAGE: 'api/user/listUserMessage',

  },
  TASK: {
    RUN_PROP_TASK: 'api/task/runPropTask',
    RUN_TASK: 'api/task/runTask',
  },
  CHAT: {
    CABLE: 'chat/cable',

  }
};
