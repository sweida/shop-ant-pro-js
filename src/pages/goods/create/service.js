import request from '@/utils/request';

export async function goodsCreate(params) {
  return request('/api/goods/add', {
    method: 'POST',
    data: params,
  });
}

export async function goodsDetail(params) {
  return request('/api/goods', {
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