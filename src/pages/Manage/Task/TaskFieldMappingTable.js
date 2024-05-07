import { Col, Form, Input, Row, Select, Table } from 'antd';
import React from 'react';
import style from './StandardData.less';

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
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave(record.key, this.props.dataIndex, e.currentTarget.value);
    });
  };

  handleSelectOp = (op) => {
    const { record, handleSaveDataProcess } = this.props;
    handleSaveDataProcess(record.key, 'op', op);
  }

  handleSaveValue = (e) => {
    const { record, handleSaveDataProcess } = this.props;
    handleSaveDataProcess(record.key, 'v', e.currentTarget.value);
  }

  getInput = () => {
    const { dataIndex, record } = this.props;
    if (dataIndex === 'dataProcess') {
      return <Row>
        <Col span={12}>
          <Select ref={node => (this.input = node)}
            onChange={this.handleSelectOp}
            placeholder={`请选择`}
            value={(record.dataProcess && record.dataProcess.op) ? record.dataProcess.op : ""}
            showArrow={false}
          >
            <Select.Option value="">无</Select.Option>
            <Select.Option value="+">+</Select.Option>
            <Select.Option value="-">-</Select.Option>
            <Select.Option value="*">*</Select.Option>
            <Select.Option value="/">/</Select.Option>
            <Select.Option value="md5">md5</Select.Option>
            <Select.Option value="base64">base64</Select.Option>
            <Select.Option value="add second">增加秒</Select.Option>
          </Select>
        </Col>
        {(record.dataProcess && record.dataProcess.op && record.dataProcess.op != 'md5' && record.dataProcess.op != 'base64') &&
          <Col span={12}>
            <Input ref={node => (this.input = node)} onChange={this.handleSaveValue} placeholder={`请输入`} value={(record.dataProcess && record.dataProcess.v) ? record.dataProcess.v : ""} />
          </Col>
        }
      </Row>;
    }
    return <Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} placeholder={`请输入${this.props.title}`} />;
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: false,
              message: `请输入${title}`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          // <Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />
          this.getInput()
        )}
      </Form.Item>
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

class TaskFieldMappingTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fieldMappings: [],
      readonly: false
    };

    this.columns = [
      {
        title: '数据字段编号',
        dataIndex: 'dataFieldCode',
        width: '23%',
        editable: false,
        render: (text, record) => {
          const { isId } = record;
          return <>
            {record.dataFieldCode}
            {isId === 1 && <span style={{ color: 'red' }}>*</span>}
          </>
        },
      },
      {
        title: '数据字段名称',
        dataIndex: 'dataFieldName',
        width: '22%',
        editable: false,
      },
      {
        title: '接口字段',
        dataIndex: 'apiFieldCode',
        width: '25%',
        editable: !this.state.readonly,
      },
      {
        title: '数据处理',
        dataIndex: 'dataProcess',
        width: '30%',
        editable: !this.state.readonly,
      },
    ];
  }

  componentWillReceiveProps(nextProps) {

    const fieldMappings = [];

    const { dataFieldList, initFieldMappings, dataProcess } = nextProps;
    if (dataFieldList) {
      dataFieldList.map(dataField => {
        const mapping = {
          key: dataField.fieldCode
          , dataFieldCode: dataField.fieldCode
          , dataFieldName: dataField.fieldName
          , apiFieldCode: (initFieldMappings ? (initFieldMappings[dataField.fieldCode] ? initFieldMappings[dataField.fieldCode] : null) : null)
          , isId: dataField.isId
          , dataProcess: (dataProcess ? (dataProcess[dataField.fieldCode]) : {})
        };

        fieldMappings.push(mapping);
      });
    }

    this.setState({
      fieldMappings,
      readonly: nextProps.readonly ? nextProps.readonly : false,
    });
  }

  componentWillUnmount() {
    this.setState({ fieldMappings: [] });
  }

  handleSave = (key, dataIndex, value) => {
    const newData = [...this.state.fieldMappings];
    const index = newData.findIndex(item => key === item.key);
    const item = newData[index];
    item[dataIndex] = value;
    this.setState({ fieldMappings: newData });

    this.props.handleSave(item);
  };

  handleSaveDataProcess = (key, k, v) => {
    const newData = [...this.state.fieldMappings];
    const index = newData.findIndex(item => key === item.key);
    const item = newData[index];
    if (!item.dataProcess) {
      item.dataProcess = {};
    }
    if (v) {
      item.dataProcess[k] = v;
    } else {
      delete item.dataProcess[k];
    }

    this.setState({ fieldMappings: newData });
    this.props.handleSaveDataProcess(item);
  };

  render() {

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

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
          handleSaveDataProcess: this.handleSaveDataProcess,
          inputType: col.dataIndex === 'isId' ? 'switch' : 'text',
        }),
      };
    });

    return (
      <div>
        <Table
          components={components}
          rowClassName={() => { style.editableRow }}
          bordered
          dataSource={this.state.fieldMappings}
          columns={columns}
          pagination={{
            onChange: this.cancel,
            position: "none"
          }}
          size="small"
          scroll={{ y: 230 }}
        />
      </div>
    );
  }
}

export default TaskFieldMappingTable;