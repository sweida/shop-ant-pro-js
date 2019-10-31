import request from '@/utils/request';

export async function adCreate(params) {
  return request('/api/ad/add', {
    method: 'POST',
    data: params,
  });
}

export async function adDetail(params) {
  return request('/api/ad', {
    method: 'POST',
    data: params,
  });
}

export async function adClassifys() {
  return request('/api/ad/classifys');
}

export async function adEdit(params) {
  return request('/api/ad/edit', {
    method: 'POST',
    data: params,
  });
}

export async function deleteImage(params) {
  return request('/api/image/delete', {
    method: 'POST',
    data: params,
  });
}