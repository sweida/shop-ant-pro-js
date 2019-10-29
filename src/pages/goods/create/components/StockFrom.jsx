import { Form, Input, Button, Modal, Row, Col } from 'antd';
import React from 'react';
const FormItem = Form.Item;

const StockForm = props => {
  const { data, index, form, handleAddStock, removeStock } = props;
  // const {
  //   form: { getFieldDecorator },
  // } = this.props;
  // const okHandle = () => {
  //   form.validateFields((err, fieldsValue) => {
  //     if (err) return;
  //     handleAdd(fieldsValue);
  //   });
  // };
  

  return (
    <Row gutter={8}>
      <Col span={1}>
        <span>NO.{data.label_id}</span>
      </Col>
      <Col span={4}>
        <FormItem>
          {form.getFieldDecorator('label', {
            rules: [{ required: true, message: '商品规格不能为空' }],
          })(<Input placeholder="商品规格名称" />)}
        </FormItem>
      </Col>
      <Col span={4}>
        <FormItem>
          {form.getFieldDecorator('stock', {
            rules: [{ required: true, message: '商品库存不能为空' }],
          })(<Input placeholder="请输入库存" />)}
        </FormItem>
      </Col>
      <Col span={4}>
        <FormItem>
          {form.getFieldDecorator('price', {
            rules: [{ required: true, message: '请输入商品价格' }],
          })(<Input placeholder="请输入商品价格" />)}
        </FormItem>
      </Col>
      <Col span={4}>
        <FormItem>
          {form.getFieldDecorator('vip_price')(<Input placeholder="请输入会员价格" />)}
        </FormItem>
      </Col>
      <Col span={4}>
        {data.label_id == 1 ? (
          <Button type="primary" onClick={handleAddStock}>
            新增商品规格
          </Button>
        ) : (
          <Button onClick={() => removeStock(data.key)}>删除</Button>
        )}
        {/* <Button onClick={this.removeStock}>删除</Button> */}
      </Col>
    </Row>
  );
};

export default Form.create()(StockForm);
