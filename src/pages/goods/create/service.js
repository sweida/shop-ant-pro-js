import request from '@/utils/request';


export async function goodsCreate(params) {
  return request('/api/goods/add', {
    method: 'POST',
    data: params,
  });
}

export async function goodsDetail(params) {
  return request('/api/goods/detail', {
    method: 'POST',
    data: params,
  });
}

export async function goodsEdit(params) {
  return request('/api/goods/edit', {
    method: 'POST',
    data: params,
  });
}

export async function goodsClassifys() {
  return request('/api/goods/classify');
}
