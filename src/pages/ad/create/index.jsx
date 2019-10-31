import {
  Button,
  Card,
  DatePicker,
  Form,
  Upload,
  Icon,
  Input,
  Switch,
  message,
  Radio,
  Select,
  Tooltip,
  Spin,
  Row,
  Col
} from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import Link from 'umi/link'
import CreateForm from './components/CreateForm';
import { deleteImage } from './service'
import { beforeUpload } from '@/utils/upload';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;


@connect(({ adForm, loading }) => ({
  adForm,
  loading: loading.models.adForm,
}))
class AdCreateForm extends Component {
  state = {
    modalVisible: false,
    uploadLoading: false,
    imageUrl: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'adForm/getClassifys',
    });

    const id = this.props.location.query.id;
    if (id) {
      dispatch({
        type: 'adForm/fetch',
        payload: { id },
        callback: response => {
          this.setBaseInfo(response);
        },
      });
    }
  }
  componentWillUnmount() {}

  // 是否编辑
  isEdit() {
    return this.props.route.path == '/ad/edit' ? true : false;
  }

  setBaseInfo = data => {
    const { form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = data[key] || null;
      form.setFieldsValue(obj);
    });
    this.setState({
      imageUrl: data.url,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    if (this.isEdit()) {
      // 编辑
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'adForm/saveForm',
            payload: {
              ...values,
              id: this.props.location.query.id,
            },
          });
        }
      });
    } else {
      // 新增
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'adForm/submitForm',
            payload: values,
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
    const { dispatch, adForm } = this.props;
    const newData = [...adForm.classifys, fields.newClassify];
    dispatch({
      type: 'adForm/addClassifys',
      payload: newData,
    });
    console.log(newData, adForm.classifys, 23);

    message.success('添加成功');
    this.handleModalVisible();
  };

  // 上传图片
  handleChange = info => {
    const { form } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ uploadLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.status == 'success') {
        // 先删除旧图片
        if (this.state.imageUrl) {
          deleteImage({ image: this.state.imageUrl });
        }
        this.setState({
          imageUrl: info.file.response.data.url,
          uploadLoading: false,
        });
        form.setFieldsValue({ 
          url: info.file.response.data.url 
        });
      } else {
        this.setState({
          uploadLoading: false,
        });
        message.error(info.file.response.message);
      }
    }
  };

  handleChangeValue = (e) => {
    this.setState({ imageUrl: e.target.value });
  }

  render() {
    const { adForm, submitting, loading } = this.props;
    const { classifys } = adForm;
    const { modalVisible, imageUrl } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 6 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 10 },
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

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const content = (
      <div className={styles.pageHeaderContent}>
        <Link to="list">返回列表</Link>
      </div>
    );
    const uploadButton = (
      <div>
        <Icon type={this.state.uploadLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <PageHeaderWrapper content={content}>
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
                      message: '广告标题不能为空',
                    },
                  ],
                })(<Input placeholder="请输入广告标题" allowClear />)}
              </FormItem>
              <FormItem {...formItemLayout} label="图片">
                <Upload
                  name={'image'}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={'/api/image/upload'}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                  {imageUrl ? (
                    <img src={'http://static.golang365.com/' + imageUrl} alt="avatar" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </FormItem>
              <FormItem {...formItemLayout2} label="图片链接">
                {getFieldDecorator('url')(
                  <Input
                    placeholder="上传图片或者手动输入图片链接"
                    allowClear
                    onChange={(e) => this.handleChangeValue(e)}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout2} label="广告位置">
                <Row gutter={8}>
                  <Col span={18}>
                    {getFieldDecorator('type')(
                      <Select placeholder="请选择广告位置">
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
              <FormItem {...formItemLayout} label="排序">
                {getFieldDecorator('orderbyNum')(
                  <Input type="number" placeholder="数字越大，越靠前" />,
                )}
              </FormItem>

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
        </Spin>
        <CreateForm {...parentMethods} modalVisible={modalVisible} classifys={classifys} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AdCreateForm);
