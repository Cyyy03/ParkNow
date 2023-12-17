import axios from 'axios';
import store from 'store';   //用于本地存储token
import settings from './etc/settings';

const Url = settings.url;

const registerServer = async (data) => {
  let res = await axios.post (`${Url}/users/register/`, data);
  console.log(res);
  return res.data;
}

const loginServer = async (data) => {
  let res = await axios.post (`${Url}/users/login/`, data);
  if (res.status === 200) {
    let token = res.headers.auth;
    if (token) store.set('django_token', token);  //登录后从headers获取token存储到本地
    return res.data;
  }
}

const allUsersServer = async () => {
  //从本地缓存获取token添加到headers
  let token = store.get('django_token');
  let headers = {
    auth: token
  }
  let res = await axios.get(`${Url}/users/all_users/`, {headers});
  if (res.status === 200) {
    let token = res.headers.auth;
    if (token) store.set('django_token', token);    //刷新本地存储的token
    return res.data;
  }
}

export {
  registerServer,
  loginServer,
  allUsersServer
}