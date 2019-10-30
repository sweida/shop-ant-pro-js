import { message } from 'antd';
import { articleCreate, articleEdit, articleDetail, articleClassifys } from './service';
import router from 'umi/router'

const Model = {
  namespace: 'articleForm',
  state: {
    articleData: {},
    classifys: [],
  },
  effects: {
    // payload 请求参数
    // callback 回调
    // call 请求地址
    // put 操作返回值
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(articleDetail, payload);
      yield put({
        type: 'detail',
        payload: response,
      });
      if (callback) callback(response.data);
    },
    // 获取分类
    *getClassifys({}, { call, put }) {
      const response = yield call(articleClassifys);
      yield put({
        type: 'classify',
        payload: response.data,
      });
    },
    // 新增分类
    *addClassifys({ payload }, { call, put }) {
      yield put({
        type: 'classify',
        payload: payload,
      });
    },
    *submitForm({ payload }, { call }) {
      const res = yield call(articleCreate, payload);
      if (res.status == 'success') {
        message.success(res.message);
        setTimeout(() => {
          router.push('/article/list');
        }, 300);
      } else {
        message.error(res.message);
      }
    },
    *saveForm({ payload }, { call }) {
      const res = yield call(articleEdit, payload);
      if (res.status == 'success') {
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
        articleData: action.payload.data,
      };
    },
    classify(state, action) {
      return {
        ...state,
        classifys: action.payload,
      };
    },
  },
};
export default Model;
