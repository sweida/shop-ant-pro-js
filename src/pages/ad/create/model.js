import { message } from 'antd';
import { adCreate, adEdit, adDetail, adClassifys } from './service';
import router from 'umi/router'

const Model = {
  namespace: 'adForm',
  state: {
    adData: {
      url: '',
    },
    classifys: [],
  },
  effects: {
    // payload 请求参数
    // callback 回调
    // call 请求地址
    // put 操作返回值
    *fetch({ payload, callback }, { call, put }) {
      let params = { ...payload, all: 'all' };
      const response = yield call(adDetail, params);
      yield put({
        type: 'detail',
        payload: response,
      });
      if (callback) callback(response.data);
    },
    setImgUrl({ payload }, { put }) {
      put({
        type: 'uploadImg',
        payload: payload,
      });
    },
    // 获取分类
    *getClassifys({}, { call, put }) {
      const response = yield call(adClassifys);
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
    // 新增广告
    *submitForm({ payload }, { call }) {
      const res = yield call(adCreate, payload);
      if (res.status == 'success') {
        message.success(res.message);
        setTimeout(() => {
          router.push('/ad/list');
        }, 300);
      } else {
        message.error(res.message);
      }
    },
    *saveForm({ payload }, { call }) {
      const res = yield call(adEdit, payload);
      if (res.status == 'success') {
        message.success('广告修改成功！');
        setTimeout(() => {
          router.push('/ad/list');
        }, 300);
      } else {
        message.error(res.message);
      }
    },
  },
  reducers: {
    uploadImg(state, action) {
      return {
        ...state,
        adData: {
          url: action.payload,
        },
      };
    },
    detail(state, action) {
      return {
        ...state,
        adData: action.payload.data,
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
