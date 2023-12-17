// import FormData from 'FormData';
// import JSEncrypt from 'jsencrypt';
import { system } from '.';
import { responseErrorMessage } from './tool';

export const getChatApis = (api, postData, token = null) => {
  console.log("api", api.split('/')[0]);
  const apis = system.url[api.split('/')[0]];
  const url = system.debug ? `${apis.debug}${api}` : `${apis.public}${api}`;
  let formData = new FormData();
  Object.keys(postData).forEach((key) => {
    formData.append(key, postData[key]);
  });
  return {
    url,
    baseUrl: system.debug ? `${apis.debug}` : `${apis.public}`,
  };
}

export const getApis = (api, postData, token = null) => {
  // const ROOT_API = `http://192.168.0.106:8000/api/v1/${api}`;
  // const ROOT_API = `http://121.43.128.147:8089/api/v1/${api}`;
  // responseErrorMessage(JSON.stringify({ api }));
  // responseErrorMessage(JSON.stringify({ api, a: api.split('/')[0] }));
  const apis = system.url[api.split('/')[0]];
  // responseErrorMessage(JSON.stringify({ apis, api }));
  const ROOT_API = system.debug ? `${apis.debug}${api}` : `${apis.public}${api}`;
  let formData = new FormData();
  Object.keys(postData).forEach((key) => {
    formData.append(key, postData[key]);
    // console.log('postData', key, postData[key], RsaService.publicEncrypt(postData[key]));
  });

  const headers = {};
  return {
    url: ROOT_API,
    baseUrl: system.debug ? `${apis.debug}` : `${apis.public}`,
    options: {
      method: 'POST',
      headers,
      body: formData,
    },
  };
};

export const getUrls = () => {
  return {
    url: system.debug ? `${system.url.debug}` : `${system.url.public}`,
  };
};
