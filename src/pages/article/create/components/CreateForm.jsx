import { Form, Input, Modal } from 'antd';
import React from 'react';
const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
    
  };

  return (
    <Modal
      destroyOnClose
      title="新增分类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="名称"
      >
        {form.getFieldDecorator('newClassify', {
          rules: [
            {
              required: true,
              message: '请输入分类名称'
            },
          ],
        })(<Input placeholder="请不要添加已经存在的分类" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
