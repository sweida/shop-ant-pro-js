import request from '@/utils/request';

export async function articleCreate(params) {
  return request('/api/article/add', {
    method: 'POST',
    data: params,
  });
}

export async function articleDetail(params) {
  return request('/api/article', {
    method: 'POST',
    data: params,
  });
}

export async function articleClassifys() {
  return request('/api/article/classifys');
}

export async function articleEdit(params) {
  return request('/api/article/edit', {
    method: 'POST',
    data: params,
  });
}