/**
 * Copyright (c) 2017-present, Liu Jinyong
 * All rights reserved.
 *
 * https://github.com/huanxsd/MeiTuan
 * @flow
 */

// System
import { Platform, StyleSheet } from 'react-native';
// import color from '../components/color';
// 正式版本:false 测试版本:true
const isSystemDebug = true;
const inner_ip = 'douyin.qipaoai.com';
const public_address = 'douyin.qipaoai.com';
const chat_dev_address = 'gpt.jiaju.dev.weilaishijieapp.com';

// StyleSheet
export default {
  isIOS: Platform.OS === 'ios',
  debug: isSystemDebug,
  // 正式版本:true 测试版本:false
  showUpdate: !isSystemDebug,
  skipSplashAd: false,
  clientVersion: '',
  version: '',
  secret: '2023KTandroidxigxc9o50cq',
  QQ: '983919764',
  // alibaba:
  url: {
    public: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },
    oauth: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },
    index: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },
    user: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },
    bill: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },

    task: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },

    api: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },

    product: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },

    captcha: {
      public: `http://${public_address}/index/captcha`,
      debug: `http://${inner_ip}/index/captcha`,
    },

    shop: {
      public: `http://${public_address}/`,
      debug: `http://${inner_ip}/`,
    },

    chat: {
      public: `ws://${public_address}/`,
      debug: `ws://${chat_dev_address}/`,
    },
  },


  //0：创建订单 1:未支付订单 2:已经支付订单 3:退款订单 4:订单已经完成 5:无效订单
  orderStatus: [
    {
      name: '创建订单',
    },
    {
      name: '未支付订单',
    },
    {
      name: '已经支付订单',
    },
    {
      name: '退款订单',
    },
    {
      name: '订单已经完成',
    },
    {
      name: '无效订单',
    },
  ],
  appName: '截客宝',
  STATES: {
    ANIMATION: {
      START: 0,
      LOOP: 1,
      STOP: 2,
      OVER: 3,
    },
  },
};
