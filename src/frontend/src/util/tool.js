import stripAnsi from 'strip-ansi';
import isFullwidthCodePoint from 'is-fullwidth-code-point';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { union, get, set, range, random, orderBy } from 'lodash';
// import { get } from 'lodash';
import { CACHE, system } from '.';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import { NativeModules, Alert } from 'react-native';
// import {}
import NetInfo from '@react-native-community/netinfo';
import { ErrorCode } from '.';
import { LOGOUT_SUCCESS } from '../actions/auth/actiontypes';
import { BACK_LOGIN } from '../actions/index/actiontypes';
import * as RootNavigation from '../scenes/RootNavigation';
import Sound from 'react-native-sound';
import CryptoJS, { MD5 } from 'crypto-js';
import { ToastAndroid } from 'react-native';
import uuid from 'react-native-uuid';

const { Init } = NativeModules;

const AlibabaNativeModule = NativeModules.Alibaba;

/**
 * Copyright (c) 2017-present, Liu Jinyong
 * All rights reserved.
 *
 * https://github.com/huanxsd/MeiTuan
 * @flow
 */

export function signArrayToMutlip(baseArray, n) {
  // let baseArray = [1, 2, 3, 4, 5, 6, 7, 8];
  let len = baseArray.length;
  // let n = 4; //假设每行显示4个
  let lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1);
  let res = [];
  for (let i = 0; i < lineNum; i++) {
    // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
    res.push(baseArray.slice(i * n, i * n + n));
  }
  return res;
}

export function strtotime(date) {
  // let baseArray = [1, 2, 3, 4, 5, 6, 7, 8];
  // var date = '2015-03-05 17:59:00';
  date = date.substring(0, 19);
  date = date.replace(/-/g, '/');
  return new Date(date);
}

export function getCaptchaUrl(code) {
  const apis = system.url.captcha;
  // const code = random(100, 300);
  const url = system.debug ? `${apis.debug}?c=${code}` : `${apis.public}?c=${code}`;
  console.log('url', system.debug, `${apis.public}?c=${code}`);
  return url;
}

export function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function rand(min, max) {
  const randNumber = parseInt(Math.random() * (max - min + 1) + min, 10);
  return randNumber ? randNumber : min;
}

export function getAppResourceVersion() {
  // let baseArray = [1, 2, 3, 4, 5, 6, 7, 8];

  return new Promise((resolve, reject) => {
    try {
      // responseNoticeMessage('???? ====', 100);

      Init.getResourcesVersion((d) => {
        resolve(d);
      });
      // resolve("10000");
    } catch (e) {
      reject(0);
    }
  });
}

export function getHideTruename(truename) {
  let truenames = [];
  if (truename) {
    truenames = truename.split('');
    truename = truenames && truenames.length > 0 && truenames.pop();
  }
  return `  ${truenames.fill('*').join('')}${truename}`;
}

export function getHideAccount(account) {
  let accounts = [];
  if (account) {
    accounts = account.split('');
    account = accounts && accounts.length > 0 && accounts.pop();
  }
  return `  ${accounts.fill('*').join('')}${account}`;
}

export function getAppVersion() {
  // let baseArray = [1, 2, 3, 4, 5, 6, 7, 8];

  return new Promise((resolve, reject) => {
    try {
      // responseNoticeMessage('???? ====', 100);

      Init.getAppVersion((d) => {
        resolve(d);
      });
      // resolve("10000");
    } catch (e) {
      reject(0);
    }
  });
}

export function randArray(array) {
  if (!array || array.length === 0) {
    return null;
  }
  let index = rand(1, array.length);
  return array[index - 1];
}

export const formatContent = (str) => {
  str = str.replace(/^"/, '“').replace(/"$/, '”');
  str = str.replace(/^'/, '‘').replace(/'$/, '’');
  return str;
};

export const isEmptyObj = (obj) => {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return true;
};

export const isUpper = (code) => {
  return /[A-Z]/.test(code);
};

export const isLower = (code) => {
  return /[a-z]/.test(code);
};

export const isLorI = (code) => {
  return /l|i|I/.test(code);
};

export const isThinCode = (code) => {
  return /f|t|r/.test(code);
};

