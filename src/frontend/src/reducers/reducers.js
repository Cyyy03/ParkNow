import * as actionTypes from '../actions/actiontypes';
import { responseErrorMessage } from '../util/tool';

const initialState = {
  isFetching: false,
  isLogin: false,
  isRegister: false,
  isError: false,
  isAuthenticated: false,
  loginSuccessMsg: '',
  userId: 1,
  userTeams: {
    isFetching: false,
    isError: false,
    errorMsg: '',
    successMsg: '',
    total: [],
    users: [],
  },

  accessToken: null,
  errorMsg: '',
  data: [],
  words: [],
  codes: [],
  code: '',
  loginData: { id: 5 },
  registerData: null,
};

const fetchDataReducer = (state = initialState, action) => {
  console.log('new acttion', action);
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return {
        ...state,
        loginSuccessMsg: '',
        isLogin: false,
      };
    case actionTypes.LOAD_USER_DATA:
      return {
        ...state,
        loginData: action.data,
        isAuthenticated: true,
        isLogin: false,
      };

    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLogin: true,
        loginSuccessMsg: action.message,
        loginData: action.data,
      };
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        isLogin: false,
        isError: true,
        errorMsg: action.message,
      };
    case actionTypes.SENDCODE_START:
      return {
        ...state,
        isSendCode: false,
      };
    case actionTypes.SENDCODE_SUCCESS:
      return {
        ...state,
        isSendCode: true,
        code: action.data,
      };
    case actionTypes.SENDCODE_FAIL:
      return {
        ...state,
        isSendCode: false,
      };
    case actionTypes.SENDCODE_WAIT:
      return {
        ...state,
        isSendCode: false,
      };
    case actionTypes.REGISTER_START:
      return {
        ...state,
        isRegister: false,
      };
    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isRegister: true,
        registerData: action.data,
      };
    case actionTypes.REGISTER_FAIL:
      return {
        ...state,
        isRegister: false,
        isError: true,
        errorMsg: action.message,
      };
    case actionTypes.FETCH_WORDS_START:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.FETCH_WORDS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        words: action.data.words,
        codes: action.data.code,
      };
    case actionTypes.FETCH_WORDS_FAIL:
      return {
        ...state,
        isFetching: false,
        isError: true,
        errorMsg: action.message,
      };

    case actionTypes.FETCH_USER_INFO_START:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.FETCH_USER_INFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        userInfo: action.data,
      };
    case actionTypes.FETCH_USER_INFO_FAIL:
      return {
        ...state,
        isFetching: false,
        isError: true,
        errorMsg: action.message,
      };

    case actionTypes.ERROR_RESET:
      return {
        ...state,
        isError: false,
        errorMsg: '',
      };

    default:
      return state;
  }
};

export default fetchDataReducer;
