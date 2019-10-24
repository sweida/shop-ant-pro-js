import { message } from 'antd';
import { articleCreate, articleDetail } from './service';
import router from 'umi/router'

const Model = {
  namespace: 'articleForm',
  state: {
    articleData: {}
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(articleDetail, payload);
      yield put({
        type: 'detail',
        payload: response,
      });
      console.log(response);
    },
    *submitForm({ payload }, { call }) {
      yield call(articleCreate, payload);
      message.success('文章新增成功！');
      setTimeout(() => {
        router.push('/article/list');
      }, 300);
    },
  },
  reducers: {
    detail(state, action) {
      return {
        ...state,
        articleData: action,
      };
    },
  },
};
export default Model;
