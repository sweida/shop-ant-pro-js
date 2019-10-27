import { message } from 'antd';
import { goodsCreate, goodsEdit, goodsDetail } from './service';
import router from 'umi/router'

const Model = {
  namespace: 'goodsForm',
  state: {
    goodsData: {},
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(goodsDetail, payload);
      yield put({
        type: 'detail',
        payload: response.data,
      });
      if (callback) callback(response.data);
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
      if (res.status=='success'){
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
        goodsData: action,
      };
    },
  },
};
export default Model;
