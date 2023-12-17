import {
  LOGIN,
  REGISTER,
  GET_USER_INFO,
  LOAD_USER_DATA_SUCCESS,
  LOGOUT_SUCCESS,
  AUTH_SUCCESS,
  BIND_USER,
  UPDATE_USER,
  UPDATE_USER_INTEGRAL,
  SAVE_USER_CONFIG,
  GET_USER_MESSAGE,
  WECHAT,
  LOGIN_QIANZHU,
} from './actiontypes';
import { getApis } from '../../util/api';
// APIS
import {
  asyncSaveData,
  RequestPOST,
  getAccessToken,
  checkMiddleError,
  responseErrorMessage,
  getDeviceInfo,
} from '../../util/tool';
import { CACHE, ROUTER } from '../../util/';
import { get } from 'lodash';
import { showToast } from '../../util/ToastHelper';

export const loadUserData = (userInfo) => async (dispatch) => {
  // dispatch(loadUserDataSuccess(userInfo));
  // console.log('loadUserDara==========================', userInfo);
  // responseErrorMessage('userInfo');
  dispatch({ type: LOAD_USER_DATA_SUCCESS, data: userInfo });
  await updateUserData(userInfo, dispatch);
};

export const saveUserConfig = (userConfig) => (dispatch) => {
  // dispatch(loadUserDataSuccess(userInfo));
  // console.log('loadUserDara==========================', userConfig);
  // APIS
  dispatch({ type: SAVE_USER_CONFIG, data: userConfig });
};

export const updateUserData = async (userData, dispatch) => {
  await asyncSaveData(CACHE.USER, userData);
  dispatch({ type: UPDATE_USER.SUCCESS, data: userData });
};

