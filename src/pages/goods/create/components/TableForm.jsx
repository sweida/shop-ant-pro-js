import { Button, Divider, Input, Popconfirm, Table, message } from 'antd';
import React, { Fragment, PureComponent } from 'react';
import isEqual from 'lodash.isequal';
import styles from './style.less';

class TableForm extends PureComponent {
  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }

    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  clickedCancel = false;
  index = 1;
  cacheOriginData = {};
  columns = [
    {
      title: '编号',
      dataIndex: 'label_id',
      key: 'label_id',
      width: '10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <p style={{marginBottom: 0}}>{text}</p>
          );
        }

        return text;
      },
    },
    {
      title: '规格名称',
      dataIndex: 'label',
      key: 'label',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'label', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="规格名称"
            />
          );
        }

        return text;
      },
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: '14%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              type="number"
              min="0"
              onChange={e => this.handleFieldChange(e, 'stock', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="库存"
            />
          );
        }

        return text;
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: '18%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              type="number"
              prefix="￥"
              suffix="分"
              onChange={e => this.handleFieldChange(e, 'price', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="价格"
            />
          );
        }

        return '¥ ' + (text / 100).toFixed(2);
      },
    },
    {
      title: '会员价格',
      dataIndex: 'vip_price',
      key: 'vip_price',
      width: '18%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              prefix="￥"
              suffix="分"
              onChange={e => this.handleFieldChange(e, 'vip_price', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="会员价格"
            />
          );
        }

        return '¥ ' + (text / 100).toFixed(2);
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const { loading } = this.state;

        if (!!record.editable && loading) {
          return null;
        }

        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }

          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }

        return (
          <span>
            <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
    };
  }

  componentDidMount() {
    if (this.props.value!=[]) {
      this.newMember()
    }
  }

  getRowByKey(key, newData) {
    const { data = [] } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);

    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }

      target.editable = !target.editable;
      this.setState({
        data: newData,
      });
    }
  };
  newMember = () => {
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      label_id: this.index,
      label: '',
      price: '',
      stock: 9999,
      vip_price: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({
      data: newData,
    });
  };

  remove(key) {
    const { data = [] } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({
      data: newData,
    });

    if (onChange) {
      onChange(newData);
    }
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(key, newData);

    if (target) {
      target[fieldName] = e.target.value;
      this.setState({
        data: newData,
      });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }

      const target = this.getRowByKey(key) || {};

      if (!target.label || !target.stock || !target.price) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }

      delete target.isNew;
      this.toggleEditable(e, key);
      const { data = [] } = this.state;
      const { onChange } = this.props;

      if (onChange) {
        onChange(data);
      }

      this.setState({
        loading: false,
      });
    }, 500);
    console.log(this.state.data, 4444);
    
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data = [] } = this.state;
    const newData = [...data]; // 编辑前的原始数据

    let cacheOriginData = [];
    cacheOriginData = newData.map(item => {
      if (item.key === key) {
        if (this.cacheOriginData[key]) {
          const originItem = { ...item, ...this.cacheOriginData[key], editable: false };
          delete this.cacheOriginData[key];
          return originItem;
        }
      }

      return item;
    });
    this.setState({
      data: cacheOriginData,
    });
    this.clickedCancel = false;
  }

  render() {
    const { loading, data } = this.state;
    return (
      <Fragment>
        <Table
          className="stock"
          loading={loading}
          columns={this.columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{
            width: '100%',
            marginTop: 16,
            marginBottom: 8,
          }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增规格
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
