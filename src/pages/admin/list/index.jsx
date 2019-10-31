import {
  Button,
  Card,
  Divider,
  Form,
  Tag,
  message,
  Avatar,
  Popconfirm,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import { deleteOrRestored, reallyDelete, resetPassword } from './service';
import StandardTable from './components/StandardTable';
import styles from './style.less';


/* eslint react/no-multi-comp:0 */
@connect(({ adminList, loading }) => ({
  adminList,
  loading: loading.models.adminList,
}))
class AdminList extends Component {
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      render(val) {
        return <Avatar size="large" src={val} icon="user" />;
      },
    },
    {
      title: '状态',
      dataIndex: 'deleted_at',
      render(val) {
        return val ? <Tag color="red">禁用</Tag> : <Tag color="blue">正常</Tag>;
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'updated_at',
    },
    {
      title: '操作',
      render: (text, row) => (
        <Fragment>
          <a onClick={() => this.handleDeleteOrRestored(row.id)}>
            {row.deleted_at ? '启用' : '禁用'}
          </a>
          <Divider type="vertical" />
          <Popconfirm title="确定重置密码？" onConfirm={() => this.handleResetPassword(row.id)}>
            <a href="#">重置密码</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗？" onConfirm={() => this.handleReallyDelete(row.id)}>
            <a href="#">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  page() {
    const { location, adminList: {data} } = this.props;
    return location.query.page || data.pagination.current;
  }

  componentDidMount() {
    const { dispatch, } = this.props;
    router.push({ query: { page: this.page() } });

    dispatch({
      type: 'adminList/fetch',
      payload: { page: this.page()},
    });
  }
  addAdmin() {}
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'adminList/fetch',
      payload: params,
    });
    router.push({ query: { page: pagination.current } });
  };

  handleDeleteOrRestored(id) {
    deleteOrRestored({ id }).then(res => {
      if (res.status == 'success') {
        message.success(res.message);
        const { dispatch } = this.props;
        dispatch({
          type: 'adminList/fetch',
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
          type: 'adminList/fetch',
          payload: { page: this.page() },
        });
      }
    });
  }
  handleResetPassword(id) {
    resetPassword({ id }).then(res => {
      if (res.status == 'success') {
        message.success(res.message);
      }
    });
  }

  render() {
    const {
      adminList: { data },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.addAdmin()}>
                添加管理员
              </Button>
            </div>
            {/* <Table
              loading={loading}
              rowKey={data => data.id}
              dataSource={data}
              columns={this.columns}
            /> */}
            <StandardTable
              loading={loading}
              data={data}
              rowKey={data => data.id}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AdminList);