// Computed the width of string
export const stringWidth = (str) => {
  if (typeof str !== 'string' || str.length === 0) {
    return 0;
  }

  // These numbers represent these `“” ——(8213)`
  const stringMap = {
    8213: 2,
    8220: 1,
    8221: 1,
  };

  let width = 0;

  const stripAnsiStr = stripAnsi(str);

  const code = stripAnsiStr.charCodeAt(0);

  /*
   * 1. Returns the corresponding value in stringMap when the string is  ``“”——`
   * 2. The width is 2    when the string is full width, they are usually words and symbols
   * 3. The width is 0.5  when the string is `L `or `I` or `i`
   * 4. The width is 0.80 when the string is thin code, like `f, t, r`
   * 5. The width is 1.05 when the string is lower word
   * 6. The width is 1.5  when the string is upper words or number
   * 7. The Others width is 0.5
   */

  if (stringMap[code]) {
    return stringMap[code];
  } else if (isFullwidthCodePoint(code)) {
    width = 2;
  } else if (isLorI(stripAnsiStr)) {
    width = 0.5;
  } else if (isThinCode(stripAnsiStr)) {
    width = 0.8;
  } else if (isLower(stripAnsiStr)) {
    width = 1.05;
  } else if (isUpper(stripAnsiStr) || Number(stripAnsiStr) !== NaN) {
    width = 1.5;
  } else {
    width = 0.5;
  }

  return width;
};

export const isEvenNumber = (number) => {
  return number % 2 === 0;
};

export const formatMobile = (mobile) => {
  return mobile.length === 11 ? mobile.substr(0, 3) + '****' + mobile.substr(7, 4) : mobile;
};

export const compareVersion = (version1, version2) => {
  const newVersion1 = `${version1}`.split('.').length < 3 ? `${version1}`.concat('.0') : `${version1}`;
  const newVersion2 = `${version2}`.split('.').length < 3 ? `${version2}`.concat('.0') : `${version2}`;
  //计算版本号大小,转化大小
  function toNum(a) {
    const c = a.toString().split('.');
    const num_place = ['', '0', '00', '000', '0000'],
      r = num_place.reverse();
    for (let i = 0; i < c.length; i++) {
      const len = c[i].length;
      c[i] = r[len] + c[i];
    }
    return c.join('');
  }

  //检测版本号是否需要更新
  function checkPlugin(a, b) {
    const numA = toNum(a);
    const numB = toNum(b);
    return numA > numB ? 1 : numA < numB ? -1 : 0;
  }
  return checkPlugin(newVersion1, newVersion2);
};

export const getNumbersOfLinesPerPages = (height, fontSize) => {
  let windowHeight = height;
  const paddingVertical = 40;
  windowHeight -= paddingVertical * 2;
  const lineHeight = fontSize + 15;
  return Math.floor(windowHeight / lineHeight);
};

export const asyncSaveData = async (key, value, cached_time = 0, callback) => {
  let cached_object = {
    key,
    value,
    expire_time: new Date().getTime() / 1000 + cached_time,
    cached_time,
  };
  await AsyncStorage.setItem(key, JSON.stringify(cached_object), callback);
};

export const asyncRemoveData = async (key, callback) => {

  try {
    await AsyncStorage.removeItem(key, (err) => console.log('error : ' + err));
    console.log('logged out!');
    callback();
    // this.props.navigation.navigate('main');
  } catch (err) {
    console.log('AsyncStorage error: ' + err.message);
  }
};

export function getDeviceInfo() {
  // let baseArray = [1, 2, 3, 4, 5, 6, 7, 8];

  return new Promise((resolve, reject) => {
    try {
      // responseNoticeMessage('???? ====', 100);

      Init.getDeviceInfo((d) => {
        resolve(d);
        // responseErrorMessage(JSON.stringify({ d }));
      });
      // resolve("10000");
    } catch (e) {
      reject(0);
    }
  });
}

// Init.getDeviceInfo((res) => {
//   // console.warn(res);
//   // resetErrorHandler(JSON.stringify({ res }));
//   responseErrorMessage(JSON.stringify({ res }));
// });

export const filterUrl = (url, $type = '') => {
  return $type === '//' ? url.replace(/(http:\/\/|https:\/\/)/, '//') : url.replace(/(http:|https:)/, '');
};

