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
  Col,
  Modal,
  message
} from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import Link from 'umi/link'
import CreateForm from './components/CreateForm';
import TableForm from './components/TableForm';
import { deleteImage } from '@/pages/article/create/service'
import { beforeUpload, getBase64 } from '@/utils/upload'
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

// const stocksData = [
//   {
//     key: 1,
//     label_id: 1,
//     label: '22',
//     stock: 333,
//     price: 3322,
//     vip_price: 222,
//   },
//   {
//     key: 2,
//     label_id: 2,
//     label: '33',
//     stock: 444,
//     price: 555,
//     vip_price: 222,
//   },
// ];


@connect(({ goodsForm, loading }) => ({
  goodsForm,
  loading: loading.models.goodsForm,
}))
class goodsCreateForm extends Component {
  state = {
    modalVisible: false,
    previewVisible: false,
    uploadLoading: false,
    previewImage: '',
    fileList: [],
  };
  index = 2;

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'goodsForm/getClassifys',
    });

    const id = this.props.location.query.id;
    if (id) {
      dispatch({
        type: 'goodsForm/fetch',
        payload: { id },
        callback: response => {
          this.setBaseInfo(response);
        },
      });
    }
  }
  setBaseInfo = data => {
    const { form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = data[key] || null;
      obj.created_at = moment(data.created_at);
      obj.detail = BraftEditor.createEditorState(data.detail);
      form.setFieldsValue(obj);
    });
    // 没有uid会报错
    data.banners.forEach(item => {
      item.url = 'http://static.golang365.com/' + item.image;
    });
    data.stocks.forEach(item => {
      item.key = 'NEW_TEMP_ID_' + item.label_id;
    });
    this.setState({
      fileList: data.banners,
    });
  };
  componentWillUnmount() {}

  // 是否编辑
  isEdit() {
    return this.props.route.path == '/goods/edit' ? true : false;
  }

  // 保存和编辑
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();

    if (this.isEdit()) {
      // 因为预览图加了域名前缀
      let newList = [];
      this.state.fileList.forEach(item => {
        item.url = item.image;
        newList.push(item);
      });
      // 编辑
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'goodsForm/saveForm',
            payload: {
              ...values,
              id: this.props.location.query.id,
              detail: values.detail.toHTML(),
              banners: newList,
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
              detail: values.detail.toHTML(),
              banners: this.state.fileList,
              stocks: [
                {
                  label_id: 1,
                  label: '1',
                  stock: 888,
                  price: 1000,
                },
              ],
            },
          });
        }
      });
    }
  };

  // 添加新分类
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleAdd = fields => {
    const { dispatch, goodsForm } = this.props;
    const newData = [...goodsForm.classifys, fields.newClassify];
    dispatch({
      type: 'goodsForm/addClassifys',
      payload: newData,
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  // 查看大图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  // 关闭查看大图
  handleCancel = () => this.setState({ previewVisible: false });

  // 上传图片
  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    let lastFile = fileList[fileList.length - 1];
    if (fileList.length > 0 && lastFile.status === 'uploading') {
      return;
    }

    if (fileList.length > 0 && lastFile.status === 'done') {
      console.log(this.state.fileList, 4);

      if (lastFile.response && lastFile.response.status == 'success') {
        lastFile.url = lastFile.response.data.url;
        lastFile.image = lastFile.response.data.url;
        lastFile.good_id = this.props.location.query.id || '';
      } else {
        message.error(lastFile.response.message);
      }
      // 每次修改图片，更新number字段
      fileList.forEach((item, index) => {
        item.number = index + 1;
      });
      fileList[0].active = 'active';
      this.setState({ fileList });
    }
  };
  // 删除图片
  handleRemove = file => {
    let url = file.image;
    deleteImage({ image: url }).then(res => {
      message[res.status](res.message);
    });
  };

  // 新增商品规格
  handleAddStock = () => {
    console.log(222);
    const { stockBox = [] } = this.state;
    const newData = stockBox.map(item => ({ ...item }));
    newData.push({
      key: `NEW_STOCk_ID_${this.index}`,
      label_id: this.index,
      label: '',
      good_id: '',
      stock: 1000,
      price: 998,
    });
    this.index += 1;
    this.setState({
      stockBox: newData,
    });
  };
  removeStock = key => {
    const { stockBox = [] } = this.state;
    const newData = stockBox.filter(item => item.key !== key);
    this.setState({
      stockBox: newData,
    });
  };

  render() {
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { modalVisible, previewVisible, previewImage, fileList } = this.state;
    const {
      goodsForm,
      submitting,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { classifys } = goodsForm;

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
    const goBack = (
      <div className={styles.pageHeaderContent}>
        <Link to="list">返回列表</Link>
      </div>
    );
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return (
      <PageHeaderWrapper content={goBack}>
        <Spin spinning={loading} tip="Loading...">
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
              {/* headers={{ authorization: 'Bearer ' + sessionStorage['token'] }} */}
              <FormItem {...formItemLayout2} label="商品图">
                <Upload
                  name="image"
                  action={'/api/image/upload'}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                  onRemove={this.handleRemove}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                  style={{ textAlign: 'center' }}
                >
                  <img alt="example" src={previewImage} />
                </Modal>
              </FormItem>
              <FormItem {...formItemLayout} label="分类">
                <Row gutter={8}>
                  <Col span={18}>
                    {getFieldDecorator('classify', {
                      rules: [
                        {
                          required: true,
                          message: '商品分类不能为空',
                        },
                      ],
                    })(
                      <Select placeholder="请选择商品分类">
                        {classifys.map(item => (
                          <Option key={item}>{item}</Option>
                        ))}
                      </Select>,
                    )}
                  </Col>
                  <Col span={6}>
                    <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                      新增分类
                    </Button>
                  </Col>
                </Row>
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
                {getFieldDecorator('parameter')(
                  <TextArea
                    style={{
                      minHeight: 24,
                    }}
                    placeholder="请输入商品参数"
                    rows={3}
                  />,
                )}
              </FormItem>
              {/* 规格，库存，价格，会员价格 */}
              <FormItem {...formItemLayout2} label="商品规格">
                {getFieldDecorator('stocks')(<TableForm />)}
                {/* {this.state.stockBox.map((item, index) => {
                  return (
                    <StockFrom
                      data={item}
                      index={index}
                      removeStock={this.removeStock}
                      handleAddStock={this.handleAddStock}
                    />
                  );
                })} */}
              </FormItem>

              <FormItem {...formItemLayout2} label="商品详情">
                <div style={{ border: '1px solid #d1d1d1', borderRadius: '5px' }}>
                  {getFieldDecorator('detail', {
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
                  })(
                    <BraftEditor excludeControls={excludeControls} placeholder="请输入正文内容" />,
                  )}
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
          <CreateForm {...parentMethods} modalVisible={modalVisible} classifys={classifys} />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}



export default Form.create()(goodsCreateForm);
