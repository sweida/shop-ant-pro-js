import request from '@/utils/request';

export async function queryAd(params) {
  return request('/api/ad/list', {
    method: 'POST',
    params,
  });
}
export async function AdDelete(params) {
  return request('/api/ad/delete', {
    method: 'POST',
    params,
  });
}
// 批量删除
export async function AdBatchDelete(params) {
  return request('/api/ad/batchDelete', {
    method: 'POST',
    params,
  });
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
