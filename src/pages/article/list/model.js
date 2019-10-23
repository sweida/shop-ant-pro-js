import { addRule, queryArticle, removeRule, updateRule } from './service';

const Model = {
  namespace: 'articleList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryArticle, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      console.log(response);
      
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data,
          pagination: {
            total: action.payload.total,
            pageSize: 10,
            current: action.payload.current_page
          }
        },
      };
    },
  },
};
export default Model;
