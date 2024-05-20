import React, { PureComponent, Fragment, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Row, Divider, Card, Icon, notification, Drawer, Switch } from 'antd';
import { DATA_TASKS, TASK_TYPE_PRODUCER, TASK_TYPE_CONSUMER } from '../../../../actions/task';
import DataTaskForm from './DataTaskForm';

import TaskCard from './TaskCard';

@connect(({ task, loading }) => ({
  task,
  loading: loading.models.task,
}))
@Form.create()
class DataTask extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentTask: {},
      taskFormVisible: false,
      isAutoRefresh: false,
      intervalId: null,
    };
  }

  componentDidMount() {
    this.handleLoadTasks();
  }

  componentWillUnmount() {
    this.stopAutoRefresh();
  }

  // 查询数据项的任务列表
  handleLoadTasks = () => {
    const { dispatch, env, data, projectId } = this.props;
    const params = { projectId, envId: env.id, dataId: data.id };
    dispatch(DATA_TASKS(params));
  }

  handleRefresh = () => {
    this.handleLoadTasks();
    // message.info("刷新成功");
    notification.info({
      message: '刷新成功'
    });
  }
  // ------------------------------------------------------------

  // 显示新增任务表单
  handleAddTask = (opType, isRefEnv) => {
    this.setState({ opType, taskFormVisible: true, currentTask: {}, isRefEnv });
  };

  // 显示编辑任务表单
  handleEditTask = (task) => {
    this.setState({ opType: task.opType, taskFormVisible: true, currentTask: task });
  };

  // 关闭任务表单
  closeTaskForm = () => {
    this.setState({ opType: null, taskFormVisible: false, currentTask: {} });
    this.handleLoadTasks();
  }
  // ------------------------------------------------------------

  renderTaskCard = (task) => {
    const { env, envList } = this.props;

    return <TaskCard
      currentTask={task}
      env={env}
      handleLoadTasks={this.handleLoadTasks}
      handleEditTask={this.handleEditTask}
      closeTaskForm={this.closeTaskForm}
      envList={envList}
    />
  };

  handleChangeAutoRefresh = (checked) => {
    if (checked) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
    this.setState({ isAutoRefresh: checked });
  }

  startAutoRefresh = () => {
    const intervalId = setInterval(() => {
      this.handleLoadTasks();
    }, 5000);
    this.setState({ intervalId });
  }

  stopAutoRefresh = () => {
    const { intervalId } = this.state;
    if (intervalId) {
      clearInterval(intervalId);
      this.setState({ intervalId: null });
    }
  }

  render() {
    const {
      task: { dataTasks },
      env,
      data,
      projectId,
      envList,
    } = this.props;

    const { isAutoRefresh } = this.state;

    return (
      <Drawer
        title={
          <>
            数据项：<span>{data.dataName}</span>
            <Divider type='vertical' />
            环境：<span style={{ color: 'red' }}>{env.envName}</span>
            <Divider type='vertical' />
            前置路径：{env.envPrefix}
            <Divider type='vertical' />
            <Button onClick={this.handleRefresh}>
              <Icon type="reload" />刷新
            </Button>
            <Divider type='vertical' />
            <Switch checked={isAutoRefresh} onChange={this.handleChangeAutoRefresh} />自动刷新（每隔5秒）
          </>
        }
        visible={this.props.dataTaskVisible}
        onClose={this.props.handleCloseTask}
        width="80%"
      >
        {/* <Button onClick={this.handleRefresh}>
          <Icon type="reload" />刷新
        </Button> */}
        <Row>
          <Col span={6} style={{ textAlign: 'center' }}>
            <Card title="提供数据">
              <div style={{ textAlign: 'left' }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Button type='dashed' style={{ width: '100%', height: '50px' }} onClick={() => this.handleAddTask(TASK_TYPE_PRODUCER, false)}>
                      <Icon type="plus" /> 当前环境
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button type='dashed' style={{ width: '100%', height: '50px' }} onClick={() => this.handleAddTask(TASK_TYPE_PRODUCER, true)}>
                      <Icon type="plus" /> 其他环境
                    </Button>
                  </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 16]}>
                  {dataTasks.producerTasks.map(t => (
                    <Col span={24}>
                      {this.renderTaskCard(t)}
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={1} style={{ textAlign: 'center' }}>
            {/* <Divider type='vertical' /> */}
          </Col>
          <Col span={17} style={{ textAlign: 'center' }}>
            <Card title="消费数据">
              <div style={{ textAlign: 'left' }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Button type='dashed' style={{ width: '100%', height: '50px' }} onClick={() => this.handleAddTask(TASK_TYPE_CONSUMER, false)}>
                      <Icon type="plus" /> 当前环境
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button type='dashed' style={{ width: '100%', height: '50px' }} onClick={() => this.handleAddTask(TASK_TYPE_CONSUMER, true)}>
                      <Icon type="plus" /> 其他环境
                    </Button>
                  </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 16]}>
                  {dataTasks.consumerTasks.map(t => (
                    <Col span={8}>
                      {this.renderTaskCard(t)}
                    </Col>
                  ))}
                </Row>
              </div>

            </Card>
          </Col>
        </Row>

        {this.state.taskFormVisible && <DataTaskForm
          env={env}
          envList={envList}
          data={data}
          projectId={projectId}
          opType={this.state.opType}
          taskFormVisible={this.state.taskFormVisible}
          closeTaskForm={this.closeTaskForm}
          currentTask={this.state.currentTask}
          isRefEnv={this.state.isRefEnv}
          producerTasks={dataTasks.producerTasks}
        />}
      </Drawer>
    );
  }
}
export default DataTask;
