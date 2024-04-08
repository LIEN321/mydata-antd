import { Form, Input, Button, Table, Select, Popconfirm, Icon, Row, Col } from 'antd';
import React from 'react';
import style from './StandardData.less';
import { TASK_FILTER_TYPE_VALUE, TASK_FILTER_TYPE_FIELD } from '../../../actions/task';
import Column from 'antd/lib/table/Column';

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = { editing: props.editable };
  }

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error) => {
      if (error && error[e.currentTarget.key]) {
        return;
      }
      handleSave(record.key, this.props.dataIndex, e.target.value);
    });
  };

  handleSelectField = (fieldCode) => {
    const { record } = this.props;
    record.k = fieldCode;
  }

  handleSelectOp = (op) => {
    const { record } = this.props;
    record.op = op;
  }

  handleSelectValue = (value) => {
    const { record } = this.props;
    record.v = value;
  }

  getInput = () => {
    const { record } = this.props;
    const { dataFieldList } = this.props;
    if (this.props.dataIndex === 'k') {
      return <Select ref={node => (this.input = node)} onChange={this.handleSelectField} placeholder={`请输入${this.props.title}`}>
        {dataFieldList.map(f => (
          <Select.Option key={f.fieldCode} value={f.fieldCode}>
            {f.fieldName} ({f.fieldCode})
          </Select.Option>
        ))}
      </Select>;
    }
    if (this.props.dataIndex === 'op') {
      return <Select ref={node => (this.input = node)} onChange={this.handleSelectOp} placeholder={`请输入${this.props.title}`}>
        <Select.Option value="=">=</Select.Option>
        <Select.Option value="!=">!=</Select.Option>
        <Select.Option value=">">&gt;</Select.Option>
        <Select.Option value=">=">&gt;=</Select.Option>
        <Select.Option value="<">&lt;</Select.Option>
        <Select.Option value="<=">&lt;=</Select.Option>
        {(record.t === TASK_FILTER_TYPE_VALUE) && <Select.Option value="nn">not null</Select.Option>}
        {(record.t === TASK_FILTER_TYPE_VALUE) && <Select.Option value="ne">not empty</Select.Option>}
      </Select>;
    }
    if (record.t === TASK_FILTER_TYPE_FIELD) {
      return <Select ref={node => (this.input = node)} onChange={this.handleSelectValue} placeholder={`请输入${this.props.title}`}>
        {dataFieldList.map(f => (
          <Select.Option key={f.fieldCode} value={f.fieldCode}>
            {f.fieldName} ({f.fieldCode})
          </Select.Option>
        ))}
      </Select>;
    }
    return <Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} placeholder={`请输入${this.props.title}`} />;
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      /*
       * 根据以下情况 显示单元格的组件，否则单元格为空:
       * k 数据字段
       * op 条件比较方式
       * v 条件值 当选择了比较方式 且不为not null和not empty
       * t 为字段对比类型TASK_FILTER_TYPE_FIELD
       */
      (dataIndex == 'k' || dataIndex == 'op' || (dataIndex == 'v' && record.op != '' && record.op != 'nn' && record.op != 'ne') || record.t === TASK_FILTER_TYPE_FIELD) ?
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `请输入${title}`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            this.getInput()
          )}
        </Form.Item> : <></>
    ) : (
      <div
        className={style.editableCellValueWrap}
        style={{ paddingRight: 24 }}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class TaskDataFilterTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      count: 0,
      readonly: props.readonly ? props.readonly : false
    };

    this.columns = [
      {
        title: '数据字段',
        dataIndex: 'k',
        width: '35%',
        editable: !this.state.readonly,
      },
      {
        title: '条件操作',
        dataIndex: 'op',
        width: '18%',
        editable: !this.state.readonly,
      },
      {
        title: '条件值',
        dataIndex: 'v',
        width: '35%',
        editable: !this.state.readonly,
      },
    ];

    if (!this.state.readonly) {
      this.columns.push({
        title: '操作',
        dataIndex: 'operation',
        width: '12%',
        render: (text, record) =>
          this.state.filters.length >= 1 ? (
            <Popconfirm title="确认删除吗?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null
        ,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { filters } = nextProps;
    let count = 0;
    let i = 0;
    if (filters) {
      count = filters.length;
      filters.map(f => {
        f.key = i++;
      });
    } else {
      filters = [];
    }

    this.setState({
      filters,
      count,
    });
  }

  componentWillUnmount() {
    this.setState({ filters: [], count: 0 });
  }

  handleAdd = (type) => {
    const { count, filters } = this.state;
    const newFilter = {
      k: '',
      op: '',
      v: '',
      key: count,
      t: type,
    };
    this.setState({
      filters: [...filters, newFilter],
      count: count + 1,
    });

    this.props.handleSave(newFilter);
  };

  handleSave = (key, dataIndex, value) => {
    const newData = [...this.state.filters];
    const index = newData.findIndex(item => key === item.key);
    const item = newData[index];
    item[dataIndex] = value;
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });
    this.setState({ filters: newData });

    this.props.handleSave(item);
  };

  handleDelete = key => {
    const filters = [...this.state.filters];
    this.setState({ filters: filters.filter(item => item.key !== key) });
    this.props.handleDelete(key);
  };

  render() {
    window.a = this.state;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { dataFieldList } = this.props;

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          inputType: col.dataIndex === 'op' ? 'select' : 'text',
          dataFieldList: dataFieldList,
        }),
      };
    });

    return (
      <div>
        <Button onClick={() => this.handleAdd(TASK_FILTER_TYPE_VALUE)} type="primary" style={{ marginBottom: 12, marginRight: 12 }} icon="plus">
          添加值参
        </Button>
        <Button onClick={() => this.handleAdd(TASK_FILTER_TYPE_FIELD)} type="primary" style={{ marginBottom: 12 }} icon="plus">
          字段对比
        </Button>
        <Table
          components={components}
          rowClassName={() => { style.editableRow }}
          bordered
          dataSource={this.state.filters}
          columns={columns}
          pagination={{
            onChange: this.cancel,
            position: "none"
          }}
        />
      </div>
    );
  }
}

export default TaskDataFilterTable;