import { createSlice, createEntityAdapter, createDraftSafeSelector, current, createAsyncThunk } from '@reduxjs/toolkit';
import { filter as lodashFilter, get } from 'lodash';
import { getUUid } from '../util/tool';
import { showToast } from '../helpers/ToastHelper';
import APIHelper from '../helpers/APIHelper';
import { SUBMIT_STATUS } from '../constants/'


export const toolsAdapter = createEntityAdapter({
  selectId: conversation => conversation.id,
});


export const toolsActions = {
  fetchTopic: createAsyncThunk(
    'aiTopic/fetchTopics',
    async (
      { page = 1, callback = null },
      { rejectWithValue },
    ) => {

      try {
        const params = {
          page,
        }
        console.log("params==", params);
        const res = await APIHelper.request("fetchTopics", params);
        callback && callback(res);
        return res;
      } catch (error) {
        console.log(error);
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }

    },
  ),

  submitTopic: createAsyncThunk(
    'aiTopic/submitTopic',
    async ({ data, topic, userId, callback }, { dispatch, rejectWithValue }) => {
      try {
        console.log("....", data, topic, userId);
        const params = {

          topic,
          userId,
          data: JSON.stringify(data)
        }
        console.log("params==", params);
        // submitTopic
        const res = await APIHelper.request("submitTopic", params);
        callback && callback(res);
        return res;
      } catch (error) {
        console.log(error);
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
    },
  ),
};

// The selected group or user can fully administer exchange system information and modify permissions
const toolsSlice = createSlice({
  name: 'tools',
  initialState: toolsAdapter.getInitialState({
    // selectedConversation: null,
    loading: false,
    permissions: [],
    // toolsAdapter
    status: SUBMIT_STATUS.WAIT,
    data: {},
    // submitParams: {},
    topics: {

    },
    error: {
      message: {

      }
    },
  }),
  reducers: {

    setPermission: (state, action) => {
      const permissions = get(action, 'payload', []);
      console.log("setPermission", permissions);
      state.permissions = permissions
    },
    reset: (state, action) => {
      // state.loading = false;
      // state.status = SUBMIT_STATUS.WAIT;
    },
    loadTopics: (state, action) => {
      // const data = get(action, 'payload', {});
      // console.log("loadTopics action", action);
      // state.topics = get(action, 'payload', {});
    }
  },
  extraReducers: (builder) => {
    builder.addCase(toolsActions.submitTopic.pending, (state, action) => {
      state.loading = true;
      state.status = SUBMIT_STATUS.LOADING;
      console.log("loading----");
    })
      .addCase(toolsActions.submitTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.status = SUBMIT_STATUS.FINISH;
        state.data = action.payload;
      })
      .addCase(toolsActions.submitTopic.rejected, (state, action) => {
        state.loading = false;
        state.status = SUBMIT_STATUS.FINISH;
      });
  },
});
export const toolsSelector = toolsAdapter.getSelectors(state => state.tools);
export const toolsData = state => state.tools;
export const toolsPermissions = state => state.tools.permissions;

export const userData = state => state.auth.userData;
export const userInfo = state => state.auth.userInfo.data;
export const globalData = state => state.global;

export const {
  reset,
  setPermission
  // loadTopics
} = toolsSlice.actions;

export default toolsSlice.reducer;