export const payHandler =
  (user_id, extera, successCallback, errorCallback = {}) =>
    async (dispatch) => {
      // dispatch({ type: GET_USER_INFO.PENDING });
      // let params = { user_id, verify_code };
      let params = { user_id, extera: JSON.stringify(extera) };
      console.log("params", params);

      // console.log('responseJsonresponseJsonresponseJsonresponseJson' + JSON.stringify(responseJson));
      try {
        const tokenInfo = await getAccessToken();
        const apis = getApis(ROUTER.USER.CREATE_ORDER, params);
        const responseJson = await RequestPOST(
          apis.url,
          apis.options,
          params,
          errorCallback,
          false,
          tokenInfo.accessToken,
          dispatch,
        );
        if (responseJson) {
          if (responseJson.code >= 0) {
            const action = get(responseJson.data, 'action', 'create');
            const userInfo = get(responseJson.data, 'userInfo', {});

            // if (action == 'update') {
            //   // showToast({ message: JSON.stringify({ userInfo }) });
            //   await updateUserData(userInfo, dispatch);
            // }
            successCallback && successCallback(responseJson.data, responseJson.code, responseJson.message);
          } else {
            errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        // checkMiddleError
        !checkMiddleError(responseJson) && errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };


export const checkUserIntegral =
  (user_id, type, role, successCallback, errorCallback = {}) =>
    async (dispatch) => {
      // dispatch({ type: GET_USER_INFO.PENDING });
      let params = { user_id, type, role };
      const tokenInfo = await getAccessToken();
      const apis = getApis(ROUTER.USER.CHECK_USER_INTEGRAL, params);
      try {
        const responseJson = await RequestPOST(
          apis.url,
          apis.options,
          params,
          errorCallback,
          false,
          tokenInfo.accessToken,
          dispatch,
        );

        if (responseJson) {
          if (responseJson.code >= 0) {
            successCallback && successCallback(responseJson.data, responseJson.code, responseJson.message);
          } else {
            !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        // console.warn(error);
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

// await asyncSaveData
export const updateUserIntegral =
  (totalUserIntegral) =>
    async (dispatch) => {
      dispatch({ type: UPDATE_USER_INTEGRAL.SUCCESS, data: totalUserIntegral });

    };

export const getUserInfo =
  (user_id, extera, successCallback, errorCallback = {}) =>
    async (dispatch) => {
      // dispatch({ type: GET_USER_INFO.PENDING });
      let params = { user_id, extera: JSON.stringify(extera) };
      const tokenInfo = await getAccessToken();
      const apis = getApis(ROUTER.USER.GET_USER_INFO, params);
      try {
        const responseJson = await RequestPOST(
          apis.url,
          apis.options,
          params,
          errorCallback,
          false,
          tokenInfo.accessToken,
          dispatch,
        );

        if (responseJson) {
          if (responseJson.code >= 0) {
            dispatch({
              type: GET_USER_INFO.SUCCESS,
              data: responseJson.data,
              message: responseJson.message,
            });
            successCallback && successCallback(responseJson.data, responseJson.code, responseJson.message);
          } else {
            dispatch({
              type: GET_USER_INFO.ERROR,
              data: responseJson.data,
              message: responseJson.message,
            });
            !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        // console.warn(error);
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

export const clearAccountHandler =
  (user_id, verify_code, successCallback, errorCallback = {}) =>
    async (dispatch) => {
      // dispatch({ type: GET_USER_INFO.PENDING });
      let params = { user_id, verify_code };
      const tokenInfo = await getAccessToken();
      const apis = getApis('user/clearAccount', params);
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      // console.log('responseJsonresponseJsonresponseJsonresponseJson' + JSON.stringify(responseJson));
      try {
        if (responseJson) {
          if (responseJson.code >= 0) {
            successCallback && successCallback(responseJson.data, responseJson.code, responseJson.message);
          } else {
            errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        // checkMiddleError
        !checkMiddleError(responseJson) && errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };



export const loginQianZhu =
  (user_id, successCallback, errorCallback) =>
    async (dispatch) => {
      const tokenInfo = await getAccessToken();
      let params = { user_id };
      const apis = getApis(ROUTER.USER.LOGIN_QIANZHU, params);
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      try {
        if (responseJson) {
          if (responseJson.code >= 0) {
            // LOGIN_QIANZHU
            dispatch({
              type: LOGIN_QIANZHU.SUCCESS,
              data: responseJson.data,
              message: responseJson.message,
            });
            successCallback && successCallback(responseJson.data);
          } else {
            !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

export const authUserHandler =
  (user_id, truename, idcard, mobile, step, code, verify_id, access_token = '', successCallback, errorCallback) =>
    async (dispatch) => {
      const tokenInfo = await getAccessToken();
      let params = { user_id, truename, idcard, mobile, code, step, verify_id, access_token };
      const apis = getApis(ROUTER.USER.REAL_AUTHENTICATION, params);
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      try {
        if (responseJson) {
          if (responseJson.code >= 0) {
            dispatch({
              type: GET_USER_INFO.SUCCESS,
              data: responseJson.data,
              message: responseJson.message,
            });

            successCallback && successCallback(responseJson.data);
          } else {
            !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

export const suggest =
  (user_id, content, successCallback, errorCallback = {}) =>
    async (dispatch) => {
      let params = { user_id, content };
      const apis = getApis('user/suggest', params);
      const responseJson = await RequestPOST(apis.url, apis.options, params, errorCallback);
      try {
        if (responseJson) {
          if (responseJson.code >= 0) {
            successCallback && successCallback(responseJson.data, responseJson.message);
          } else {
            errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

export const settlementMoney =
  (user_id, money, successCallback, errorCallback = {}) =>
    async (dispatch) => {
      let params = { user_id, money };
      const tokenInfo = await getAccessToken();
      const apis = getApis('user/settlementMoney', params);
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      try {
        if (responseJson) {
          if (responseJson.code >= 0) {
            successCallback && successCallback(responseJson.data, responseJson.message);
          } else {
            !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

export const bindAlipayHandler = (formData, successCallback, errorCallback) => async (dispatch) => {
  const apis = getApis(ROUTER.USER.BIND_ALIPAY, formData);
  const tokenInfo = await getAccessToken();
  const responseJson = await RequestPOST(
    apis.url,
    apis.options,
    formData,
    errorCallback,
    true,
    tokenInfo.accessToken,
    dispatch,
  );
  try {
    if (responseJson) {
      if (responseJson.code >= 0) {
        dispatch({
          type: GET_USER_INFO.SUCCESS,
          data: responseJson.data,
          message: responseJson.message,
        });
        successCallback && successCallback(responseJson.data);
      } else {
        !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};


export const updateWechat = (user_id, wechat, successCallback, errorCallback) => async (dispatch) => {
  const params = {
    user_id,
    wechat
  }
  const apis = getApis(ROUTER.USER.UPDATE_WECHAT, params);
  const tokenInfo = await getAccessToken();
  const responseJson = await RequestPOST(
    apis.url,
    apis.options,
    params,
    errorCallback,
    false,
    tokenInfo.accessToken,
    dispatch,
  );
  try {
    if (responseJson) {
      if (responseJson.code >= 0) {
        await updateUserData(responseJson.data, dispatch);
        successCallback && successCallback(responseJson.data);
      } else {
        !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }

};

export const doNewUserReward = (user_id, successCallback, errorCallback) => async (dispatch) => {
  // ROUTER.USER.BIND_ALIPAY
  const params = {
    user_id,
  }
  const apis = getApis(ROUTER.USER.DO_NEWUSER_REWARD, params);
  const tokenInfo = await getAccessToken();
  const responseJson = await RequestPOST(
    apis.url,
    apis.options,
    params,
    errorCallback,
    false,
    tokenInfo.accessToken,
    dispatch,
  );
  try {
    if (responseJson) {
      if (responseJson.code >= 0) {
        await updateUserData(responseJson.data, dispatch);
        successCallback && successCallback(responseJson.data);
      } else {
        !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};


export const doNewUserTask = (user_id, screen_page, successCallback, errorCallback) => async (dispatch) => {
  // ROUTER.USER.BIND_ALIPAY
  const params = {
    user_id,
    screen_page,
  }
  const apis = getApis(ROUTER.USER.DO_NEWUSER_TASK, params);
  const tokenInfo = await getAccessToken();
  const responseJson = await RequestPOST(
    apis.url,
    apis.options,
    params,
    errorCallback,
    false,
    tokenInfo.accessToken,
    dispatch,
  );
  try {
    if (responseJson) {
      if (responseJson.code >= 0) {
        await updateUserData(responseJson.data, dispatch);
        successCallback && successCallback(responseJson.data);
      } else {
        !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};

export const changeSecurityPasswordHandler = (formData, successCallback, errorCallback) => async (dispatch) => {
  // ROUTER.USER.BIND_ALIPAY

  const apis = getApis(ROUTER.USER.CHANGE_SECURITY_PASSWORD, formData);
  const tokenInfo = await getAccessToken();
  const responseJson = await RequestPOST(
    apis.url,
    apis.options,
    formData,
    errorCallback,
    false,
    tokenInfo.accessToken,
    dispatch,
  );
  try {
    if (responseJson) {
      if (responseJson.code >= 0) {
        dispatch({
          type: GET_USER_INFO.SUCCESS,
          data: responseJson.data,
          message: responseJson.message,
        });
        successCallback && successCallback(responseJson.data);
      } else {
        !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};

export const changeLoginPasswordHandler = (formData, successCallback, errorCallback) => async (dispatch) => {
  const apis = getApis(ROUTER.USER.CHANGE_LOGIN_PASSWORD, formData);
  const tokenInfo = await getAccessToken();
  const responseJson = await RequestPOST(
    apis.url,
    apis.options,
    formData,
    errorCallback,
    false,
    tokenInfo.accessToken,
    dispatch,
  );
  try {
    if (responseJson) {
      if (responseJson.code >= 0) {
        dispatch({
          type: GET_USER_INFO.SUCCESS,
          data: responseJson.data,
          message: responseJson.message,
        });
        successCallback && successCallback(responseJson.data);
      } else {
        !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};

export const loginHandler = (mobile, password, successCallback, errorCallback) => async (dispatch) => {

  try {
    let params = { mobile, password };
    console.log('loginHandler responseJson 2', params);
    const { UUID } = await getDeviceInfo();
    console.log('loginHandler responseJson 3', UUID);

    const deviceId = UUID;
    const apis = getApis(ROUTER.OAUTH.LOGIN, params);
    console.log('loginHandler responseJson 4', apis);
    const responseJson = await RequestPOST(apis.url, apis.options, params, errorCallback, false, null, null, deviceId);
    console.log('loginHandler responseJson 5', responseJson);
    if (responseJson) {
      if (responseJson.code >= 0) {
        if (responseJson.data.step === 2) {
          await asyncSaveData(CACHE.USER, responseJson.data);
          await asyncSaveData(CACHE.TOKEN, get(responseJson, 'data.token', {}));
          dispatch({
            type: LOGIN.SUCCESS,
            data: responseJson.data,
            message: responseJson.message,
          });
        }

        successCallback && successCallback(responseJson);
      } else {
        dispatch({
          type: LOGIN.ERROR,
          data: responseJson.data,
          message: responseJson.message,
        });
        errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    console.log("error", error);
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};

export const getUserTeams = (user_id, page, offset, extra, successCallback, errorCallback) => async (dispatch) => {
  const { keyword, active, order } = extra;
  let params = {
    user_id,
    page,
    offset,
    active,
    order: order ? order : 'up',
    keyword: keyword ? keyword : '',
  };
  const tokenInfo = await getAccessToken();

  const apis = getApis(ROUTER.USER.GET_USER_TEAMS, params);
  const responseJson = await RequestPOST(
    apis.url,
    apis.options,
    params,
    errorCallback,
    false,
    tokenInfo.accessToken,
    dispatch,
  );
  try {
    if (responseJson) {
      if (responseJson.code >= 0) {
        successCallback && successCallback(responseJson.data);
      } else {
        errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};

export const bindOpenApiHandler = (user_id, type, open_data, callback) => async (dispatch) => {

  let params = { user_id, type, open_data };
  const apis = getApis('user/bindOpenApi', params);
  console.log('bindOpenApiHandler apis', apis);
  fetch(apis.url, apis.options)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if (responseJson.code >= 0) {
        await asyncSaveData('user_data', responseJson.data);

        dispatch({ type: LOAD_USER_DATA_SUCCESS, data: responseJson.data });

        dispatch({
          type: BIND_USER.SUCCESS,
          data: responseJson.data,
          message: responseJson.message,
        });
        callback && callback(responseJson);
      } else {
        dispatch({
          type: BIND_USER.ERROR,
          data: responseJson.data,
          message: responseJson.message,
        });
        callback && callback(responseJson);
      }
    })
    .catch((error) => {
      // console.error(error);
      dispatch({
        type: WECHAT.ERROR,
        message: JSON.stringify(error),
      });
    });
};

export const getUserPower =
  (user_id, page = 1, offset = 10, successCallback, errorCallback) =>
    async (dispatch) => {
      let params = { user_id, page, offset };

      const apis = getApis(ROUTER.USER.LIST_USER_POWER, params);
      const tokenInfo = await getAccessToken();
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      try {
        // LIST_USER_INTEGRAL
        // console.log('responseJson', responseJson);
        if (responseJson) {
          if (responseJson.code >= 0) {
            successCallback && successCallback(responseJson.data);
          } else {
            !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

export const getServiceUserSettlement =
  (user_id, page = 1, offset = 10, successCallback, errorCallback) =>
    async (dispatch) => {
      let params = { user_id, page, offset };
      const apis = getApis('bill/list_user_service_bill', params);
      const tokenInfo = await getAccessToken();
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      try {
        console.log('responseJson', responseJson);
        if (responseJson) {
          if (responseJson.code >= 0) {
            successCallback && successCallback(responseJson.data);
          } else {
            errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };


export const getUserBill =
  (user_id, type = "ai_member", page = 1, offset = 10, successCallback, errorCallback) =>
    async (dispatch) => {
      let params = { user_id, page, offset, type };

      const apis = getApis(ROUTER.USER.LIST_USER_Bill, params);
      const tokenInfo = await getAccessToken();
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      try {
        console.log('getUserBill responseJson', responseJson);
        if (responseJson) {
          if (responseJson.code >= 0) {
            console.log('getUserBill data', responseJson.data);
            successCallback && successCallback(responseJson.data);
          } else {
            errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

export const getUserIntegral =
  (user_id, page = 1, offset = 10, successCallback, errorCallback) =>
    async (dispatch) => {
      let params = { user_id, page, offset };

      const apis = getApis(ROUTER.USER.LIST_USER_INTEGRAL, params);
      const tokenInfo = await getAccessToken();
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      try {
        console.log('responseJson', responseJson);
        if (responseJson) {
          if (responseJson.code >= 0) {
            successCallback && successCallback(responseJson.data);
          } else {
            errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };

export const appleLoginHandler =
  (token, email, nickname, apply_user, successBackHandler, errorCallback) => async (dispatch) => {
    // dispatch({ type: WECHAT.PENDING });
    let params = { token, email, apply_user, nickname };
    const apis = getApis('user/appleLogin', params);
    const { UUID } = await getDeviceInfo();
    const deviceId = UUID;
    const responseJson = await RequestPOST(apis.url, apis.options, params, errorCallback, false, null, null, deviceId);
    try {
      console.log('responseJson', responseJson);
      if (responseJson.code >= 0) {
        successBackHandler && successBackHandler(responseJson);
      } else {
        errorCallback && errorCallback(responseJson);
      }
    } catch (error) {
      errorCallback && errorCallback({ data: {}, message: 'server error' });
    }
  };



export const verifyCodeHandler = (pos, number, successBackHandler, errorCallback) => async (dispatch) => {
  // dispatch({ type: WECHAT.PENDING });
  let params = { pos, number };
  const apis = getApis('common/verifyCode', params);
  const responseJson = await RequestPOST(apis.url, apis.options, params, errorCallback);
  try {
    console.log('responseJson', responseJson);
    if (responseJson) {
      if (responseJson.code >= 0) {
        successBackHandler && successBackHandler(responseJson);
      } else {
        errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};

// export checkUserHandler

export const checkUserHandler = (uid, mobile, verify_code, successBackHandler, errorCallback) => async (dispatch) => {
  let params = { uid, mobile, verify_code };
  const apis = getApis(ROUTER.OAUTH.CHECK_USER_DATA, params);
  const responseJson = await RequestPOST(apis.url, apis.options, params, errorCallback);
  try {
    if (responseJson) {
      if (responseJson.code >= 0) {
        if (responseJson.data.step === 2) {
          await asyncSaveData(CACHE.USER, responseJson.data);
          await asyncSaveData(CACHE.TOKEN, get(responseJson, 'data.token', {}));
          dispatch({
            type: WECHAT.SUCCESS,
            data: responseJson.data,
            message: responseJson.message,
          });
        }

        successBackHandler && successBackHandler(responseJson);
      } else {
        errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'server error' });
  }
};



export const registerHandler = (formData, successCallback, errorCallback) => async (dispatch) => {

  let params = formData;
  const apis = getApis(ROUTER.OAUTH.REGISTER, params);
  const { UUID } = await getDeviceInfo();
  const deviceId = UUID;
  const responseJson = await RequestPOST(apis.url, apis.options, params, errorCallback, false, null, null, deviceId);
  try {
    console.log('responseJson', responseJson);
    if (responseJson.code >= 0) {
      if (responseJson.data.step === 2) {
        await asyncSaveData(CACHE.USER, responseJson.data);
        await asyncSaveData(CACHE.TOKEN, get(responseJson, 'data.token', {}));
        dispatch({
          type: REGISTER.SUCCESS,
          data: responseJson.data,
          message: responseJson.message,
        });
      }
      successCallback && successCallback(responseJson.data);
    } else {
      dispatch({
        type: REGISTER.ERROR,
        data: responseJson.data,
        message: responseJson.message,
      });
      errorCallback && errorCallback(responseJson);
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: '服务器错误' });
  }
};

export const sendCodeHandler = (email) => (dispatch) => {
  // dispatch(sendCodeStart());
  // console.log('email', email, url);
  // let params = { email: email };
  // const apis = getApis('user/sendCode', params);
  // fetch(apis.url, apis.options)
  //   .then((response) => response.json())
  //   .then((responseJson) => {
  //     if (responseJson.code >= 0) {
  //       dispatch(sendCodeSucces(responseJson.data.code));
  //     } else {
  //       dispatch(sendCodeFail(responseJson.msg));
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     dispatch(sendCodeFail(JSON.stringify(error)));
  //   });
};

export const resetSendCodeHandler = () => (dispatch) => {
  // dispatch(sendCodeReset());
};

export const resetErrorHandler = () => (dispatch) => {
  // dispatch(resetError());
};

export const authHandler = () => (dispatch) => {
  dispatch({ type: AUTH_SUCCESS });
};

export const logoutHandler = () => (dispatch) => {
  console.log('logoutHandler----');
  dispatch({ type: LOGOUT_SUCCESS });
};

export const listMessage =
  (user_id, type = 0, page = 1, offset = 10, successCallback, errorCallback) =>
    async (dispatch) => {


      // dispatch({ type: GET_USER_MESSAGE.PENDING });
      let params = { user_id, page, offset, type };
      const tokenInfo = await getAccessToken();
      const apis = getApis(ROUTER.USER.GET_USER_MESSAGE, params);
      const responseJson = await RequestPOST(
        apis.url,
        apis.options,
        params,
        errorCallback,
        false,
        tokenInfo.accessToken,
        dispatch,
      );
      console.log('responseJson', responseJson);
      try {
        if (responseJson.code >= 0) {

          // showToast({ message: "responseJson" })
          console.log("successCallback", successCallback);
          successCallback && successCallback(responseJson.data);
        } else {
          dispatch({
            type: GET_USER_MESSAGE.ERROR,
            data: responseJson.data,
            message: responseJson.message,
          });
          errorCallback && errorCallback(responseJson);
        }
      } catch (error) {
        errorCallback && errorCallback({ data: {}, message: 'server error' });
      }
    };
