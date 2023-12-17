import { unionBy } from 'lodash';
import {
  LOGIN,
  REGISTER,
  GET_USER_INFO,
  LOGOUT_SUCCESS,
  LOGOUT,
  AUTH_SUCCESS,
  LOAD_USER_DATA_SUCCESS,
  SAVE_USER_CONFIG,
  BIND_USER,
  GET_USER_TEAMS,
  GET_USER_MESSAGE,
  WECHAT,
  UPDATE_USER_INTEGRAL,
  UPDATE_USER,
} from '../actions/auth/actiontypes';
import { responseErrorMessage, responseNoticeMessage } from '../util/tool';
import { uniqBy } from 'lodash';
import { showToast } from '../util/ToastHelper';
const initialState = {
  isLoggingIn: false,
  isPostLoginData: false,
  isRegisteringIn: false,
  isLoginError: false,
  isAuthenticated: false,
  loginSuccessMsg: '',
  userId: 1,
  accessToken: null,
  errorMsg: '',
  loginData: {},
  userData: {},
  userConfig: {},
  wechat: {
    data: {},
    isPending: false,
    errorMsg: '',
    successMsg: '',
    isError: false,
    isFetched: false,
  },

  messages: {
    data: [],
    errorMsg: '',
    successMsg: '',
    currentPage: 1,
    totalPage: 0,
    isError: false,
    isFetching: false,
  },

  teamers: {
    data: {},
    isPending: false,
    errorMsg: '',
    successMsg: '',
    isError: false,
    isFetched: false,
  },

  binduser: {
    data: {},
    isPending: false,
    errorMsg: '',
    successMsg: '',
    isError: false,
    isFetched: false,
  },

  // userInfo: { id: 1 },
  userInfo: {
    data: {},
    isPending: false,
    errorMsg: '',
    successMsg: '',
    isError: false,
    isFetching: false,
  },
  registerData: {
    data: [],
    isPending: false,
    errorMsg: '',
    successMsg: '',
    isError: false,
    isFetched: false,
  },
};

