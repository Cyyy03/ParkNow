import { createActionSet } from '../../util';

export const LOAD_CONFIG_DATA_SUCCESS = 'LOAD_CONFIG_DATA_SUCCESS';

export const INDEX_DATA = createActionSet('INDEX_DATA');

export const UPDATE_TASK = createActionSet('UPDATE_TASK');

export const INIT_AD = createActionSet('INIT_AD');
export const INIT_GLOBAL = 'INIT_GLOBAL';
export const BACK_LOGIN = 'BACK_LOGIN';

export const CAPTCHA_CODE = {
  SHOW: 'CAPTCHA_CODE_SHOW',
  ERROR: 'CAPTCHA_CODE_ERROR',
  SUCCESS: 'CAPTCHA_CODE_SUCCESS',
  // {
  //     PENDING: c,
  //     SUCCESS: `${actionName}_SUCCESS`,
  //     ERROR: `${actionName}_ERROR`,
  //     RESET: `${actionName}_RESET`,
  //     actionName,
  //   }
};

export const CREATE_AD_LOG = createActionSet('CREATE_AD_LOG');

export const RUN_PROP_TASK = createActionSet('RUN_PROP_TASK');

export const GET_NOTIFY_MESSAGE = createActionSet('GET_NOTIFY_MESSAGE');

export const GET_GLOBAL = createActionSet('GET_NOTIFY_MESSAGE');
