import {
  Button,
  Card,
  DatePicker,
  Form,
  Upload,
  Icon,
  Input,
  Switch,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  Spin,
  Divider,
  Row,
  Col
} from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import Link from 'umi/link'
import TableForm from './components/TableForm';
import CreateForm from './components/CreateForm';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

@connect(({ goodsForm, loading }) => ({
  goodsForm,
  loading: loading.models.goodsForm,
  goodsData: goodsForm.goodsData,
}))
class goodsCreateForm extends Component {
  state = {
    modalVisible: false,
  };
  componentDidMount() {
    const id = this.props.location.query.id;
    if (id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'goodsForm/fetch',
        payload: { id },
        callback: response => {
          this.setBaseInfo(response);
        },
      });
    } else {
    }
    console.log(this.props, 444);
  }
  componentWillUnmount() {}

  // 是否编辑
  isEdit() {
    return this.props.route.path == '/goods/edit' ? true : false;
  }

  setBaseInfo = data => {
    const { form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = data[key] || null;
      obj.created_at = moment(data.created_at);
      obj.content = BraftEditor.createEditorState(data.content);
      form.setFieldsValue(obj);
    });
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();

    if (this.isEdit()) {
      // 编辑
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'goodsForm/saveForm',
            payload: {
              ...values,
              id: this.props.location.query.id,
              content: values.content.toHTML(),
            },
          });
        }
      });
    } else {
      // 新增
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'goodsForm/submitForm',
            payload: {
              ...values,
              content: values.content.toHTML(),
            },
          });
        }
      });
    }
  };

  addgoods() {}
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  handleSelectChange(value) {
    console.log(`selected ${value}`);
  }

  render() {
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { submitting, loading, modalVisible } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 22 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 2,
        },
      },
    };
    // 编辑器模块
    const excludeControls = [
      'letter-spacing',
      'line-height',
      'clear',
      'headings',
      'list-ol',
      'list-ul',
      'remove-styles',
      'superscript',
      'subscript',
      'hr',
      'text-align',
    ];
    const content = (
      <div className={styles.pageHeaderContent}>
        <Link to="list">返回列表</Link>
      </div>
    );
    return (
      <PageHeaderWrapper content={content}>
        {/* <Spin spinning={loading} tip="Loading..."> */}
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '商品名称不能为空',
                  },
                ],
              })(<Input placeholder="请输入商品名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图">
              <Upload
                name={'file'}
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={'/api/admin/file/upload'}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">上传图片</div>
                </div>
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator('classify', {
                rules: [
                  {
                    required: true,
                    message: '商品分类不能为空',
                  },
                ],
              })(
                <Select placeholder="请选择商品分类">
                  <Option value="鱼">鱼</Option>
                  <Option value="生鲜">生鲜</Option>
                  <Option value="新增分类">新增分类</Option>
                  {/* {items.map(item => (
                    <Option key={item}>{item}</Option>
                  ))} */}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('desc')(
                <TextArea
                  style={{
                    minHeight: 24,
                  }}
                  placeholder="请输入商品描述"
                  rows={3}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品参数">
              {getFieldDecorator('desc')(
                <TextArea
                  style={{
                    minHeight: 24,
                  }}
                  placeholder="请输入商品参数"
                  rows={3}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout2} label="商品规格">
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
            </FormItem>

            {/* 规格，库存，价格，会员价格 */}
            <FormItem {...formItemLayout2} label="商品规格">
              {getFieldDecorator('members', {
                initialValue: tableData,
              })(<TableForm />)}
            </FormItem>

            {/* headers={{ authorization: 'Bearer ' + sessionStorage['token'] }} */}

            <FormItem {...formItemLayout2} label="商品详情">
              <div style={{ border: '1px solid #d1d1d1', borderRadius: '5px' }}>
                {getFieldDecorator('content', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      validator: (_, value, callback) => {
                        if (value.isEmpty()) {
                          callback('请输入正文内容');
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<BraftEditor excludeControls={excludeControls} placeholder="请输入正文内容" />)}
              </div>
            </FormItem>
            {this.isEdit() && (
              <FormItem {...formItemLayout} label="创建时间">
                {getFieldDecorator('created_at')(
                  <DatePicker showTime placeholder="请选择创建时间" />,
                )}
              </FormItem>
            )}
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              {!this.isEdit() ? (
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
              ) : (
                <Button type="primary" htmlType="submit" loading={submitting}>
                  保存
                </Button>
              )}
            </FormItem>
          </Form>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {/* </Spin> */}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(goodsCreateForm);
