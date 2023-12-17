import {
  INDEX_DATA,
  INIT_GLOBAL,
  LOAD_CONFIG_DATA_SUCCESS,
  UPDATE_TASK,
  INIT_AD,
  CREATE_AD_LOG,
  RUN_PROP_TASK,
  GET_GLOBAL,
  GET_NOTIFY_MESSAGE,
  CAPTCHA_CODE,
} from './actiontypes';
import { getApis } from '../../util/api';
import {
  asyncLoadData,
  asyncSaveData,
  checkMiddleError,
  getAccessToken,
  getAppResourceVersion,
  getAppVersion,
  RequestHandler,
  responseErrorMessage,
} from '../../util/tool';
import { CACHE, ROUTER } from '../../util/';
import { RequestPOST, responseNoticeMessage } from '../../util/tool';
import { LOAD_USER_DATA_SUCCESS } from '../auth/actiontypes';
import { get } from 'lodash';
import { showToast } from '../../util/ToastHelper';

export const getIndexData = (user_id, scrent_page, callback, errorCallback) => async (dispatch) => {
  let params = { user_id, scrent_page };
  const apis = getApis('user/getIndexData', params);
  const tokenInfo = await getAccessToken();
  // RequestHandler
  const accessToken = get(tokenInfo, 'accessToken', '');
  // console.warn('responseJson', responseJson, apis);
  try {
    const responseJson = await RequestPOST(apis.url, apis.options, params, null, false, accessToken, dispatch);
    // console.warn('responseJson', responseJson, apis);
    // responseErrorMessage("response" + JSON.stringify(responseJson))



    if (responseJson && responseJson.code >= 0) {
      dispatch({
        type: INDEX_DATA.SUCCESS,
        data: responseJson.data,
        message: responseJson.message,
      });
      // showToast({ message: "responseJson" + JSON.stringifyresponseJson.data })
      // console.log("responseJson.data", responseJson.data, callback);
      callback && callback(responseJson.data);
    } else {
      dispatch({
        type: INDEX_DATA.ERROR,
        data: responseJson.data,
        message: responseJson.message,
      });
      errorCallback && errorCallback(responseJson);
    }
  } catch (error) {
    console.log('e', error);
    console.error(error);
    // errorCallback && errorCallback({ data: {}, message: 'servererror' });
  }
};

export const verifyCaptcha = (payload, successCallback, errorCallback) => async (dispatch) => {
  let params = payload;
  const apis = getApis('index/verifyCaptcha', params);
  const responseJson = await RequestPOST(apis.url, apis.options, params, errorCallback);
  try {
    if (responseJson.code >= 0) {
      successCallback && successCallback(responseJson.data);
      dispatch({
        type: CAPTCHA_CODE.SUCCESS,
        data: responseJson.data,
        message: responseJson.message,
      });
    } else {
      errorCallback && errorCallback(responseJson);
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: '服务器错误' });
  }
};

export const runTask = (user_id, task_id, callback) => async (dispatch) => {
  dispatch({ type: RUN_PROP_TASK.PENDING });
  let params = { user_id, task_id };
  const apis = getApis(ROUTER.TASK.RUN_TASK, params);
  const tokenInfo = await getAccessToken();
  const responseJson = await RequestPOST(apis.url, apis.options, params, null, false, tokenInfo.accessToken, dispatch);
  try {
    if (responseJson.code >= 0) {
      dispatch({
        type: RUN_PROP_TASK.SUCCESS,
        data: responseJson.data,
        message: responseJson.message,
      });
      // successCallback && successCallback(responseJson.data);
      callback && callback(responseJson);
    } else {
      dispatch({
        type: UPDATE_TASK.ERROR,
        data: responseJson.data,
        message: responseJson.message,
      });
    }
  } catch (error) {
    dispatch({
      type: UPDATE_TASK.ERROR,
      data: {},
      message: JSON.stringify(error),
    });
  }
};

export const runPropTask = (user_id, prop_id, successCallback, errorCallback) => async (dispatch) => {
  dispatch({ type: RUN_PROP_TASK.PENDING });

  // checkMiddleError

  let params = { user_id, prop_id };
  const apis = getApis(ROUTER.TASK.RUN_PROP_TASK, params);
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
    if (responseJson.code >= 0) {
      dispatch({
        type: RUN_PROP_TASK.SUCCESS,
        data: responseJson.data,
        message: responseJson.message,
      });
      successCallback && successCallback(responseJson.data);
    } else {
      dispatch({
        type: RUN_PROP_TASK.ERROR,
        data: responseJson.data,
        message: responseJson.message,
      });
      !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
    }
  } catch (error) {
    errorCallback && errorCallback({ data: {}, message: 'servererror' });
  }
};

// user_id, config_pos_id, source_type, task_id, callbackHandler
export const initAd =
  (user_id, config_pos_id, source_type, task_id, page, payload, callback, errorCallback = null) =>
    async (dispatch) => {
      dispatch({ type: INIT_AD.PENDING, debugInfo: apis });
      let params = { user_id, config_pos_id, task_id, source_type, page };
      const apis = getApis(ROUTER.AD.INIT_AD, params);
      const tokenInfo = await getAccessToken();
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
        if (responseJson.code >= 0) {
          dispatch({
            type: INIT_AD.SUCCESS,
            data: { ...payload, ...{ config_pos_id, user_id } },
            message: responseJson.message,
          });
        }

        // showAdPage(user_id, 'SplashScreen', source_type, global, initAdHandler);

        callback && callback(responseJson);
        if (responseJson.code === -102) {
          dispatch({
            type: CAPTCHA_CODE.SHOW,
            data: { ...payload, ...{ config_pos_id, user_id } },
            message: responseJson.message,
          });
        }
      } catch (error) {
        console.error(error, 'servererror', 'addAdLog ');
      }
    };


