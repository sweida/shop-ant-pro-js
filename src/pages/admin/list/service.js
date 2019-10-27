import request from '@/utils/request';

export async function queryAdmin(params) {
  return request('/api/admin/list', {
    method: 'POST',
    params,
  });
}

export async function deleteOrRestored(params) {
  return request('/api/admin/deleteOrRestored', {
    method: 'POST',
    params,
  });
}

export async function reallyDelete(params) {
  return request('/api/admin/reallyDelete', {
    method: 'POST',
    params,
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
