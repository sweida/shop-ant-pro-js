import {
  Badge,
  Button,
  Card,
  Tag,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Avatar,
  Popconfirm,
} from 'antd';
import Link from 'umi/link'
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { deleteOrRestored, reallyDelete } from './service';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import router from 'umi/router';
import styles from './style.less';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


/* eslint react/no-multi-comp:0 */
@connect(({ articleList, articleForm, loading }) => ({
  articleList,
  articleForm,
  loading: loading.models.articleList,
}))
class ArticlesTableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '封面',
      dataIndex: 'img',
      render(val) {
        return <Avatar shape="square" size="large" src={'http://static.golang365.com/' + val} />;
      },
    },
    {
      title: '分类',
      dataIndex: 'classify',
    },
    {
      title: '状态',
      dataIndex: 'deleted_at',
      render(val) {
        return val ? <Tag color="red">下架</Tag> : <Tag color="blue">正常</Tag>;
      },
    },
    {
      title: '点击量',
      dataIndex: 'clicks',
    },
    {
      title: '点赞量',
      dataIndex: 'like_count',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      render: (text, row) => (
        <Fragment>
          <a onClick={() => this.handleDeleteOrRestored(row.id)}>
            {row.deleted_at ? '恢复' : '下架'}
          </a>
          <Divider type="vertical" />
          <Link to={'edit?id=' + row.id}>编辑</Link>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗？" onConfirm={() => this.handleReallyDelete(row.id)}>
            <a href="#">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  page() {
    const { location, articleList: {data} } = this.props;
    return location.query.page || data.pagination.current;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    router.push({ query: { page: this.page() } });

    dispatch({
      type: 'articleList/fetch',
      payload: { page: this.page() },
    });
    dispatch({
      type: 'articleForm/getClassifys',
    });
  }
  handleDelete() {
    console.log('删除');
  }

  handleDeleteOrRestored(id) {
    deleteOrRestored({ id }).then(res => {
      if (res.status == 'success') {
        message.success(res.message);
        const { dispatch } = this.props;
        dispatch({
          type: 'articleList/fetch',
          payload: { page: this.page() },
        });
      }
    });
  }
  handleReallyDelete(id) {
    reallyDelete({ id }).then(res => {
      if (res.status == 'success') {
        message.success(res.message);
        const { dispatch } = this.props;
        dispatch({
          type: 'articleList/fetch',
          payload: { page: this.page() },
        });
      }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'articleList/fetch',
      payload: params,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'articleList/fetch',
      payload: {},
    });
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleDeletes = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'articleList/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;

      default:
        break;
    }
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'articleList/fetch',
        payload: values,
      });
    });
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'articleList/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'articleList/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      articleForm,
      form: { getFieldDecorator },
    } = this.props;
    const { classifys } = articleForm;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="选择分类">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择分类"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option key="all">全部</Option>
                  {classifys.map(item => (
                    <Option key={item}>{item}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      articleList: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => router.push('create')}>
                新增文章
              </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleDeletes}>批量删除</Button>
                  <Button onClick={this.handleDeletes}>批量下架</Button>
                </span>
              )} */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              rowKey={data => data.id}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ArticlesTableList);
