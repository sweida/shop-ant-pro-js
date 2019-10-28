import { message } from 'antd'

export function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('请上传 JPG/PNG 格式的文件!');
  }
  let num = 4;
  const isLt2M = file.size / 1024 / 1024 < num;
  if (!isLt2M) {
    message.error('图片大小不能超过' + num + 'M');
  }
  return isJpgOrPng && isLt2M;
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
