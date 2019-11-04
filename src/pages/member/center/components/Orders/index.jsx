import { 
  Icon, 
  List, 
  Tag, 
  Card,
  Button,
  Dropdown, } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
// import OrderContent from '../OrderContent';
import StandardTable from '../StandardTable';
import styles from './index.less';

@connect(({ memberCenter, loading }) => ({
  orders: memberCenter.currentUser.orders,
  loading: loading.models.currentUser,
}))
class UserOrders extends Component {
  columns = [
    {
      title: '订单编号',
      dataIndex: 'order_id',
    },
    {
      title: '订单金额',
      dataIndex: 'totalPay',
    },
    {
      title: '商品金额',
      dataIndex: 'goodsPrice',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: '1',
        },
        {
          text: status[1],
          value: '2',
        },
        {
          text: status[2],
          value: '3',
        },
        {
          text: status[3],
          value: '4',
        },
        {
          text: status[4],
          value: '5',
        },
        {
          text: status[5],
          value: '6',
        },
      ],
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '状态',
      dataIndex: 'deleted_at',
      render(val) {
        return val ? <Tag color="red">下架</Tag> : <Tag color="blue">正常</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      render: (text, row) => (
        <Fragment>
          <Link to={'detail?id=' + row.id}>查看详情</Link>
        </Fragment>
      ),
    },
  ];
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    // const { dispatch } = this.props;
    // const { formValues } = this.state;
    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});
    // const params = {
    //   currentPage: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...formValues,
    //   ...filters,
    // };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }
    // dispatch({
    //   type: 'orderList/fetch',
    //   payload: params,
    // });
  };

  render() {
    const { orders, loading } = this.props;

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <StandardTable
            loading={loading}
            data={orders}
            columns={this.columns}
            rowKey={orders => orders.id}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default UserOrders;
