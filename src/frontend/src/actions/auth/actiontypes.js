import { createActionSet } from '../../util';

export const GET_INDEX_NODES_START = 'GET_INDEX_NODES_START';
export const GET_INDEX_NODES_SUCCESS = 'GET_INDEX_NODES_SUCCESS';
export const GET_INDEX_NODES_FAIL = 'GET_INDEX_NODES_FAIL';

export const LOAD_USER_DATA_SUCCESS = 'LOAD_USER_DATA_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SAVE_USER_CONFIG = 'SAVE_USER_CONFIG';

export const LOGIN = createActionSet('LOGIN');
export const REGISTER = createActionSet('REGISTER');
export const GET_USER_INFO = createActionSet('GET_USER_INFO');
export const BIND_USER = createActionSet('BIND_USER');
export const GET_USER_TEAMS = createActionSet('GET_USER_TEAMS');
export const GET_USER_MESSAGE = createActionSet('GET_USER_MESSAGE');
export const UPDATE_USER = createActionSet('UPDATE_USER');
export const UPDATE_USER_INTEGRAL = createActionSet('UPDATE_USER_INTEGRAL');



export const AUTH_SUCCESS = 'AUTH_SUCCESS';
