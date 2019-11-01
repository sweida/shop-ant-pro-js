import {
  Badge,
  Button,
  Card,
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
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Link from 'umi/link'
import router from 'umi/router'
import { AdDelete, AdBatchDelete } from './service';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({ adList, adForm, loading }) => ({
  adList,
  adForm,
  loading: loading.models.adList,
}))
class AdTableList extends Component {
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
      title: '广告位置',
      dataIndex: 'type',
    },
    {
      title: '图片',
      dataIndex: 'url',
      render(val) {
        return (
          <Avatar icon="picture" shape="square" size="large" src={process.env.IMG_SERVER + val} />
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'orderbyNum',
    },
    {
      title: '操作',
      render: row => (
        <Fragment>
          <Link to={'edit?id=' + row.id}>编辑</Link>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗？" onConfirm={() => this.handleDelete(row.id)}>
            <a href="#">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  page() {
    const {
      location,
      adList: { data },
    } = this.props;
    return location.query.page || data.pagination.current;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    router.push({ query: { page: this.page() } });

    dispatch({
      type: 'adList/fetch',
      payload: { page: this.page() },
    });
    dispatch({
      type: 'adForm/getClassifys',
    });
  }

  handleDelete(id) {
    AdDelete({ id }).then(res => {
      if (res.status == 'success') {
        message.success(res.message);
        const { dispatch } = this.props;
        dispatch({
          type: 'adList/fetch',
          payload: { page: this.page() },
        });
      }
    });
  }

  // 分页
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
      page: pagination.current,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'adList/fetch',
      payload: params,
    });
    router.push({ query: { page: pagination.current } });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'adList/fetch',
      payload: {},
    });
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'adList/remove',
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

  // 批量删除
  handleSeleceDelete = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    let key = selectedRows.map(row => row.id);
    AdBatchDelete(key).then(res => {
      if (res.status == 'success') {
        dispatch({
          type: 'adList/fetch',
          payload: { page: this.page() },
        });
      }
      message[res.status](res.message)
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.type == 'all') {
        fieldsValue = null;
      }
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'adList/fetch',
        payload: fieldsValue,
      });
    });
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      adForm: { classifys },
      form: { getFieldDecorator },
    } = this.props;
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
            <FormItem label="广告位置">
              {getFieldDecorator('type')(
                <Select
                  placeholder="请选择"
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
      adList: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => router.push('create')}>
                新增广告
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleSeleceDelete}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey={data => data.id}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AdTableList);
