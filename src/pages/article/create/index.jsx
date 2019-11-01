import {
  Button,
  Card,
  DatePicker,
  Form,
  Upload,
  Icon,
  Input,
  message,
  Select,
  Spin,
  Row,
  Col
} from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import Link from 'umi/link'
import AddClassify from '@/components/Modal/AddClassify';
import { deleteImage } from './service'
import { beforeUpload } from '@/utils/upload';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


@connect(({ articleForm, loading }) => ({
  articleForm,
  loading: loading.models.articleForm,
}))
class ArticleCreateForm extends Component {
  state = {
    modalVisible: false,
    uploadLoading: false,
    imageUrl: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'articleForm/getClassifys',
    });

    const id = this.props.location.query.id;
    if (id) {
      dispatch({
        type: 'articleForm/fetch',
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
      obj.content = BraftEditor.createEditorState(data.content);
      form.setFieldsValue(obj);
    });
    this.setState({
      imageUrl: data.img,
    });
  };
  componentWillUnmount() {}

  // 是否编辑
  isEdit() {
    return this.props.route.path == '/article/edit' ? true : false;
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    if (this.isEdit()) {
      // 编辑
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'articleForm/saveForm',
            payload: {
              ...values,
              img: this.state.imageUrl,
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
            type: 'articleForm/submitForm',
            payload: {
              ...values,
              img: this.state.imageUrl,
              content: values.content.toHTML(),
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
    const { dispatch, articleForm } = this.props;
    const newData = [...articleForm.classifys, fields.newClassify];
    dispatch({
      type: 'articleForm/addClassifys',
      payload: newData,
    });
    console.log(newData, articleForm.classifys, 23);

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleChange = info => {
    console.log(this.state.imageUrl);
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
      } else {
        this.setState({
          uploadLoading: false,
        });
        message.error(info.file.response.message);
      }
      // getBase64(info.file.originFileObj, imageUrl =>
      //   this.setState({
      //     imageUrl,
      //     uploadLoading: false,
      //   }),
      // );
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      articleForm: { classifys },
      submitting,
      loading,
    } = this.props;
    const { modalVisible, imageUrl } = this.state;

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
                      message: '文章标题不能为空',
                    },
                  ],
                })(<Input placeholder="请输入文章标题" allowClear />)}
              </FormItem>
              <FormItem {...formItemLayout} label="封面图">
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
                    <img src={process.env.IMG_SERVER + imageUrl} alt="avatar" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </FormItem>
              <FormItem {...formItemLayout} label="分类">
                <Row gutter={8}>
                  <Col span={18}>
                    {getFieldDecorator('classify', {
                      rules: [
                        {
                          required: true,
                          message: '文章分类不能为空',
                        },
                      ],
                    })(
                      <Select placeholder="请选择文章分类">
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
                    placeholder="请输入文章描述"
                    rows={3}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="商品编号">
                {getFieldDecorator('goods_id')(<Input placeholder="请输入推荐的商品编号" />)}
              </FormItem>
              {/* headers={{ authorization: 'Bearer ' + sessionStorage['token'] }} */}

              <FormItem {...formItemLayout2} label="文章详情">
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
        </Spin>
        <AddClassify {...parentMethods} modalVisible={modalVisible} classifys={classifys} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ArticleCreateForm);
