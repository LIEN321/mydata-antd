import { Form, Input, Table, Switch } from 'antd';
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

  handleSwitchIsSelect = () => {
    const { record, handleSave } = this.props;
    if (record.isSelect === 1) {
      record.isSelect = 0;
    } else {
      record.isSelect = 1;
    }
    handleSave(record.key, this.props.dataIndex, record.isSelect);
  };

  getInput = () => {
    if (this.props.inputType === 'switch') {
      return <Switch ref={node => (this.input = node)} checked={this.props.record.isSelect === 1} checkedChildren="是" unCheckedChildren="否" onClick={() => this.handleSwitchIsSelect()} />
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

class TaskFieldSelectTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      readonly: props.readonly ? props.readonly : false
    };

    this.columns = [
      {
        title: '数据字段编号',
        dataIndex: 'dataFieldCode',
        width: '40%',
        editable: false,
      },
      {
        title: '数据字段名称',
        dataIndex: 'dataFieldName',
        width: '40%',
        editable: false,
      },
      {
        title: '是否导出',
        dataIndex: 'isSelect',
        width: '20%',
        render: (text, record) => {
          return record.isSelect == 1 ? "是" : "否";
        },
        editable: !this.state.readonly,
      },
    ];

    const fieldMappings = [];
    const { dataFieldList, initFieldMappings } = this.props;

    if (dataFieldList) {
      dataFieldList.map(dataField => {
        const mapping = {
          key: dataField.fieldCode
          , dataFieldCode: dataField.fieldCode
          , dataFieldName: dataField.fieldName
          , isSelect: (initFieldMappings && initFieldMappings[dataField.fieldCode]) ? 1 : 0
        };

        fieldMappings.push(mapping);
      });
    }
    this.state = {fieldMappings};
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

  handleDelete = key => {
    const fieldMappings = [...this.state.fieldMappings];
    this.setState({ fieldMappings: fieldMappings.filter(item => item.key !== key) });
    this.props.handleDelete(key);
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
          inputType: col.dataIndex === 'isSelect' ? 'switch' : 'text',
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
          pagination={false}
          size="small"
          scroll={{ y: 230 }}
        />
      </div>
    );
  }
}

export default TaskFieldSelectTable;