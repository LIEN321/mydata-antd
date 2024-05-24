import { Col, Form, Icon, Input, Row, Select, Table, Tooltip } from 'antd';
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

  handleSelectHeaderName = (name) => {
    const { record, handleSave } = this.props;
    record.headerName = name;
    handleSave(record.key, this.props.dataIndex, name);
  }

  getInput = () => {
    const { dataIndex, record } = this.props;
    const { headerNames, dataFieldList } = this.props;

    if (dataIndex === 'headerName') {
      return <Select ref={node => (this.input = node)} onChange={this.handleSelectHeaderName} placeholder={`请输入${this.props.title}`}>
        {headerNames.map(name => (
          <Select.Option key={name} value={name}>
            {name}
          </Select.Option>
        ))}
      </Select>;
    }
    return <Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} placeholder={`请输入`} />;
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
              message: `请输入`,
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

class ExcelFieldMappingTable extends React.Component {

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '数据字段编号',
        dataIndex: 'dataFieldCode',
        width: '22%',
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
        title: '选择Excel列',
        dataIndex: 'headerName',
        width: '56%',
        editable: true,
      },
    ];

    const fieldMappings = [];

    const { dataFieldList, headerNames, handleSave } = props;
    if (dataFieldList) {
      dataFieldList.map(dataField => {
        let headerName = '';

        let index = headerNames.findIndex(e => e === dataField.fieldCode);
        if (index >= 0) {
          headerName = dataField.fieldCode;
        } else {
          index = headerNames.findIndex(e => e === dataField.fieldName);
          if (index >= 0) {
            headerName = dataField.fieldName;
          }
        }

        const mapping = {
          key: dataField.fieldCode
          , dataFieldCode: dataField.fieldCode
          , dataFieldName: dataField.fieldName
          , headerName: headerName
          , isId: dataField.isId
        };

        fieldMappings.push(mapping);

        handleSave(mapping);
      });
    }

    this.state = {
      fieldMappings,
      readonly: false,
    };
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

  render() {

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { headerNames, dataFieldList } = this.props;

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
          inputType: col.dataIndex === 'isId' ? 'switch' : 'text',
          headerNames: headerNames,
        }),
      };
    });

    return (
      <div>
        <Form>
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
        </Form>
      </div>
    );
  }
}

export default ExcelFieldMappingTable;