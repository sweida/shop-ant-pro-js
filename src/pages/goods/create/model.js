import { message } from 'antd';
import { goodsCreate, goodsEdit, goodsDetail, goodsClassifys } from './service';
import router from 'umi/router'

const Model = {
  namespace: 'goodsForm',
  state: {
    goodsData: {},
    classifys: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(goodsDetail, payload);
      yield put({
        type: 'detail',
        payload: response,
      });
      if (callback) callback(response.data);
    },
    // 获取分类
    *getClassifys({}, { call, put }) {
      const response = yield call(goodsClassifys);
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
      yield call(goodsCreate, payload);
      message.success('商品新增成功！');
      setTimeout(() => {
        router.push('/goods/list');
      }, 300);
    },
    *saveForm({ payload }, { call }) {
      const res = yield call(goodsEdit, payload);
      if (res.status == 'success') {
        message.success('商品修改成功！');
        setTimeout(() => {
          router.push('/goods/list');
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
        goodsData: action.payload.data,
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
