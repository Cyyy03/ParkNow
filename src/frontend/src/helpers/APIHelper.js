import { showToast } from "../util/ToastHelper";
import RNFetchBlob from "rn-fetch-blob";
import * as RNFS from 'react-native-fs';
import {
  asyncSaveData,
  RequestPOST,
  getAccessToken,
  checkMiddleError,
  responseErrorMessage,
  getDeviceInfo,
} from '../util/tool';

import { getApis } from '../util/api';


const API = {};
API.request = async (path, params) => {
  // console.log("[Proxy] ", openaiPath);
  const OPENAI_URL = "jiaju.dev.weilaishijieapp.com/chat";
  const DEFAULT_PROTOCOL = "http";
  const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
  const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;
  console.log("params", params);
  console.log(`${PROTOCOL}://${BASE_URL}/${path}`);
  let responseText = '';
  let formData = new FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
    // console.log('postData', key, postData[key], RsaService.publicEncrypt(postData[key]));
  });

  const tokenInfo = await getAccessToken();
  // const apis = getApis(ROUTER.USER.GET_USER_INFO, params);

  const headers = {
    // "Content-Type": "application/json",
    // Accept: 'application/json, text/plain, */*',
    // 'User-Agent': '*',
    // "Allow":"POST",
  };
  console.log("`url=`", `${PROTOCOL}://${BASE_URL}/${path}`);
  try {

    return await fetch(`${PROTOCOL}://${BASE_URL}/${path}`, {
      ...{
        method: 'POST',
        headers,
        body: formData,
        credentials: "include"
      },
      // headers: {
      //   "Content-Type": "application/json",
      //   Accept: 'application/json, text/plain, */*',
      //   'User-Agent': '*',
      // },
      // ...{ credentials: 'include' },
      // method: req.method,
      // body: req.body,
    }).then(async (response) => {

      responseText = await response.text();
      console.log('responseText', responseText);
      const responseData = JSON.parse(responseText);
      return responseData;
    });

  } catch (error) {

    console.log("error", error);

  }

}

API.requestBaiduSpeech = async (params) => {
  const url = 'http://tsn.baidu.com/text2audio';
  console.log("params", params);

  let responseText = null;
  let formData = new FormData();
  var fd = [];
  let form = [];
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
    fd.push(key + '=' + encodeURIComponent(params[key]));
    form.push({
      name: key,
      data: params[key]
    })
    // console.log('postData', key, postData[key], RsaService.publicEncrypt(postData[key]));
  });
  // showToast({ message: JSON.stringify(formData) })
  // let responseData = {};
  const headers = {
    // "Content-Type": "application/json",
    // Accept: 'application/json, text/plain, */*',
    // 'User-Agent': '*',
    // "Allow":"POST",
  };
  // console.log("`url=`", `${PROTOCOL}://${BASE_URL}/${path}`);
  // try {

  //   return await fetch(`${url}`, {
  //     ...{
  //       method: 'POST',
  //       headers,
  //       body: formData,
  //       responseType: 'blob',
  //       credentials: "include"
  //     },
  //   }).then(async (response) => {
  //     console.log('response', response);
  //     const responseData = await response.blob();
  //     console.log("responseData", responseData);

  //     showToast({ message: "finished" })
  //     return responseData;
  //   });

  // } catch (error) {

  //   console.log("error", error);

  // }


  const postString = fd.join('&')
  console.log("fd.join('&')", postString, form);


  // return await RNFetchBlob.config({
  //   // add this option that makes response data to be stored as a file,
  //   // this is much more performant.
  //   fileCache: true,
  //   // path: RNFetchBlob.fs.dirs.DocumentDir + '/sound.mp3',

  // })
  //   .fetch("POST", url, {
  //     // headers: { 'Content-Type': 'x-www-form-urlencoded;charset=UTF-8' },
  //     'Content-Type': 'x-www-form-urlencoded',
  //     // body: `${postString}`
  //   }, form)
  //   .then((res) => {
  //     // the temp file path
  //     console.log("The file saved to ", res.path());
  //     // new Player(res.path()).play();

  //   });

  try {

    return await fetch(`${url}`, {
      ...{
        method: 'POST',
        headers,
        body: formData,
        responseType: 'blob',
        credentials: "include"
      },
    }).then(async (response) => {
      // console.log('response', response);
      const responseData = await response.blob();
      console.log("responseData", responseData);
      const filename = "file:///data/user/0/com.world.qipaoai/files/sound.txt";
      // const filename = "file:///data/user/0/com.world.qipaoai/files/sound.mp3";
      RNFS.writeFile(filename, "???", 'utf8').then(d => {
        console.log("d", d);

      })

      RNFS.readFile(filename).then(d => {
        console.log("readFile", d);

      })

      showToast({ message: "finished" })
      return responseData;
    });

  } catch (error) {

    console.log("error", error);

  }

}

API.getGptUrl = (path, params, token = "") => {
  // console.log("[Proxy] ", openaiPath);
  // const OPENAI_URL = "192.168.1.6:9002";
  const OPENAI_URL = "gpt.jiaju.dev.weilaishijieapp.com";
  const DEFAULT_PROTOCOL = "http";
  const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
  const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;
  console.log("params", params);
  console.log(`${PROTOCOL}://${BASE_URL}/${path}`);
  let responseText = '';
  let formData = new FormData();
  let postString = "";
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
    postString += `${key}=${params[key]}&`;
    // console.log('postData', key, postData[key], RsaService.publicEncrypt(postData[key]));
  });
  // showToast({ message: JSON.stringify(formData) })
  // let responseData = {};
  const headers = {
    // "Content-Type": "application/json",
    // Accept: 'application/json, text/plain, */*',
    // 'User-Agent': '*',
    // "Allow":"POST",
  };
  console.log("`url=`", `${PROTOCOL}://${BASE_URL}/${path}`, postString);
  return {
    url: `${PROTOCOL}://${BASE_URL}/${path}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'text/event-stream',
        // Authorization: {
        //   toString: function () {
        //     return "Bearer " + token;
        //   }
        // }
      },
      body: postString,
      timeoutBeforeConnection: 100000
      // signal: ctrl.signal,
    }
  }
}

export default API;
