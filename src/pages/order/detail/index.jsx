import { 
  Badge, 
  Card, 
  Descriptions, 
  Divider, 
  Icon, 
  Steps, 
  Statistic, 
  Table } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './style.less';

const { Step } = Steps;
const progressColumns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text => {
      if (text === 'success') {
        return <Badge status="success" text="成功" />;
      }

      return <Badge status="processing" text="进行中" />;
    },
  },
  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];

// 订单信息
const extra = (
  <div className={styles.moreInfo}>
    <Statistic title="状态" value="待付款" />
    <Statistic title="订单金额" value={568.08} prefix="¥" />
  </div>
);
const description = (
  <RouteContext.Consumer>
    {({ isMobile }) => (
      <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
        <Descriptions.Item label="创建人">曲丽丽</Descriptions.Item>
        <Descriptions.Item label="创建时间">2017-07-07 08:18:08</Descriptions.Item>
        <Descriptions.Item label="商品数量">4</Descriptions.Item>
        <Descriptions.Item label="商品金额">¥45.00</Descriptions.Item>
        <Descriptions.Item label="折扣金额">无</Descriptions.Item>
        <Descriptions.Item label="备注">加快</Descriptions.Item>
      </Descriptions>
    )}
  </RouteContext.Consumer>
);


// 步骤
const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <div> 曲丽丽 </div>
    <div>2016-12-12 12:32</div>
  </div>
);
const desc2 = (
  <div className={styles.stepDescription}>
    <div> 周毛毛 </div>
    <div>
      <a href="">发货</a>
    </div>
  </div>
);


@connect(({ orderDetail, loading }) => ({
  orderDetail,
  loading: loading.effects['orderDetail/fetchBasic'],
}))
class Basic extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'orderDetail/fetchBasic',
    // });
  }

  render() {
    const { orderDetail, loading } = this.props;
    const { basicGoods, basicProgress } = orderDetail;
    let goodsData = [];

    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
        id: '总计',
        num,
        amount,
      });
    }

    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };

      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }

      return obj;
    };

    const goodsColumns = [
      {
        title: '商品编号',
        dataIndex: 'id',
        key: 'id',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return <a href="">{text}</a>;
          }

          return {
            children: (
              <span
                style={{
                  fontWeight: 600,
                }}
              >
                总计
              </span>
            ),
            props: {
              colSpan: 4,
            },
          };
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        render: renderContent,
      },
      {
        title: '商品条码',
        dataIndex: 'barcode',
        key: 'barcode',
        render: renderContent,
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        align: 'right',
        render: renderContent,
      },
      {
        title: '数量（件）',
        dataIndex: 'num',
        key: 'num',
        align: 'right',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return text;
          }

          return (
            <span
              style={{
                fontWeight: 600,
              }}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return text;
          }

          return (
            <span
              style={{
                fontWeight: 600,
              }}
            >
              {text}
            </span>
          );
        },
      },
    ];
    return (
      <PageHeaderWrapper
        title="单号：234231029431"
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <Card
          title="订单状态"
          style={{
            marginBottom: 24,
          }}
        >
          <RouteContext.Consumer>
            {({ isMobile }) => (
              <Steps direction={isMobile ? 'vertical' : 'horizontal'} progressDot current={1}>
                <Step title="创建订单" description={desc1} />
                <Step title="已支付" description={desc2} />
                <Step title="已发货" />
                <Step title="已签收，待确定" />
                <Step title="完成" />
                {/* <Step title="已取消" /> */}
              </Steps>
            )}
          </RouteContext.Consumer>
        </Card>
        <Card
          title="收货信息"
          style={{
            marginBottom: 24,
          }}
        >
          <Descriptions>
            <Descriptions.Item label="用户姓名">付小小</Descriptions.Item>
            <Descriptions.Item label="联系电话">18100000000</Descriptions.Item>
            <Descriptions.Item label="收货地址">浙江省杭州市西湖区万塘路18号</Descriptions.Item>
            <Descriptions.Item label="快递">菜鸟仓储</Descriptions.Item>
            <Descriptions.Item label="快递费">包邮</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title="商品列表">
          <Table
            style={{
              marginBottom: 24,
            }}
            pagination={false}
            loading={loading}
            dataSource={goodsData}
            columns={goodsColumns}
            rowKey="id"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
