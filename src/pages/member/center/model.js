import { queryUserCenter } from './service';

const Model = {
  namespace: 'memberCenter',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserCenter, payload);
      yield put({
        type: 'saveCurrent',
        payload: response.data,
      });
      console.log(response, 1234);
      
    },
  },
  reducers: {
    saveCurrent(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
export default Model;
