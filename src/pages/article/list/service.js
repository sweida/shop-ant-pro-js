import request from '@/utils/request';

export async function queryArticle(params) {
  return request('/api/article/list', {
    method: 'POST',
    params,
  });
}

export async function deleteOrRestored(params) {
  return request('/api/article/deleteOrRestored', {
    method: 'POST',
    params,
  });
}

export async function reallyDelete(params) {
  return request('/api/article/reallyDelete', {
    method: 'POST',
    params,
  });
}
