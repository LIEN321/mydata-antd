import React, { PureComponent } from 'react';
import { Form, Card, Button, Select, Modal, Input } from 'antd';
import { connect } from 'dva';
import styles from '../../../layouts/Sword.less';
import { API_DEBUG } from '../../../actions/api';
import env from '@/models/env';

const FormItem = Form.Item;

@connect(({ api, loading }) => ({
  api,
  submitting: loading.effects['api/submit'],
}))
@Form.create()
class ApiDebug extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      apiUrl: '',
      contentType: '',
      currentEnv: {},
    };
  }

  handleChangeEnv = envId => {
    const env = this.findEnv(envId);
    this.updateApiUrl(env);
  }

  handleChangeContentType = value => {
    this.setState({ contentType: value });
  }

  debug = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const httpMethod = this.props.apiMethod;
        const httpUri = this.state.apiUrl;
        const httpHeaders = this.props.reqHeaders;
        const httpParams = this.props.reqParams;
        const { contentType, currentEnv } = this.state;
        const httpBody = form.getFieldValue("reqBody");

        const params = {
          httpMethod,
          httpUri,
          httpHeaders,
          httpParams,
          contentType,
          envId: currentEnv.id,
          globalHeaders: currentEnv.globalHeaders,
          globalParams: currentEnv.globalParams,
          httpBody,
        };

        dispatch(API_DEBUG(params));
      }
    });
  }

  updateApiUrl(env) {
    const { apiUri } = this.props;
    const apiUrl = env.envPrefix + apiUri;

    this.setState({ apiUrl });
  }

  findEnv(envId) {
    const newEnvList = [...this.props.envList];
    const index = newEnvList.findIndex(env => env.id === envId);
    const env = newEnvList[index];
    this.state.currentEnv = env;
    return env;
  }

  handleClose = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.api.debugResult = '';
    this.props.onCancel();
  }

  render() {
    const { visible } = this.props;
    const { apiUrl } = this.state;

    const {
      form: { getFieldDecorator },
      envList,
      api: {
        debugResult
      }
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 },
      },
    };

    return (
      <Modal
        visible={visible}
        onCancel={this.handleClose}
        width="50%"
        footer={<Button type='primary' onClick={this.debug}>运行</Button>}
      >
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="选择环境">
              {getFieldDecorator('envId', {
                rules: [
                  {
                    required: true,
                    message: '请选择环境',
                  },
                ],
              })(
                <Select allowClear placeholder="请选择环境" onChange={this.handleChangeEnv}>
                  {envList.map(e => (
                    <Select.Option key={e.id} value={e.id}>
                      {e.envName} ({e.envPrefix})
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择Content-Type">
              <Select allowClear placeholder="请选择Content-Type" defaultValue="" onChange={this.handleChangeContentType}>
                <Select.Option value="">raw</Select.Option>
                <Select.Option value="application/json">application/json</Select.Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="请求地址">
              {apiUrl}
            </FormItem>
            <FormItem {...formItemLayout} label="Body">
              {getFieldDecorator('reqBody', {
                rules: [
                  {
                    required: false,
                    message: '请输入请求体',
                  },
                ],
                initialValue: this.props.reqBody,
              })(
                <Input.TextArea placeholder="请输入请求体" rows={4} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="响应内容">
              <span>状态：{debugResult.status}</span> | <span>耗时：{debugResult.time} ms</span>
              <Card style={{ maxHeight: 300, overflow: 'scroll' }} >
                {debugResult.body}
              </Card>
            </FormItem>
          </Card>
        </Form>
      </Modal>
    );
  }
}

export default ApiDebug;
