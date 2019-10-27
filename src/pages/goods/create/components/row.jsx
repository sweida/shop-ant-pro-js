import { Form, Input, Modal } from 'antd';
import React from 'react';
const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Row gutter={8}>
      <Col span={1}>
        <span>NO.1</span>
      </Col>
      <Col span={4}>
        {getFieldDecorator('captcha', {
          rules: [{ required: true, message: 'Please input the captcha you got!' }],
        })(<Input placeholder="请输入规格标签" />)}
      </Col>
      <Col span={4}>
        {getFieldDecorator('captcha', {
          rules: [{ required: true, message: 'Please input the captcha you got!' }],
        })(<Input placeholder="请输入库存" />)}
      </Col>
      <Col span={4}>
        {getFieldDecorator('captcha', {
          rules: [{ required: true, message: 'Please input the captcha you got!' }],
        })(<Input placeholder="请输入商品价格" />)}
      </Col>
      <Col span={4}>
        {getFieldDecorator('captcha', {
          rules: [{ required: true, message: 'Please input the captcha you got!' }],
        })(<Input placeholder="请输入商品会员价格" />)}
      </Col>
      <Col span={4}>
        <Button type="primary">新增商品规格</Button>
      </Col>
    </Row>
  );
};

export default Form.create()(CreateForm);
