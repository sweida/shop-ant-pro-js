import request from '@/utils/request';

export async function queryUserCenter(params) {
  return request('/api/user/center', {
    method: 'POST',
    params,
  });
}
export async function queryFakeList(params) {
  return request('/api/fake_list', {
    params,
  });
}