const authDataReducer = (state = initialState, action) => {
  // responseErrorMessage('12312312' + JSON.stringify({ action: action.type }));
  switch (action.type) {
    case BIND_USER.PENDING:
      return {
        ...state,
        binduser: {
          ...state.binduser,
          isPending: true,
          isFetched: false,
        },
      };

    case SAVE_USER_CONFIG:
      return {
        ...state,
        userConfig: {
          ...state.userConfig,
          ...action,
        },
      };

    case BIND_USER.SUCCESS:
      return {
        ...state,
        binduser: {
          ...state.binduser,
          isPending: false,
          isFetched: true,
          isError: false,
          data: action.data,
          successMsg: action.message,
        },
        userData: action.data,
      };
    case BIND_USER.ERROR:
      return {
        ...state,
        binduser: {
          ...state.binduser,
          isPending: false,
          isFetched: true,
          isError: true,
          data: action.data,
          errorMsg: action.message,
        },
      };

    case WECHAT.RESET:
      return {
        ...state,
        wechat: {
          ...state.wechat,
          isPending: false,
          isFetched: false,
        },
      };

    case WECHAT.PENDING:
      return {
        ...state,
        wechat: {
          ...state.wechat,
          isPending: true,
          isFetched: false,
        },
      };
    case WECHAT.SUCCESS:
      return {
        ...state,
        wechat: {
          ...state.wechat,
          isPending: false,
          isFetched: true,
          isError: false,
          data: action.data,
          successMsg: action.message,
        },
        userData: action.data,
        userInfo: {
          ...state.userInfo,
          data: action.data,
        },
      };
    case WECHAT.ERROR:
      return {
        ...state,
        wechat: {
          ...state.wechat,
          isPending: false,
          isFetched: true,
          isError: true,
          data: action.data,
          errorMsg: action.message,
        },
      };

    case LOAD_USER_DATA_SUCCESS:
      console.log("LOAD_USER_DATA_SUCCESS");
      return {
        ...state,
        userData: action.data,
        isAuthenticated: true,
      };
    // UPDATE_USER
    case UPDATE_USER.SUCCESS:
      return {
        ...state,
        userData: action.data,
      };
    case LOGIN.PENDING:
      return {
        ...state,
        isLoggingIn: true,
        isPostLoginData: false,
        isAuthenticated: false,
      };
    case LOGIN.SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        // isAuthenticated: true,
        isPostLoginData: true,
        isLoginError: false,

        loginSuccessMsg: action.message,
        userData: action.data,
      };
    case AUTH_SUCCESS:
      // isAuthenticated

      let authData = {
        ...state,
        isAuthenticated: true,
        wechat: {
          ...state.wechat,
          isPending: false,
          isFetched: false,
        },
      };
      return authData;
    case LOGIN.ERROR:
      return {
        ...state,
        isLoggingIn: false,
        isPostLoginData: true,
        isAuthenticated: false,
        isLoginError: true,
        errorMsg: action.message,
      };
    case LOGIN.RESET:
      return {
        ...state,
        isLoggingIn: false,
        isPostLoginData: false,
      };
    case LOGOUT:
      break;
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isPostLoginData: false,
        isAuthenticated: false,
        userInfo: initialState.userInfo,
        userData: initialState.userData,
      };

    /********* 用户中心****  */

    case GET_USER_INFO.PENDING:
      return {
        ...state,
        userInfo: {
          isPending: true,
          isFetching: false,
          isError: false,
          data: [],
          errorMsg: '',
          successMsg: '',
        },
      };
    case UPDATE_USER_INTEGRAL.SUCCESS:
      // showToast({ message: `UPDATE_USER_INTEGRAL- ${JSON.stringify({ d: action.data })}` })
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          data: {
            ...state.userInfo.data,
            ...{
              total_user_integral: action.data
            }
          },
        },
        // registerData: action.payload,
      };
    case GET_USER_INFO.SUCCESS:
      return {
        ...state,
        userInfo: {
          isPending: false,
          isFetching: false,
          isError: false,
          data: action.data,
          errorMsg: '',
          successMsg: action.message,
        },
        // registerData: action.payload,
      };

    case GET_USER_INFO.ERROR:
      return {
        ...state,
        userInfo: {
          isFetching: true,
          isError: true,
          data: {},
          isPending: false,
          errorMsg: action.message,
          successMsg: '',
        },
      };
    case GET_USER_INFO.RESET:
      return {
        ...state,
        userInfo: {
          isFetching: false,
          isError: false,
          data: {},
          isPending: false,
          errorMsg: '',
          successMsg: '',
        },
      };
    /****  团队信息 */

    case GET_USER_TEAMS.PENDING:
      return {
        ...state,
        teamers: {
          isPending: true,
          isFetching: false,
          isError: false,
          data: [],
          errorMsg: '',
          successMsg: '',
        },
      };
    case GET_USER_TEAMS.SUCCESS:
      return {
        ...state,
        teamers: {
          isPending: false,
          isFetching: true,
          isError: false,
          data: action.data,
          errorMsg: '',
          successMsg: action.message,
        },
        // registerData: action.payload,
      };

    case GET_USER_TEAMS.ERROR:
      return {
        ...state,
        teamers: {
          isFetching: true,
          isError: true,
          data: {},
          isPending: false,
          errorMsg: action.message,
          successMsg: '',
        },
      };
    case GET_USER_TEAMS.RESET:
      return {
        ...state,
        teamers: {
          isFetching: false,
          isError: false,
          data: {},
          isPending: false,
          errorMsg: '',
          successMsg: '',
        },
      };

    /****  用户信息 */

    case GET_USER_MESSAGE.PENDING:
      return {
        ...state,
        messages: {
          ...state.messages,

          isPending: true,
          isFetching: false,
          isError: false,
          // data: [],
          errorMsg: '',
          successMsg: '',
        },
      };
    case GET_USER_MESSAGE.SUCCESS:

      let user_messages = state.messages.data;
      if (action.data.page > 1 && action.data && action.data.data.length > 0) {
        user_messages = state.messages.data.concat(action.data.data);
      } else {
        user_messages = action.data.data;
      }

      return {
        ...state,
        messages: {
          ...state.messages,
          data: uniqBy(user_messages, 'id'),
          // eslint-disable-next-line radix
          totalPage: parseInt(action.data.totalPage),
          // eslint-disable-next-line radix
          page: parseInt(action.data.page),
          errorMsg: '',
          successMsg: action.message,
          isError: false,
          isFetching: false,
        },
      };

    case GET_USER_MESSAGE.ERROR:
      return {
        ...state,
        messages: {
          isFetching: true,
          isError: true,
          data: {},
          isPending: false,
          errorMsg: action.message,
          successMsg: '',
        },
      };
    case GET_USER_TEAMS.RESET:
      return {
        ...state,
        teamers: {
          isFetching: false,
          isError: false,
          data: {},
          isPending: false,
          errorMsg: '',
          successMsg: '',
        },
      };

    /*********** *************/

    case REGISTER.PENDING:
      return {
        ...state,
        registerData: {
          isPending: true,
          isFetched: false,
          isError: false,
          data: {},
          errorMsg: '',
          successMsg: '',
        },
      };
    case REGISTER.SUCCESS:
      // await asyncSaveData("user_data", action.data);
      return {
        ...state,
        registerData: {
          isPending: false,
          isFetched: true,
          isError: false,
          data: action.data,
          errorMsg: '',
          successMsg: action.message,
        },
        userData: action.data,
      };
    case REGISTER.ERROR:
      return {
        ...state,
        registerData: {
          isFetched: true,
          isError: true,
          data: {},
          isPending: false,
          errorMsg: action.message,
          successMsg: '',
        },
      };
    case REGISTER.RESET:
      return {
        ...state,
        registerData: {
          isFetched: false,
          isError: false,
          data: {},
          isPending: false,
          errorMsg: '',
          successMsg: '',
        },
      };
    default:
      return state;
  }
};

export default authDataReducer;
