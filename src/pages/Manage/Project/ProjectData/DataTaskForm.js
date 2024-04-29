import React, { PureComponent } from 'react';
import { Form, Input, Card, Select, Radio, Modal, message, notification, Tabs, Switch, InputNumber, Tooltip, Icon, Button, Popover, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from '../../../../layouts/Sword.less';
import { TASK_SUBSCRIBED, TASK_TYPE_PRODUCER, TASK_TYPE_CONSUMER, TASK_CONSUME_MODE_API, TASK_CONSUME_MODE_EMAIL, TASK_PRODUCE_MODE_API, TASK_PRODUCE_MODE_PUSH } from '../../../../actions/task';
import { TASK_AUTH_TYPE_NONE, TASK_AUTH_TYPE_API_KEY, TASK_AUTH_TYPE_BASIC, TASK_AUTH_TYPE_HMAC } from '../../../../actions/task';
import { TASK_INIT } from '../../../../actions/task';
import { submit as submitTask, detail as taskDetail } from '../../../../services/task';
import TaskFieldMappingTable from '../../Task/TaskFieldMappingTable';
import { dataFields as loadDataFields } from '../../../../services/data';
import { select as apiSelect } from '../../../../services/md_api';
import TaskDataFilterTable from '../../Task/TaskDataFilterTable';
import TaskVarMappingTable from '../../Task/TaskVarMappingTable';
import TaskBatchParamTable from '../../Task/TaskBatchMappingTable';
import TaskFieldSelectTable from '../../Task/TaskFieldSelectTable';
import Cron from "qnn-react-cron";

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ task, loading }) => ({
  task,
  submitting: loading.effects['task/submit'],
}))
@Form.create()
// 数据集成的任务表单
class DataTaskForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 任务记录详情
      detail: null,
      // api完整地址
      apiUrl: '',
      // 环境列表
      envList: [],
      // 当前所选环境
      selectedEnv: null,

      // API列表
      apiList: [],
      // 当前所选API
      selectedApi: null,

      // 数据字段列表
      dataFieldList: [],
      // 字段映射
      fieldMapping: {},

      // 过滤条件列表
      filters: [],

      // 变量映射
      varMappings: [],
      // 批处理参数
      batchParams: [],

      // 是否显示订阅
      isSubscribed: 0,
      isShowSubscribed: false,
      // 是否显示任务周期
      isShowTaskPeriod: true,

      // 是否启用批处理
      isBatchEnabled: false,

      // 提供模式
      produceMode: TASK_PRODUCE_MODE_API,

      // 消费模式
      consumeMode: TASK_CONSUME_MODE_API,
      // 发送邮件选择的字段
      selectedFields: [],

      // cron组件显示状态
      cronVisible: false,

      authType: TASK_AUTH_TYPE_NONE,
    };
  }

  componentWillMount() {
    const { dispatch, opType, data, currentTask } = this.props;
    dispatch(TASK_INIT());
    this.loadDataFieldList(data.id);

    if (currentTask && currentTask.id) {
      taskDetail({ id: currentTask.id }).then(resp => {
        if (resp.success) {
          const detail = resp.data;
          this.setState({ detail });
          this.setState({ apiUrl: detail.apiUrl });
          this.setState({
            fieldMapping: detail.fieldMapping,
            isShowSubscribed: !(detail.opType === TASK_TYPE_PRODUCER && detail.produceMode === TASK_PRODUCE_MODE_PUSH),
            isShowTaskPeriod: detail.isSubscribed !== TASK_SUBSCRIBED && (
              (detail.opType === TASK_TYPE_PRODUCER && detail.produceMode === TASK_PRODUCE_MODE_API)
              ||
              (detail.opType === TASK_TYPE_CONSUMER)
            ),
            initStatus: true,
            filters: detail.dataFilter,
            varMappings: detail.fieldVarMapping,
            isBatchEnabled: detail.batchStatus === 1,
            batchParams: detail.batchParams,
            consumeMode: detail.consumeMode,
            produceMode: detail.produceMode,
            authType: detail.authType || TASK_AUTH_TYPE_NONE,
            isSubscribed: detail.isSubscribed,
          });
          this.renderWarning(detail);

          this.loadApi(opType, detail.appId);
        }
      });
      // dispatch(TASK_DETAIL(currentTask.id));
    }

    if (opType === TASK_TYPE_PRODUCER) {
      // 提供数据
      this.setState({ isShowSubscribed: false });
    } else {
      // 消费数据
      this.setState({ isShowSubscribed: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      // task: {
      //   init: { apiList },
      // },
      envList,
    } = nextProps;

    this.setState({
      envList,
      // apiList,
    });
  }

  handleChangeApp = appId => {
    const { opType, form } = this.props;
    if (appId) {
      this.loadApi(opType, appId);
      form.setFieldsValue({ apiId: '' });
    }
  }

  async loadApi(opType, appId) {
    const response = await apiSelect({ opType, appId });
    if (response.success) {
      this.setState(() => ({ apiList: response.data }));
    }
  }

  handleChangeEnv = envId => {
    const selectedEnv = this.findEnv(envId);
    this.setState({ selectedEnv });
    this.updateApiUrl();
  }

  handleChangeApi = apiId => {
    const api = this.findApi(apiId);
    if (api) {
      this.state.selectedApi = api;
      this.updateApiUrl();
    }
  }

  updateApiUrl() {
    const { form, env } = this.props;
    let { selectedApi } = this.state;
    const { selectedEnv } = this.state;

    let apiUrl = '';

    if (selectedApi == null) {
      const appApiId = form.getFieldValue("apiId");
      selectedApi = this.findApi(appApiId);
    }
    if (selectedApi) {
      apiUrl = selectedApi.apiUri;
    }

    if (selectedEnv != null) {
      apiUrl = selectedEnv.envPrefix + apiUrl;
    }
    else if (env != null) {
      apiUrl = env.envPrefix + apiUrl;
    }

    this.setState({ apiUrl });
  }

  async loadDataFieldList(dataId) {
    const dataFieldResponse = await loadDataFields({ dataId });
    if (dataFieldResponse.success) {
      this.setState({ dataFieldList: dataFieldResponse.data });
    }
  }

  handleChangeData = dataId => {
    if (!dataId) {
      this.setState({ dataFieldList: [] });
      return;
    }
    this.loadDataFieldList(dataId);
  };

  handleSaveMapping = mapping => {
    const { fieldMapping } = this.state;
    const key = mapping.dataFieldCode;
    if (key && mapping.apiFieldCode) {
      fieldMapping[key] = mapping.apiFieldCode;
    }else{
      delete fieldMapping[key];
    }
  };

  // 消费模式是发送邮件时，选择字段
  handleSelectField = mapping => {
    const { fieldMapping } = this.state;
    const key = mapping.dataFieldCode;
    if (key) {
      if (mapping.isSelect === 1) {
        fieldMapping[key] = mapping.dataFieldName;
      }
      else {
        delete fieldMapping[key];
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, env, data, projectId, closeTaskForm, currentTask, opType } = this.props;
    const { authType } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
        };
        if (currentTask) {
          params.id = currentTask.id;
          // params.refEnvId = currentTask.refEnvId;
        }
        params.fieldMapping = this.state.fieldMapping;
        params.dataFilter = this.state.filters;
        // params.fieldVarMapping = this.state.varMappings;
        params.envId = env.id;
        params.dataId = data.id;
        params.projectId = projectId;
        params.opType = opType;

        const fieldVarMapping = {};
        const { varMappings } = this.state;
        if (varMappings) {
          varMappings.map(m => {
            fieldVarMapping[m.k] = m.v;
          });
        }
        params.fieldVarMapping = fieldVarMapping;
        params.batchStatus = values.batchStatus ? 1 : 0;
        params.batchParams = this.state.batchParams;

        if (authType === TASK_AUTH_TYPE_NONE) {
          params.authParams = {};
        } else if (authType === TASK_AUTH_TYPE_API_KEY) {
          params.authParams = {
            "keyHeader": '' + form.getFieldValue("keyHeader")
            , "keyValue": '' + form.getFieldValue("keyValue")
          };
        } else if (authType === TASK_AUTH_TYPE_BASIC) {
          params.authParams = {
            "username": '' + form.getFieldValue("username")
            , "password": '' + form.getFieldValue("password")
          };
        }

        if(params.produceMode === TASK_PRODUCE_MODE_PUSH){
          params.isSubscribed = TASK_SUBSCRIBED;
        }

        // dispatch(TASK_SUBMIT(params));
        submitTask(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            form.resetFields();
            closeTaskForm();
          } else {
            message.error(resp.msg || '提交失败');
          }
        });
      }
    });
  };

  // 切换订阅模式
  handleChangeSubscribed = e => {
    const targetValue = e.target.value;
    this.setState({ isShowTaskPeriod: targetValue !== TASK_SUBSCRIBED, isSubscribed: targetValue });
  };

  // 切换提供模式
  handleChangeProduceMode = e => {
    const produceMode = e.target.value;

    this.setState({ produceMode });
    // 接收推送 不显示周期
    this.setState({ isShowTaskPeriod: produceMode === TASK_PRODUCE_MODE_API });
  }

  // 切换消费模式
  handleChangeConsumeMode = e => {
    const consumeMode = e.target.value;
    this.setState({ consumeMode, isShowTaskPeriod: true, isSubscribed: 0 });
  }

  handleSaveFilter = filter => {
    const newData = [...this.state.filters];
    const index = newData.findIndex(item => filter.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...filter,
      });
      this.setState({ filters: newData });
    } else {
      newData.push(filter);
      this.setState({ filters: newData });
    }
  };

  handleDeleteFilter = key => {
    const filters = [...this.state.filters];
    this.setState({ filters: filters.filter(item => item.key !== key) });
  };

  handleSaveVarMapping = filter => {
    const newData = [...this.state.varMappings];
    const index = newData.findIndex(item => filter.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...filter,
      });
      this.setState({ varMappings: newData });
    } else {
      newData.push(filter);
      this.setState({ varMappings: newData });
    }
  };

  handleDeleteVarMapping = key => {
    const varMappings = [...this.state.varMappings];
    this.setState({ varMappings: varMappings.filter(item => item.key !== key) });
  };

  handleClose = () => {
    const { form, closeTaskForm } = this.props;
    form.resetFields();
    closeTaskForm();
  }

  findApi(apiId) {
    const newApiList = [...this.state.apiList];
    if (newApiList) {
      const index = newApiList.findIndex(api => api.id === apiId);
      const api = newApiList[index];
      this.state.selectedApi = api;
      return api;
    }
  }

  findEnv(envId) {
    const newEnvList = [...this.state.envList];
    const index = newEnvList.findIndex(env => env.id === envId);
    const env = newEnvList[index];
    this.state.selectedEnv = env;
    return env;
  }

  renderWarning = task => {
    if (task.taskStatus === 1) {
      notification.warning({
        message: '请注意',
        description:
          '任务运行中，请在提交修改后手动重启！',
        duration: 10,
      });
    }
  }

  handleChangeBatchStatus = () => {
    const { isBatchEnabled } = this.state;
    this.setState({ isBatchEnabled: !isBatchEnabled });
  }

  handleSaveBatchParam = param => {
    const newData = [...this.state.batchParams];
    const index = newData.findIndex(item => param.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...param,
      });
      this.setState({ batchParams: newData });
    } else {
      newData.push(param);
      this.setState({ batchParams: newData });
    }
  };

  handleDeleteBatchParam = key => {
    const batchParams = [...this.state.batchParams];
    this.setState({ batchParams: batchParams.filter(item => item.key !== key) });
  };

  handleChangeAuthType = authType => {
    this.setState({ authType });
  }

  render() {
    const {
      form,
      task: {
        init: { appList },
        //   detail,
      },
      opType,
      isRefEnv,
      env,
      envList,
      producerTasks,
    } = this.props;

    const { apiUrl, detail, isBatchEnabled, consumeMode, isSubscribed, produceMode, authType, apiList } = this.state;

    const formItemLayout = {
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

    // 从环境列表中排除当前环境
    let otherEnvList = envList;
    if (envList) {
      otherEnvList = envList.filter(e => e.id !== env.id);
    }

    let cronRef;
    const { getFieldValue, setFieldsValue, getFieldDecorator } = form;

    return (

      <Modal
        title={opType === TASK_TYPE_PRODUCER ? "提供数据" : "消费数据"}
        width="60%"
        visible={this.props.taskFormVisible}
        onOk={this.handleSubmit}
        onCancel={this.handleClose}
        style={{ top: 20 }}
      >
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Tabs defaultActiveKey='1'>
            <TabPane tab="基本信息" key='1'>
              {/* 任务类型 */}
              {/* <FormItem {...formItemLayout} label="任务类型">
                {opType === TASK_TYPE_PRODUCER ? "提供数据" : "消费数据"}
              </FormItem> */}
              {/* 任务名称 */}
              <FormItem {...formItemLayout} label="任务名称">
                {getFieldDecorator('taskName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入任务名称',
                    },
                  ],
                  initialValue: detail ? detail.taskName : '',
                })(<Input placeholder="请输入任务名称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="选择应用">
                {getFieldDecorator('appId', {
                  rules: [
                    {
                      required: false,
                      message: '请选择应用',
                    },
                  ],
                  initialValue: detail ? detail.appId : '',
                })(
                  <Select allowClear showSearch placeholder="请选择应用" onChange={this.handleChangeApp} optionFilterProp="children">
                    {appList.map(a => (
                      <Select.Option key={a.id} value={a.id}>
                        {a.appName} ({a.appCode})
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              {/* 选择提供模式 */}
              {opType === TASK_TYPE_PRODUCER ? (
                <FormItem {...formItemLayout} label="提供模式">
                  {getFieldDecorator('produceMode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择提供模式',
                      },
                    ],
                    initialValue: detail ? detail.produceMode : TASK_PRODUCE_MODE_API,
                  })(
                    <Radio.Group buttonStyle="solid" onChange={this.handleChangeProduceMode}>
                      <Radio.Button value={TASK_PRODUCE_MODE_API}>调用API</Radio.Button>
                      <Radio.Button value={TASK_PRODUCE_MODE_PUSH}>接收推送</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              ) : <></>}

              {/* 选择消费模式 */}
              {opType === TASK_TYPE_CONSUMER && (
                <FormItem {...formItemLayout} label="消费模式">
                  {getFieldDecorator('consumeMode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择消费模式',
                      },
                    ],
                    initialValue: detail ? detail.consumeMode : TASK_CONSUME_MODE_API,
                  })(
                    <Radio.Group buttonStyle="solid" onChange={this.handleChangeConsumeMode}>
                      <Radio.Button value={TASK_CONSUME_MODE_API}>调用API</Radio.Button>
                      <Radio.Button value={TASK_CONSUME_MODE_EMAIL}>发送邮件</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              )}

              {/* 提供数据模式 或 消费数据模式 是API */}
              {((opType === TASK_TYPE_PRODUCER && produceMode === TASK_PRODUCE_MODE_API) || (opType === TASK_TYPE_CONSUMER && consumeMode === TASK_CONSUME_MODE_API)) &&
                <>
                  {/* 选择其他环境 */}
                  {(isRefEnv || (detail && detail.refEnvId)) ? (<FormItem {...formItemLayout} label="选择其他环境">
                    {getFieldDecorator('refEnvId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择其他环境',
                        },
                      ],
                      initialValue: detail ? detail.refEnvId : '',
                    })(
                      <Select allowClear placeholder="请选择其他环境" onChange={this.handleChangeEnv}>
                        {otherEnvList.map(e => (
                          <Select.Option key={e.id} value={e.id}>
                            {e.envName} ({e.envPrefix})
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>) : <></>}
                  {/* 选择API */}
                  <FormItem {...formItemLayout} label="选择API">
                    {getFieldDecorator('apiId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择API',
                        },
                      ],
                      initialValue: detail ? detail.apiId : '',
                    })(
                      <Select allowClear showSearch placeholder="请选择API" onChange={this.handleChangeApi} optionFilterProp="children">
                        {apiList && apiList.map(a => (
                          <Select.Option key={a.id} value={a.id}>
                            {a.apiName} ({a.apiUri})
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                  {/* API完整地址 */}
                  {/* <FormItem {...formItemLayout} label="API完整地址">
                    {apiUrl}
                  </FormItem> */}
                  {/* 是否订阅 */}
                  {this.state.isShowSubscribed && (<>
                    <FormItem {...formItemLayout} label="订阅数据" extra="订阅模式：区别于定时模式，只当有提供新数据后才推送数据；">
                      {getFieldDecorator('isSubscribed', {
                        rules: [
                          {
                            required: true,
                            message: '请选择是否为订阅任务',
                          },
                        ],
                        initialValue: detail ? detail.isSubscribed : isSubscribed,
                      })(
                        // <Input placeholder="请输入是否为订阅任务：0-不订阅，1-订阅" />
                        <Radio.Group buttonStyle="solid" onChange={this.handleChangeSubscribed}>
                          <Radio.Button value={1}>订阅</Radio.Button>
                          <Radio.Button value={0}>不订阅</Radio.Button>
                        </Radio.Group>
                      )}
                    </FormItem>
                    {isSubscribed == 1 && (
                      <FormItem {...formItemLayout} label="选择触发订阅的任务">
                        {getFieldDecorator('subscribeTaskId', {
                          rules: [
                            {
                              required: true,
                              message: '请选择触发订阅的任务',
                            },
                          ],
                          initialValue: detail ? detail.subscribeTaskId : '0',
                        })(
                          <Select allowClear placeholder="请选择触发订阅的任务">
                            <Select.Option key={'0'} value={'0'}>全部</Select.Option>
                            {producerTasks.map(a => (
                              <Select.Option key={a.id} value={a.id}>
                                {a.taskName}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    )}
                  </>
                  )
                  }
                </>
              }

              {/* 提供模式 接收推送 */}
              {opType === TASK_TYPE_PRODUCER && produceMode === TASK_PRODUCE_MODE_PUSH &&
                <>
                  <FormItem {...formItemLayout} label="认证方式">
                    {getFieldDecorator('authType', {
                      rules: [
                        {
                          required: true,
                          message: '请选择认证方式',
                        },
                      ],
                      initialValue: detail && detail.authType ? detail.authType : TASK_AUTH_TYPE_NONE,
                    })(
                      <Select placeholder="请选择认证方式" onChange={this.handleChangeAuthType}>
                        <Select.Option key={TASK_AUTH_TYPE_NONE} value={TASK_AUTH_TYPE_NONE}>无需认证</Select.Option>
                        <Select.Option key={TASK_AUTH_TYPE_API_KEY} value={TASK_AUTH_TYPE_API_KEY}>API Key</Select.Option>
                        <Select.Option key={TASK_AUTH_TYPE_BASIC} value={TASK_AUTH_TYPE_BASIC}>Basic Auth</Select.Option>
                        {/* <Select.Option key={'hmac'} value={'hmac'}>HMAC</Select.Option> */}
                      </Select>
                    )}
                  </FormItem>
                  {authType === TASK_AUTH_TYPE_API_KEY && <>
                    <Row gutter={24}>
                      <Col span={6}></Col>
                      <Col span={7}>
                        <FormItem {...formItemLayout} label="Header">
                          {getFieldDecorator('keyHeader', {
                            rules: [
                              {
                                required: true,
                                message: '请输入API Key Header',
                              },
                            ],
                            initialValue: detail && detail.authParams ? detail.authParams.keyHeader : '',
                          })(<Input placeholder="请输入API Key Header" />)}
                        </FormItem>
                      </Col>
                      <Col span={7}>
                        <FormItem {...formItemLayout} label="Key">
                          {getFieldDecorator('keyValue', {
                            rules: [
                              {
                                required: true,
                                message: '请输入API Key',
                              },
                            ],
                            initialValue: detail && detail.authParams ? detail.authParams.keyValue : '',
                          })(<Input type="password" placeholder="请输入API Key" />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </>}
                  {authType === TASK_AUTH_TYPE_BASIC && <>
                    <Row gutter={24}>
                      <Col span={6}></Col>
                      <Col span={7}>
                        <FormItem {...formItemLayout} label="Username">
                          {getFieldDecorator('username', {
                            rules: [
                              {
                                required: true,
                                message: '请输入Username',
                              },
                            ],
                            initialValue: detail && detail.authParams ? detail.authParams.username : '',
                          })(<Input placeholder="请输入Username" />)}
                        </FormItem>
                      </Col>
                      <Col span={7}>
                        <FormItem {...formItemLayout} label="Password">
                          {getFieldDecorator('password', {
                            rules: [
                              {
                                required: true,
                                message: '请输入Password',
                              },
                            ],
                            initialValue: detail && detail.authParams ? detail.authParams.password : '',
                          })(<Input type="password" placeholder="请输入Password" />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </>}
                  {/* {authType === 'hmac' && <>HMAC</>} */}
                </>
              }

              {/* 消费模式 发送邮件 */}
              {opType === TASK_TYPE_CONSUMER && consumeMode === TASK_CONSUME_MODE_EMAIL &&
                <>
                  {/* 收件人邮箱 */}
                  <FormItem {...formItemLayout} label="收件人邮箱">
                    {getFieldDecorator('consumeEmail', {
                      rules: [
                        {
                          required: true,
                          message: '请输入收件人邮箱',
                        },
                      ],
                      initialValue: detail ? detail.consumeEmail : '',
                    })(<Input placeholder="请输入收件人邮箱" />)}
                  </FormItem>
                </>
              }
              {/* 任务周期 */}
              {this.state.isShowTaskPeriod && (
                <FormItem {...formItemLayout} label="任务周期">
                  {getFieldDecorator('taskPeriod', {
                    rules: [
                      {
                        required: true,
                        message: '请设置任务周期',
                      },
                    ],
                    initialValue: detail ? detail.taskPeriod : '',
                  })(
                    <Input readOnly placeholder="请设置任务周期" style={{ width: 200 }} addonAfter={(
                      <Popover
                        placement="right"
                        visible={this.state.cronVisible}
                        content={
                          <div style={{ width: 500 }}>
                            <Cron
                              style={{ boxShadow: 'none' }}
                              value={getFieldValue('taskPeriod')}
                              getCronFns={fns => cronRef = fns}
                              footer={[
                                <Button
                                  style={{ marginRight: 24 }}
                                  onClick={() => {
                                    this.setState({ cronVisible: false });
                                  }
                                  }>取消</Button>,
                                <Button type="primary" onClick={() => {
                                  let cronValue = cronRef.getValue();
                                  if (cronValue) {
                                    cronValue = "0 " + cronValue.substr(2);
                                    setFieldsValue({ taskPeriod: cronValue });
                                    this.setState({ cronVisible: false });
                                  }
                                }
                                }>确认</Button>
                              ]}
                              panesShow={{
                                second: false,
                                minute: true,
                                hour: true,
                                day: true,
                                month: true,
                                week: true,
                                year: true,
                              }}
                              defaultTab={"minute"}
                            />
                          </div>}
                        trigger="click">
                        <Button
                          type='primary'
                          style={{ margin: '-1px -12px' }}
                          onClick={() => { this.setState({ cronVisible: !this.state.cronVisible }); }}>
                          {this.state.cronVisible ? '取消' : '编辑'}
                        </Button>
                      </Popover>
                    )} />
                  )}
                </FormItem>)
              }

              {/* 消费模式 调用API */}
              {((opType === TASK_TYPE_CONSUMER && consumeMode === TASK_CONSUME_MODE_API)) && <>
                <FormItem {...formItemLayout} label="数据模式" extra="根据API接收格式选择，集合是发送多条数据 格式为[{k:v},{k:v},...]，对象是逐个发送数据 格式为{k:v,...}">
                  {getFieldDecorator('dataMode', {
                    initialValue: (detail && detail.dataMode) ? detail.dataMode : 2,
                  })(
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value={2}>集合</Radio.Button>
                      <Radio.Button value={1}>对象</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </>
              }

              {produceMode === TASK_PRODUCE_MODE_PUSH &&
                // 字段前缀
                <FormItem {...formItemLayout} label="数据层级前缀" extra="例如接口返回结构是{result:{data:[...]}} 则填result.data">
                  {getFieldDecorator('apiFieldPrefix', {
                    rules: [
                      {
                        required: false,
                        message: '请输入数据层级前缀',
                      },
                    ],
                    initialValue: detail ? detail.apiFieldPrefix : '',
                  })(<Input placeholder="请输入数据层级前缀" />)}
                </FormItem>
              }
              {consumeMode === TASK_CONSUME_MODE_EMAIL ?
                // 选择字段
                <FormItem {...formItemLayout} label="选择字段">
                  <TaskFieldSelectTable
                    dataFieldList={this.state.dataFieldList}
                    handleSave={this.handleSelectField}
                    initFieldMappings={this.state.fieldMapping}
                  />
                </FormItem>
                :
                // 字段映射
                <FormItem {...formItemLayout} label="字段映射">
                  <TaskFieldMappingTable
                    dataFieldList={this.state.dataFieldList}
                    handleSave={this.handleSaveMapping}
                    initFieldMappings={this.state.fieldMapping}
                  />
                </FormItem>
              }
            </TabPane>
            <TabPane tab="数据过滤" key='2' forceRender>
              {/* 数据过滤 */}
              <FormItem {...formItemLayout} label="有效数据的条件" extra="符合配置条件的业务数据才可用于集成，否则接收时将被过滤 或 消费时不提供">
                <TaskDataFilterTable
                  filters={this.state.filters}
                  handleSave={this.handleSaveFilter}
                  handleDelete={this.handleDeleteFilter}
                  dataFieldList={this.state.dataFieldList}
                />
              </FormItem>
            </TabPane>
            <TabPane tab="变量配置" key='3' forceRender>
              {/* 变量映射 */}
              <FormItem {...formItemLayout} label="数据存入变量">
                <TaskVarMappingTable
                  varMappings={this.state.varMappings}
                  handleSave={this.handleSaveVarMapping}
                  handleDelete={this.handleDeleteVarMapping}
                />
              </FormItem>
            </TabPane>
            <TabPane tab="分批配置" key='4' forceRender>
              {/* 分批配置 */}
              <FormItem {...formItemLayout} label="启用分批">
                {getFieldDecorator('batchStatus', {
                  initialValue: detail ? detail.batchStatus : 0,
                })(<Switch checked={isBatchEnabled} onChange={this.handleChangeBatchStatus} disabled={consumeMode === TASK_CONSUME_MODE_EMAIL} />)}
              </FormItem>
              {isBatchEnabled ?
                <>
                  <FormItem {...formItemLayout} label="分批间隔">
                    {getFieldDecorator('batchInterval', {
                      initialValue: detail && detail.batchInterval ? detail.batchInterval : 2,
                    })(<InputNumber min={1} max={100} placeholder="请输入间隔" />)}<span className="ant-form-text"> 秒</span>
                  </FormItem>
                  {opType === TASK_TYPE_CONSUMER &&
                    <FormItem {...formItemLayout} label="分批数量">
                      {getFieldDecorator('batchSize', {
                        initialValue: detail && detail.batchSize ? detail.batchSize : 1000,
                      })(<InputNumber min={1} max={1000} placeholder="请输入数量" />)}
                    </FormItem>
                  }
                  {opType === TASK_TYPE_PRODUCER &&
                    <FormItem {...formItemLayout} label="特殊情况">
                      {getFieldDecorator('skipError', {
                        initialValue: detail ? detail.skipError : 0,
                      })(
                        <Radio.Group buttonStyle="solid">
                          <Radio.Button value={0}>无</Radio.Button>
                          <Radio.Button value={1}><Tooltip title="API两次返回相同数据时，任务正常结束 不报错中止">数据相同则不报错<Icon type="question-circle" /></Tooltip></Radio.Button>
                        </Radio.Group>
                      )}
                    </FormItem>
                  }
                  <FormItem {...formItemLayout} label="分批参数">
                    <TaskBatchParamTable
                      batchParams={this.state.batchParams}
                      handleSave={this.handleSaveBatchParam}
                      handleDelete={this.handleDeleteBatchParam}
                    />
                  </FormItem>
                </>
                : <></>
              }
            </TabPane>
          </Tabs>
        </Form>
      </Modal >
    );
  }
}

export default DataTaskForm;
