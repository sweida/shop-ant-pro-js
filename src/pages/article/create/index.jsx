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
} from 'antd';
import React, { Component } from 'react';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

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

@connect(({ articleForm, loading }) => ({
  articleForm,
  loading: loading.models.articleForm,
  articleData: articleForm.articleData
}))

class ArticleCreateForm extends Component {
  state = {
    editorState: BraftEditor.createEditorState(''),
  };
  componentDidMount() {
    this.isLivinig = true;
    const id = this.props.location.query.id;
    if (id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'articleForm/fetch',
        payload: {id},
      });
    }

    // 3秒后更改编辑器内容
    setTimeout(this.setEditorContentAsync, 3000);
  }
  componentWillUnmount() {
    this.isLivinig = false;
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'articleForm/submitForm',
          payload: {
            ...values,
            content: values.content.toHTML(),
          },
        });
      }
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

  handleEditChange = editorState => {
    this.setState({
      editorState: editorState,
    });
  };
  handleSelectChange(value) {
    console.log(`selected ${value}`);
  }

  render() {
    const { submitting, articleData } = this.props;
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
    return (
      <PageHeaderWrapper>
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
              })(<Input placeholder="请输入文章标题" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="封面图">
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
                    message: '文章分类不能为空',
                  },
                ],
              })(
                <Select placeholder="请选择文章分类">
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>,
              )}
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
              {getFieldDecorator('good_id')(<Input placeholder="请输入推荐的商品编号" />)}
            </FormItem>
            {/* headers={{ authorization: 'Bearer ' + sessionStorage['token'] }} */}

            <FormItem {...formItemLayout2} label="文章详情">
              <div style={{ border: '1px solid #ccc' }}>
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
            <FormItem {...formItemLayout} label="创建时间">
              {getFieldDecorator('created_at')(
                <DatePicker showTime placeholder="请选择创建时间" />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('deleted_at')(
                <Switch checkedChildren="正常" unCheckedChildren="下架" defaultChecked />,
              )}
            </FormItem>
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ArticleCreateForm);