// addVideoLog

export const addVideoLog =
  (user_id, action, message, callback, errorCallback = () => { }, options = {}) =>
    async (dispatch) => {
      let params = { user_id, action, message, ...options };
      const tokenInfo = await getAccessToken();
      const apis = getApis(ROUTER.VIDEO.CREATE_VIDEO_LOG, params);
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
            callback && callback(responseJson.data);
          } else {
            !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        console.error(error, 'servererror', 'addVideoLog');
      }
    };


export const addAdLog =
  (user_id, ad_id, action, message, callback, errorCallback = () => { }, options = {}) =>
    async (dispatch) => {
      let params = { user_id, action, ad_id, message, ...options };
      const tokenInfo = await getAccessToken();
      // showToast({ message: JSON.stringify(options) })
      const apis = getApis(ROUTER.AD.CREATE_AD_LOG, params);
      console.log("apis", apis, params);
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
              type: CREATE_AD_LOG.SUCCESS,
              data: responseJson.data,
              message: responseJson.message,
            });
            callback && callback(responseJson.data);
          } else {
            dispatch({
              type: CREATE_AD_LOG.ERROR,
              data: responseJson.data,
              message: responseJson.message,
              errorCode: responseJson.errorCode,
            });
            !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
          }
        }
      } catch (error) {
        console.error(error, 'servererror', 'addAdLog');
      }
    };



export const loadConfigData = () => async (dispatch) => {
  const configData = await asyncLoadData(CACHE.SYSTEM);
  dispatch({
    type: LOAD_CONFIG_DATA_SUCCESS,
    data: configData,
    message: '',
  });
};

export const saveConfigData = (configData) => async (dispatch) => {
  await asyncSaveData(CACHE.SYSTEM, configData, {});
  dispatch({
    type: LOAD_CONFIG_DATA_SUCCESS,
    data: configData,
    message: '',
  });
};

export const getGlobalConfig =
  (user_id, options = {}, successCallback, errorCallback) =>
    async (dispatch) => {
      let params = { user_id, ...options };
      const apis = getApis('index/getGlobalConfig', params);
      // responseNoticeMessage(JSON.stringify(params));
      const responseJson = await RequestPOST(apis.url, apis.options, params, errorCallback);
      try {
        if (responseJson && responseJson.code >= 0) {

          successCallback && successCallback(responseJson.data);
        } else {
          !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
        }
      } catch (error) {
        // console.log(error);
        responseErrorMessage('系统错误:' + error);
        errorCallback && errorCallback({ data: {}, message: 'servererror' });
      }
    };

export const getNotifySystem = (user_id, errorCallback, successCallback) => async (dispatch) => {
  dispatch({ type: GET_NOTIFY_MESSAGE.PENDING });
  let params = { user_id };
  const apis = getApis(ROUTER.USER.GET_NOTIFY_SYSTEM_MESSAGE, params);
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
        dispatch({
          type: GET_NOTIFY_MESSAGE.SUCCESS,
          data: responseJson.data,
          message: responseJson.message,
        });
        successCallback && successCallback(responseJson.data);
      } else {
        dispatch({
          type: GET_NOTIFY_MESSAGE.ERROR,
          data: responseJson.data,
          message: responseJson.message,
        });
        !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
      }
    }
  } catch (error) {
    // console.log(error);
    responseErrorMessage('系统错误:' + error);
    errorCallback && errorCallback({ data: {}, message: 'servererror' });
  }
};

export const readNotifySystem = (user_id, notice_id, errorCallback, successCallback) => async (dispatch) => {
  // dispatch({ type: GET_NOTIFY_MESSAGE.PENDING });
  let params = { user_id, notice_id };
  const tokenInfo = await getAccessToken();
  const apis = getApis('user/readNotifySystem', params);
  // console.log('readNotifySystem---------------------------- responseJson', apis, user_id, notice_id, params);
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
    if (responseJson.code >= 0) {
      successCallback && successCallback(responseJson.data);
    } else {
      !checkMiddleError(responseJson) && errorCallback && errorCallback(responseJson);
    }
  } catch (error) {
    // console.log(error);
    responseErrorMessage('系统错误:' + error);
    errorCallback && errorCallback({ data: {}, message: 'servererror' });
  }
};

export const saveAppInfo = (configData) => async (dispatch) => { };

export const initGlobalConfig = (payload) => async (dispatch) => {
  // const resourceVersion = await getAppResourceVersion();
  // const clientVersion = await getAppVersion();

  const resourceVersion = await getAppResourceVersion();
  const clientVersion = await getAppVersion();
  // console.log("initGlobalConfig", payload);
  dispatch({
    type: INIT_GLOBAL,
    data: { ...payload, ...{ clientVersion, resourceVersion } },

    // message: responseJson.message,
  });
};