export const navigationScreen = (userInfo, navigation, isNeedJump = false) => {
  const step = get(userInfo, 'step', 1);
  const status = get(userInfo, 'status', 0);
  const user_id = get(userInfo, 'id', 0);
  if (step !== 2 || status !== 0 || user_id === 0) {
    navigation.navigate('LoginScreen');
    return;
  }
  if (isNeedJump) {
    // responseErrorMessage('HomeScreen 123123');
    navigation.navigate('HomeScreen');
  }
};

export const getShareImage = (page, code) => {
  // return `/user/shareImage?page=${page}&code=${code}`;
  return `${system.debug ? system.url.public.debug : system.url.public.public
    }user/shareImage?page=${page}&code=${code}&t=20221002`;
  // ${Math.random()}
};

export const getShareUrl = (code) => {
  // return `/user/shareImage?page=${page}&code=${code}`;
  return `${system.debug ? system.url.public.debug : system.url.public.public
    }user/registerH5/?shareCode=${code}&t=20221002`;
  // ${Math.random()}
};

export const asyncLoadData = async (key) => {
  let data = await AsyncStorage.getItem(key);
  // console.log('asyncLoadData key----', key, data);
  if (data == null) {
    return null;
  }
  let currentTime = new Date().getTime() / 1000;
  try {
    data = JSON.parse(data);
  } catch (error) { }
  if (data.cached_time === 0) {
    return data.value;
  }
  if (currentTime > data.expire_time) {
    return null;
  }
  return data.value;
};

export const saveSeatchKeywords = (keyword, keywords = []) => {
  keywords.push(keyword);
  return union(keywords);
};

// export const RequestPOST = async (url, apis, params, errorBack) => {
//   console.log('url, apis', url, apis, params);
//   try {
//     return await fetch(url, apis);
//   } catch (error) {
//     console.log('error', error, params, url);
//     // responseErrorMessage(JSON.stringify(error) + ',' + (system.debug ? JSON.stringify({ url, apis }) : ''));
//     errorSystemHandler({ params, url, error });
//     // responseErrorMessage(JSON.stringify(error));

//     errorBack && errorBack({ data: {}, message: '服务器错误' });
//   }
// };

export const checkErrorPage = async (navigation, code) => {
  if (code === ErrorCode.USER_NO_USER) {
    navigation.navigate('LoginoutScreen');
    return false;
  }
  return true;
};

export const base64Encode = (str) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
};


export const getUUid = () => {
  return uuid.v4();
};

