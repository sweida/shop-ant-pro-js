import { message } from 'antd';
import { articleCreate, articleEdit, articleDetail } from './service';
import router from 'umi/router'

const Model = {
  namespace: 'articleForm',
  state: {
    articleData: {},
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(articleDetail, payload);
      yield put({
        type: 'detail',
        payload: response.data,
      });
      if (callback) callback(response.data);
    },
    *submitForm({ payload }, { call }) {
      yield call(articleCreate, payload);
      message.success('文章新增成功！');
      setTimeout(() => {
        router.push('/article/list');
      }, 300);
    },
    *saveForm({ payload }, { call }) {
      const res = yield call(articleEdit, payload);
      if (res.status=='success'){
        message.success('文章修改成功！');
        setTimeout(() => {
          router.push('/article/list');
        }, 300);
      } else {
        message.error(res.message);
      }
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
