import React, { PureComponent } from 'react';
import { Form, Input, Card, Button } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { DATA_SUBMIT } from '../../../actions/data';
import EditableTable from './EditableTable';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['data/submit'],
}))
@Form.create()
class DataAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { dataFields: [] };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          // id,
          ...values,
        };
        params.dataFields = this.state.dataFields;
        dispatch(DATA_SUBMIT(params));
      }
    });
  };

  handleSaveField = field => {
    const newData = [...this.state.dataFields];
    const index = newData.findIndex(item => field.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...field,
      });
      this.setState({ dataFields: newData });
    } else {
      newData.push(field);
      this.setState({ dataFields: newData });
    }
  };

  handleDeleteField = key => {
    const dataFields = [...this.state.dataFields];
    this.setState({ dataFields: dataFields.filter(item => item.key !== key) });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 14 },
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/manage/data" action={action}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="数据编号">
              {getFieldDecorator('dataCode', {
                rules: [
                  {
                    required: true,
                    message: '请输入数据编号',
                  },
                ],
              })(<Input placeholder="请输入数据编号，长度不超过64位" maxLength={64} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="数据名称">
              {getFieldDecorator('dataName', {
                rules: [
                  {
                    required: true,
                    message: '请输入数据名称',
                  },
                ],
              })(<Input placeholder="请输入数据名称，长度不超过64位" maxLength={64} />)}
            </FormItem>
            <FormItem {...formItemLayout2} label="字段">
              <EditableTable
                dataFields={this.state.dataFields}
                handleSave={this.handleSaveField}
                handleDelete={this.handleDeleteField}
              />
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default DataAdd;