// import uuid from 'react-native-uuid';
// {global.clientVersion}:{global.resourceVersion}
export const RequestPOST = async (
  url,
  apis,
  params,
  errorBack,
  isEncryption = false,
  token = null,
  dispatch = null,
  deviceId = null,
) => {
  // LOGOUT_SUCCESS
  // LOGOUT_SUCCESS
  console.log('url, apis RequestPOST', url, apis, params);
  const { debug, clientVersion, resourceVersion } = system;
  // const { debug, clientVersion,  } = system;
  const checkStatus = async (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const responseText = await response.text();
    const alertButtons = [
      {
        text: '确定',
        onPress: () => { },
        style: 'default',
      },
    ];
    if (debug) {
      // params, url
      let errorMessage = `
      url:\n${url},
      params:\n${JSON.stringify(params)},
      返回错误请求:\n${responseText}
      `;
      alertButtons.push({
        text: '查看错误详情',
        onPress: () => {
          Alert.alert('错误详情', errorMessage);
        },
      });
    }
    Alert.alert('温馨提示', '服务器出点小问题', alertButtons);
    if (debug) {
      console.log('response.statusText', response.statusText);
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
  const localStorage = {};
  const deafultHeader = {
    clientVersion,
    resourceVersion,
    dataToken: createSecretToken(params),
    platform: system.isIOS ? 'ios' : 'android',
    deviceId: deviceId ? base64Encode(deviceId) : '',
  };
  let responseText = '';
  if (token) {
    try {
      return await fetch(url, {
        ...apis,
        ...{
          headers: {
            // 'Content-Type': 'application/json',
            // Accept: 'application/json',
            // platform: system.isIOS ? 'ios' : 'android',
            Authorization: 'Bearer ' + token,
            ...deafultHeader,
          },
        },
        ...{ credentials: 'include' },
      })
        .then(checkStatus)
        .then(async (response) => {
          console.log('response', response);
          responseText = await response.text();
          if (debug) {
            // console.log('[debug:] responseText==', responseText);
          }
          // responseErrorMessage(JSON.stringify({ responseText }));
          const responseData = JSON.parse(responseText);
          const code = get(responseData, 'code', 0);
          const message = get(responseData, 'message', 0);
          // ErrorCode.USER_NO_USER
          if (code === ErrorCode.USER_JWT_ERROR) {
            if (message !== '') {
              responseErrorMessage(message);
            }
            if (dispatch) {
              dispatch({ type: LOGOUT_SUCCESS });
            }

            RootNavigation.navigate('LoginoutScreen');
            // throw { errorCode: code, errorMessage: '你的登录异常,请重新登录' };
          }
          return responseData;
        });
    } catch (error) {
      console.log('----', JSON.stringify(error));
      console.log('error', { params, url, error, responseText });

      if (debug) {
        // errorSystemHandler({ params, url, error });
      }

      // errorBack && errorBack({ data: {}, message: '服务器错误' });
    }
  } else {
    try {
      return await fetch(url, {
        ...apis,
        ...{
          headers: {
            ...deafultHeader,
          },
        },
        ...{ credentials: 'include' },
      })
        .then(checkStatus)
        .then(async (response) => {
          console.log('response', response);
          responseText = await response.text();
          // responseErrorMessage(JSON.stringify({ responseText }));

          const responseData = JSON.parse(responseText);
          // console.warn(responseData);
          const code = get(responseData, 'code', 0);
          if (code === ErrorCode.USER_JWT_ERROR) {
            // responseErrorMessage('你的登录异常,请重新登录');
            dispatch({ type: LOGOUT_SUCCESS });
            RootNavigation.navigate('LoginoutScreen');
            // throw { errorCode: code, errorMessage: '你的登录异常,请重新登录' };
          }

          if (debug) {
            // console.log('check debug responseText==', responseText);
          }
          return JSON.parse(responseText);
        });
    } catch (error) {
      console.log('----', JSON.stringify(error));
      console.log('error', { params, url, error });
      // responseErrorMessage(JSON.stringify({ responseText }));

      if (debug) {
        // errorSystemHandler({ params, url, error });
      }

      // errorBack && errorBack({ data: {}, message: '服务器错误' });
    }
  }
};

// ConvertScreen

export const getH5Url = (url) => {
  // url: system.debug
  //                           ? 'http://app.dev.weilaishijieapp.com/phone.html?pr_cate_id=0'
  //                           : 'http://app.weilaishijieapp.com/phone.html?pr_cate_id=0',
  return system.debug ? 'http://app.dev.weilaishijieapp.com' + url : 'http://app.weilaishijieapp.com' + url;
};

export const toThousands = (num) => {
  var result = [],
    counter = 0;
  num = (num || 0).toString().split('');
  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(num[i]);
    if (!(counter % 3) && i !== 0) {
      result.unshift(',');
    }
  }
  return result.join('');
};

export const getRNModule = (name) => {
  const modules = {
    init: NativeModules.Init,
  };
  return modules[name];
};

export const checkMiddleError = (responseData) => {
  const code = get(responseData, 'code', 0);
  // ErrorCode.USER_NO_USER
  if (code === ErrorCode.USER_JWT_ERROR) {
    return true;
  }
  return false;
};

export const createSecretToken = (params) => {
  // return num > 10000 ? `${Math.round(num / 10000)}万` : num;
  const secret = system.secret;
  const keys = Object.keys(params).sort();
  // const
  // const params
  // orderBy
  let str = '';
  for (let i = 0; i < keys.length; i++) {
    str += `${keys[i]}=${params[keys[i]]}&`;
  }
  str += `key=${secret}`;
  str = encodeURI(str);
  // return MD5(str);
  return CryptoJS.MD5(str).toString().toUpperCase();
};

export const formatNumber = (num) => {
  return num > 10000 ? `${Math.round(num / 10000)}万` : num;
};

export const toDecimal = (number, len = 2) => {
  var f = parseFloat(number);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(number * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + len) {
    s += '0';
  }
  return s;
};

export const filterProductData = (data) => {
  const items = [];
  let obj = { id: Math.random(), data: [] };
  data.forEach((element) => {
    obj.data.push(element);
    if (obj.data.length === 2) {
      items.push(obj);
      obj = { id: Math.random(), data: [] };
    }
  });
  if (data.length % 2 !== 0) {
    items.push(obj);
  }
  return items;
};

export const filterTwoRows = (data) => {
  const items = [];
  let obj = { id: Math.random(), data: [] };
  data.forEach((element) => {
    obj.data.push(element);
    if (obj.data.length === 2) {
      items.push(obj);
      obj = { id: Math.random(), data: [] };
    }
  });
  if (data.length % 2 !== 0) {
    items.push(obj);
  }
  return items;
};

export const UploadOSS = async (pre, fileName, uri) => {
  // const OSS = require('ali-oss');
  // const bucket = system.openApi.alibaba.bucket;
  // const region = 'oss-cn-beijing';
  // const { Buffer } = OSS;
  // var client = new OSS({
  //   region,
  //   accessKeyId: system.openApi.alibaba.AccessKeyID,
  //   accessKeySecret: system.openApi.alibaba.AccessKeySecret,
  //   bucket,
  // });
  // const file_name = `${pre}-${fileName}`;
  // const fold_name = moment().format('YYYY-MM-DD');
  // AlibabaNativeModule.asyncUpload('worldapp-images', `${fold_name}/${file_name}`, uri)
  //   .then((res) => {
  //     responseNoticeMessage('上传成功');
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     responseNoticeMessage('上传失败');
  //     // responseNoticeMessage('error');
  //     console.log(err);
  //   });
};

export const getItemId = (item_id) => {
  return (item_id + '').substring(2);
};

export const showLoading = (show) => {
  // return (item_id + '').substring(2);
};

export const getOrderType = (item) => {
  let order_type = 0;
  switch (item.order_type) {
    case 'taobao':
      order_type = 0;
      break;
    case 'jd':
      order_type = 2;
      break;

    case 'tiktok':
      order_type = 3;
      break;
    case 'meituan':
      order_type = 4;
      break;

    default:
      break;
  }
  return order_type;
};

export const getTaobaoCode = (taobaocode) => {
  let response = '';
  if (taobaocode && taobaocode !== '') {
    let code = JSON.parse(taobaocode);
    response = code.model;
  }
  const code = response.match(/[0-9A-Za-z\s]{4,20}/);
  return `1fu致.${code && code.length > 0 ? code[0] : response}/🍑𝙩a𝙤宝/`;
};

export const getImages = (item) => {
  const small_images = get(item, 'small_images', '');
  if (small_images === '') {
    return [];
  }

  return JSON.parse(small_images);
};

export const getShareComments = (item) => {
  let html = '';
  if (item.source === 'alibaba') {
    html += `淘口令:\n ${getTaobaoCode(item.taobao_code)}`;
  }
  return html;
};

export const getTiktokCode = (tiktokCode = '') => {
  const code = tiktokCode.match(/[0-9A-Za-z\s]{4,20}/);
  const tikCode = `${code && code.length > 0 ? code[0] : ''}`;
  const shareText = ` ${rand(1, 9)}:/##${tikCode}##  \n`;
  return shareText;
};

export const getShareTextContent = (
  shareText,
  item,
  check1 = false,
  check2 = false,
  check3 = false,
  tiktokCode = '',
  invite_code = '',
) => {
  let html = shareText;
  if (check1) {
    if (item.source === 'tiktok') {
      html += ` ${tiktokCode !== '' ? getTiktokCode(tiktokCode) : ''}  \n`;
    }
    if (item.source === 'alibaba') {
      // currentShareTaoBaocode = ` ${getTaobaoCode(item.taobao_code)}`;

      html += ` [淘口令:] ${item.taobao_code !== '' ? getTaobaoCode(item.taobao_code) : ''}  \n`;
    }
  }
  if (check2) {
    html += `[邀请码:] ${invite_code !== '' ? invite_code : ''}  \n`;
  }
  // html += tiktokCode !== '' ? `【口令】 ${rand(1, 9)}:/##${getTiktokCode(tiktokCode)}##  \n` : '';
  // `[口令:] ${tiktokCode}`
  // html += ' 1fu致.( CZ3457 vmUFdZekxVO/🍑𝙩a𝙤宝/  \n';

  return html;
};

export const getShareText = (
  item,
  check1 = false,
  check2 = false,
  check3 = false,
  tiktokCode = '',
  invite_code = '',
  text = '',
) => {
  let html = '';
  if (text === '') {
    html += ` ${item.title} 你可以立马减少折扣 \n `;
    html += `【原价】${item.zk_final_price} \n`;
    html += `【券后】 ${item.zk_final_price - item.coupon_amount} \n`;
    html += `【下载链接】 ${system.downloadUrl}  \n`;
  } else {
    html += ` ${text}  \n`;
  }

  // responseErrorMessage(JSON.stringify({ d: item.source }));
  if (check1) {
    if (item.source === 'tiktok') {
      html += ` ${tiktokCode !== '' ? getTiktokCode(tiktokCode) : ''}  \n`;
    }
    if (item.source === 'alibaba') {
      // currentShareTaoBaocode = ` ${getTaobaoCode(item.taobao_code)}`;

      html += ` [淘口令:] ${item.taobao_code !== '' ? getTaobaoCode(item.taobao_code) : ''}  \n`;
    }
  }

  if (check2) {
    html += `[邀请码:] ${invite_code !== '' ? invite_code : ''}  \n`;
  }

  if (check3) {
    // html += `[邀请码:] ${invite_code !== '' ? invite_code : ''}  \n`;
  }
  // html += tiktokCode !== '' ? `【口令】 ${rand(1, 9)}:/##${getTiktokCode(tiktokCode)}##  \n` : '';
  // `[口令:] ${tiktokCode}`
  // html += ' 1fu致.( CZ3457 vmUFdZekxVO/🍑𝙩a𝙤宝/  \n';

  return html;
};

export const getOrderString = (item) => {
  return item.replace('desc', 'des');
};

export function getContents(text, fontSize, winWidth, winHeight) {
  let str = formatContent(text);
  // let str = `<p>坐落在姑苏城的城北方向，有一个占地约莫十三亩地的大园林。</p>
  // <p>这一天，刚刚拂晓的时候。</p>
  // <p>在园林中的一间大房子里，空旷的空间，四面摆放着一些武器架，中间是一个大圆台。</p>`;

  let strs = str.match(/<p>(.*?)<\/p>/g);
  let rets = [];
  // replace(/<(?!img|p|\/p).*?>/g, "")
  for (let index = 0; index < strs.length; index++) {
    let str = strs[index].replace(/<[^<>]+>/g, '\n').trim();
    rets.push(`\u3000\u3000${str}`);
  }
  let tmpStr = rets.join('\n');
  let cleanStr = tmpStr;

  const lineWidth = Math.floor(((winWidth - 35) * 2) / fontSize) - 1;
  const evenLineWidth = isEvenNumber(lineWidth) ? lineWidth : lineWidth - 1;
  const linesNum = getNumbersOfLinesPerPages(winHeight, fontSize);

  let width = evenLineWidth;
  let chunks = [];
  let currentChunk = '';
  let currentLineWidth = 0;
  let currentLinesNum = 0;
  // let linesNum = 100;

  for (let i in cleanStr) {
    try {
      const s = cleanStr[i];
      let code = s.charCodeAt();

      // Push the current line when meet the `\n` or `\r`
      if (code === 10 || code === 13) {
        currentChunk += '\n';
        currentLinesNum++;
        currentLineWidth = 0;
        continue;
      }

      // Computed the width of the word
      const sWidth = stringWidth(s);

      // Push the `\n` to the current chunk when width of current line will wider then line width
      if (currentLineWidth + sWidth > width) {
        currentChunk += '\n';
        currentLinesNum++;
        currentLineWidth = 0;
      }

      // Push the curretn chunk to the chunks when currnet lines num will more than the lines num
      if (currentLinesNum + 1 > linesNum) {
        chunks.push(currentChunk);
        currentChunk = '';
        currentLineWidth = 0;
        currentLinesNum = 0;
      }

      currentChunk += s;
      currentLineWidth += sWidth;
    } catch (error) {
      console.log(error);
    }
  }

  // Push the last line
  chunks.push(currentChunk);

  // console.log("rets",rets);
  return {
    contentText: chunks.join('\n'),
    fontStyle: { fontSize: 12, lineHeight: 20 },
    strWidth: stringWidth(tmpStr),
    fontSize,
    chunks,
  };
}

export function errorSystemHandler(error) {
  const { debug } = system;
  if (debug) {
    const alertButtons = [
      {
        text: '确定',
        onPress: () => { },
        style: 'default',
      },
    ];
    if (debug) {
      // params, url
      let errorMessage = `
      返回错误请求:\n${JSON.stringify(error)}
      `;
      alertButtons.push({
        text: '查看错误详情',
        onPress: () => {
          Alert.alert('错误详情', errorMessage);
        },
      });
    }
    Alert.alert('温馨提示', '服务器出点小问题', alertButtons);
  }
}

export function responseErrorMessage(error, duration = Toast.durations.LONG, title = '温馨提示') {
  const errorMessage = typeof error === 'string' ? error : get(error, 'message', '未知错误');
  Alert.alert(title, errorMessage, [
    {
      text: '确定',
      onPress: () => { },
      style: 'default',
    },
  ]);


}

export function responseSuccessMessage(message) {
  ToastAndroid.show(message, 20000)

  // Toast.show(message, {
  //   duration: Toast.durations.LONG,
  //   position: Toast.positions.CENTER,
  //   shadow: true,
  //   animation: true,
  //   hideOnPress: true,
  //   delay: 0,
  // });
}

export function responseTestMessage(error, duration = 0) {
  const message = typeof error === 'string' ? error : JSON.stringify(error);

  Toast.show(message, {
    duration: duration > 0 ? duration : Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
  });
}

export function getCacheData(global, key) {
  const data = get(global, `configData.${key}`, null);
  if (data) {
    const info = get(data, 'data', null);
    const expireTime = get(data, 'expireTime', 0);
    const now = unix();

    if (now > expireTime) {
      return null;
    }
    return info;
  }
  return data;
}

export function saveCacheData(configData, key, info) {
  const configCacheData = {
    data: info,
    expireTime: unix() + CACHE.CACHE_KEYS[key],
  };
  set(configData, `${key}`, configCacheData);
  return configData;
}

export function playSound(soundAsset) {
  if (system.isIOS) {
    const RNAudioPlayerModule = NativeModules.RNAudioPlayer;
    RNAudioPlayerModule.play(soundAsset, (res) => { });
  } else {
    const Sound = require('react-native-sound');
    var whoosh = new Sound(soundAsset, Sound.MAIN_BUNDLE, (error) => {
      // console.warn('failed to load the sound');

      if (error) {
        console.log('failed to load the sound', error);
        // console.warn(error);
        return;
      }
      // Play the sound with an onEnd callback
      whoosh.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });

    // Reduce the volume by half
    whoosh.setVolume(0.3);
  }
}

export function responseNoticeMessage(message, duration = 3000) {
  Toast.show(message, {
    duration: duration > 0 ? duration : Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
  });
}

export function alertMessage(title, message, onPress = null) {
  Alert.alert(title, message, onPress);
}

export function getAdConfigs(global) {
  return {
    adPos: get(global, 'indexData.data.adPos', {}),
    adGlobalConfig: get(global, 'indexData.data.adConfig', {}),
    hotkeywords: get(global, 'indexData.data.hotkeywords', []).map((d) => d.keyword),
  };
}

export function get_shop_id(id, source) {
  return (id + '').substring(2);
}

export async function getAccessToken() {
  const tokenInfo = await asyncLoadData(CACHE.TOKEN);
  return {
    accessToken: get(tokenInfo, 'access_token', null),
  };
}

export function time_format(time) {
  return moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss');
}

export function time_month_format(time) {
  return moment(new Date(time)).format('YYYY-MM');
}

export function unix() {
  return moment().unix();
}

// moment().unix()
//

export function debounce(func, wait) {
  let timer = null;
  return function () {
    if (timer != null) {
      clearTimeout(timer);
    }

    timer = setTimeout(func, wait);
  };
}

export function isFinishNewUserTask(userData, screenPage, index = -1) {
  // const {userData} = userData;
  let taskIndex = index;
  let newUserTasks = get(userData, "new_user_tasks", "");
  if (newUserTasks == "") {
    return false;
  }
  // responseErrorMessage(taskIndex+" screenPage"+newUserTasks);
  newUserTasks = JSON.parse(newUserTasks);
  console.warn("newUserTasks", newUserTasks);
  if (screenPage == 'ShopIndexScreen') {
    taskIndex = 5;
  }

  if (screenPage == 'MeituanScreen') {
    taskIndex = 4;
  }

  if (screenPage == 'TiktokIndexScreen') {
    taskIndex = 3;
  }

  if (screenPage == 'PhoneScreen') {
    taskIndex = 2;
  }

  if (screenPage == 'VideoScreen') {
    taskIndex = 0;
  }

  console.warn("taskIndex", taskIndex);

  // responseErrorMessage(taskIndex+" screenPage"+screenPage);
  if (taskIndex < 0) {
    return false;
  }

  return newUserTasks[taskIndex] == 1;

}

// global

export function navShopUrl(item, navigation, isSrc = null, click_url = null) {
  // const { navigation, isSrc } = this.props;

  navigation.navigate('ShopDetailScreen', {
    id: item.id,
    item_id: isSrc ? item.item_id : get_shop_id(item.item_id, item.source),
    click_url,
    item,
  });
}
// navUrl(item, click_url = null) {
//   const { navigation, isSrc } = this.props;

//   navigation.navigate('ShopDetailScreen', {
//     id: item.id,
//     item_id: isSrc ? item.item_id : get_shop_id(item.item_id, item.source),
//     click_url,
//     item,
//   });
// }

export function clickShopItemHandler(
  item,
  userData,
  bindOpenApiDataHandler,
  getJDSmartLinkHandler,
  AlibabaNativeModule,
  navigation,
  isSrc = null,
) {
  // const { userData, bindOpenApiDataHandler, getJDSmartLinkHandler } = this.props;

  if (item.source === 'alibaba') {
    // responseNoticeMessage('userData' + userData.open_taobao);
    if (
      !userData.open_taobao ||
      userData.open_taobao.length === 0 ||
      !userData.special_id ||
      userData.special_id <= 0
    ) {
      try {
        AlibabaNativeModule.login((result) => {
          this.setState({ loading: true });
          bindOpenApiDataHandler(userData.id, 0, JSON.stringify(result), (response) => {
            navShopUrl(item);
          });
        });
      } catch (error) { }
    } else {
      this.navUrl(item);
    }
  }

  if (item.source === 'jd') {
    getJDSmartLinkHandler(
      userData.id,
      `https:${filterUrl(item.click_url, '//')}`,
      (response) => {
        const click_url = response.content;
        // navigation.navigate('ShopDetailScreen', { id: item.id, item, click_url });
        this.navUrl(item, navigation, click_url);
      },
      (error) => {
        //   responseErrorMessage(error);
      },
    );
    //   navigation.navigate('ShopDetailScreen', { id: item.id, item });
  }
}

// clickItemHandler = async (item) => {
//   const { userData, bindOpenApiDataHandler, getJDSmartLinkHandler } = this.props;

//   if (item.source === 'alibaba') {
//     // responseNoticeMessage('userData' + userData.open_taobao);
//     if (
//       !userData.open_taobao ||
//       userData.open_taobao.length === 0 ||
//       !userData.special_id ||
//       userData.special_id <= 0
//     ) {
//       try {
//         AlibabaNativeModule.login((result) => {
//           this.setState({ loading: true });
//           bindOpenApiDataHandler(userData.id, 0, JSON.stringify(result), (response) => {
//             this.navUrl(item);
//           });
//         });
//       } catch (error) {}
//     } else {
//       this.navUrl(item);
//     }
//   }

//   if (item.source === 'jd') {
//     getJDSmartLinkHandler(
//       userData.id,
//       `https:${filterUrl(item.click_url, '//')}`,
//       (response) => {
//         const click_url = response.content;
//         // navigation.navigate('ShopDetailScreen', { id: item.id, item, click_url });
//         this.navUrl(item, click_url);
//       },
//       (error) => {
//         //   responseErrorMessage(error);
//       },
//     );
//     //   navigation.navigate('ShopDetailScreen', { id: item.id, item });
//   }
// };
