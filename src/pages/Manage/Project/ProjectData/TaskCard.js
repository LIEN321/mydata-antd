import React from 'react';
import { Button, Card, Col, Form, Icon, message, Modal, Popover, Row, Select, Spin, Table, Tag, Timeline, Tooltip } from "antd";
import { PureComponent } from "react";
import { connect } from "dva";
import FormItem from "antd/lib/form/FormItem";
import mdStyle from '../../../../layouts/Mydata.less';
import styles from './style.less';
import { executeTask, startTask, stopTask, remove, copyTask, logDetail } from '../../../../services/task';
import { TASK_LOG_LIST, TASK_STATUS_RUNNING, TASK_TYPE_PRODUCER, TASK_PRODUCE_MODE_PUSH, TASK_AUTH_TYPE_NAMES } from '../../../../actions/task';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Text from 'antd/lib/typography/Text';

@connect(({ task, loading }) => ({
    task,
    loading: loading.models.task,
}))
@Form.create()
class TaskCard extends PureComponent {
    // task, env, handleLoadTasks, handleEditTask, closeTaskForm

    constructor(props) {
        super(props);

        this.state = {
            logModalVisible: false,
            copyModalVisible: false,
            logDetailModalVisible: false,
            logPreviewVisible: false,

            taskId: null,
            envId: null,
            logDetail: null,
        };
    }

    handleStart = taskId => {
        Modal.confirm({
            title: '启动确认',
            content: '是否启动所选任务?',
            okText: '确定',
            // okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const response = await startTask(taskId);
                if (response.success) {
                    message.success(response.msg);
                    this.handleLoadTasks();
                } else {
                    message.error(response.msg || '启动失败');
                }
            },
            onCancel() { },
        });
    };

    handleStop = taskId => {
        Modal.confirm({
            title: '停止确认',
            content: '是否停止所选任务?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const response = await stopTask(taskId);
                if (response.success) {
                    message.success(response.msg);
                    this.handleLoadTasks();
                } else {
                    message.error(response.msg || '任务停止失败！');
                }
            },
            onCancel() { },
        });
    };

    handleExecute = taskId => {
        Modal.confirm({
            title: '执行确认',
            content: '是否执行一次所选任务?',
            okText: '确定',
            // okType: 'danger',
            cancelText: '取消',
            async onOk() {
                const response = await executeTask(taskId);
                if (response.success) {
                    message.success('任务已触发执行，请在日志中查看结果！');
                } else {
                    message.error(response.msg || '任务执行失败！');
                }
            },
            onCancel() { },
        });
    };

    // 显示日志
    showLogList = params => {
        const { dispatch } = this.props;
        const { id } = params;
        dispatch(TASK_LOG_LIST({ taskId: id }));
        this.setState({ logModalVisible: true, currentTask: params });
    };

    handleSearchLog = (pagination) => {
        const { dispatch } = this.props;
        const { currentTask } = this.state;
        dispatch(TASK_LOG_LIST({ ...pagination, taskId: currentTask.id }));
    };

    // 关闭日志
    closeLogList = () => {
        this.setState({ logModalVisible: false, currentTask: {} });
    };

    // 删除任务
    handleDelete = (id) => {
        Modal.confirm({
            title: '删除确认',
            content: '确定删除选中记录?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const response = await remove({ ids: id });
                if (response.success) {
                    message.success(response.msg);
                    this.handleLoadTasks();
                } else {
                    message.error(response.msg || '删除失败');
                }
            },
            onCancel() { },
        });
    }

    handleLoadTasks = () => {
        const { handleLoadTasks } = this.props;
        handleLoadTasks();
    }

    handleEditTask = () => {
        const { handleEditTask, currentTask } = this.props;
        handleEditTask(currentTask);
    }

    closeTaskForm = () => {
        const { closeTaskForm } = this.props;
        closeTaskForm();
    }

    openCopyModal = (id) => {
        this.setState({ copyModalVisible: true, taskId: id });
    }

    closeCopyModal = () => {
        this.setState({ copyModalVisible: false, taskId: null, envId: null })
    }

    handleSelectEnv = (envId) => {
        this.setState({ envId });
    }

    handleCopyTask = e => {
        e.preventDefault();
        const { form, env, handleLoadTasks } = this.props;
        const { taskId, envId } = this.state;

        form.validateFieldsAndScroll((err) => {
            if (!err) {
                copyTask({ taskId, envId }).then(resp => {
                    if (resp.success) {
                        message.success("复制成功！");
                        if (envId == env.id) {
                            handleLoadTasks();
                        }
                        form.resetFields();
                        this.closeCopyModal();
                    } else {
                        message.error(resp.msg || '复制失败');
                    }
                });
            }
        });
    }

    openLogDetail = id => {
        logDetail({ id }).then(resp => {
            if (resp.success) {
                this.setState({ logDetail: resp.data, logDetailModalVisible: true });
            }
        });
    }

    closeLogDetail = () => {
        this.setState({ logDetail: null, logDetailModalVisible: false });
    }

    handleLoadLogs = (id) => {
        const { dispatch } = this.props;
        dispatch(TASK_LOG_LIST({ taskId: id, size: 5 }));
    }

    render() {
        const {
            form: { getFieldDecorator },
            task: { logs },
            env,
            currentTask,
            envList,
            loading,
        } = this.props;

        const { copyModalVisible, logDetailModalVisible, logDetail } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 20 },
            },
        };

        const taskStatusStyle = [{}, mdStyle.runningCard, mdStyle.failedCard, mdStyle.stoppedCard];
        const logColumns = [
            {
                title: '开始时间',
                dataIndex: 'taskStartTime',
                width: 160,
            },
            {
                title: '结束时间',
                dataIndex: 'taskEndTime',
                width: 160,
            },
            {
                title: '执行结果',
                dataIndex: 'taskResult',
                width: 100,
                render: taskResult => {
                    const color = taskResult != null ? (taskResult === 1 ? 'green' : 'red') : 'gray';
                    const status = taskResult != null ? (taskResult === 1 ? '成功' : '失败') : '-';
                    return (
                        <Tag color={color}>
                            {status}
                        </Tag>
                    );
                },
            },
            {
                title: '操作',
                width: 100,
                render: (text, record) => (
                    <a onClick={() => { this.openLogDetail(record.id) }}>日志详情</a>
                ),
            },
        ];

        const taskUrl = currentTask.produceMode === TASK_PRODUCE_MODE_PUSH
            ?
            'https://api.mydata.work/mydata-manage/integration/' + currentTask.apiUrl
            :
            currentTask.apiUrl;

        const colors = ['red', 'green'];

        return <>
            <Popover
                placement="bottom"
                visible={this.state.logPreviewVisible}
                content={
                    <div style={{ width: 320 }}>
                        {currentTask.produceMode === TASK_PRODUCE_MODE_PUSH && <p>认证方式：{TASK_AUTH_TYPE_NAMES[currentTask.authType]}</p>}
                        {currentTask.taskPeriod && <p>运行周期：{currentTask.taskPeriod}</p>}
                        {currentTask.subscribeTaskId && <p>订阅任务：{currentTask.subscribeTaskName}</p>}
                        <p>上次执行：{currentTask.lastRunTime ? currentTask.lastRunTime : '-'}</p>
                        <p>上次成功：{currentTask.lastSuccessTime ? currentTask.lastSuccessTime : '-'}</p>
                        <p>下次执行：{currentTask.nextRunTime ? currentTask.nextRunTime : '-'}</p>
                        <p>近期日志 <Text type="mark">最新5个</Text></p>
                        <Spin spinning={loading}>
                            <Timeline>
                                {logs.list.map(log =>
                                    <Timeline.Item
                                        dot={log.taskResult == null && <Icon type="clock-circle" />}
                                        color={log.taskResult != null ? colors[log.taskResult] : 'blue'}
                                    >
                                        <Row>
                                            <Col span={22}>{log.taskStartTime ? log.taskStartTime : '-'} ~ {log.taskEndTime ? log.taskEndTime : '-'}</Col>
                                            <Col span={2}><Icon type="info-circle" onClick={() => { this.openLogDetail(log.id); this.setState({ logPreviewVisible: false }) }} /></Col>
                                        </Row>
                                    </Timeline.Item>
                                )}
                            </Timeline>
                        </Spin>
                        <div style={{ display: 'flex' }}>
                            <Button style={{ marginLeft: 'auto' }} onClick={() => { this.setState({ logPreviewVisible: false }) }}>关闭</Button>
                        </div>
                    </div>}
                trigger="click"
                onClick={(e) => {
                    this.setState({ logPreviewVisible: true });
                }}
                onVisibleChange={visible => {
                    if (visible === true) {
                        this.handleLoadLogs(currentTask.id);
                    }
                    this.setState({ logPreviewVisible: visible });
                }}
            >
                <Card
                    key={currentTask.id}
                    title={currentTask.taskName}
                    hoverable
                    size='small'
                    className={[styles.card, taskStatusStyle[currentTask.taskStatus]]}
                    actions={[
                        currentTask.taskStatus == TASK_STATUS_RUNNING ?
                            <Popover content="停止"><Icon type="pause" onClick={(e) => { this.handleStop(currentTask.id); e.stopPropagation(); }} /></Popover>
                            :
                            <Popover content="启动"><Icon type="play-circle" onClick={(e) => { this.handleStart(currentTask.id); e.stopPropagation(); }} /></Popover>,
                        <Popover content="执行一次"><Icon type="redo" onClick={(e) => { this.handleExecute(currentTask.id); e.stopPropagation(); }} /></Popover>,
                        <Popover content="运行日志"><Icon type="history" onClick={(e) => { this.showLogList(currentTask); e.stopPropagation(); }} /></Popover>,
                        <Popover content="编辑"><Icon type="edit" onClick={(e) => { this.handleEditTask(currentTask); e.stopPropagation(); }} /></Popover>,
                        <Popover content="复制"><Icon type="copy" onClick={(e) => { this.openCopyModal(currentTask.id); e.stopPropagation(); }} /></Popover>,
                        <Popover content="删除"><Icon type="delete" onClick={(e) => { this.handleDelete(currentTask.id); e.stopPropagation(); }} /></Popover>,
                    ]}
                    extra={currentTask.refEnvId ?
                        (currentTask.envId == env.id ?
                            (currentTask.opType === TASK_TYPE_PRODUCER ?
                                <Popover content={`${currentTask.refEnvName}环境提供`}>{currentTask.refEnvName} <Icon type="login" /></Popover>
                                : <Popover content={`${currentTask.refEnvName}环境消费`}><Icon type="logout" /> {currentTask.refEnvName}</Popover>)
                            : (currentTask.refOpType === TASK_TYPE_PRODUCER ?
                                <Popover content={`${currentTask.envName}环境提供`}>{currentTask.envName} <Icon type="login" /></Popover>
                                : <Popover content={`${currentTask.envName}环境消费`}><Icon type="logout" /> {currentTask.envName}</Popover>)
                        )
                        :
                        <></>}
                >
                    {/* {currentTask.refEnvId ? <p>其他环境：{currentTask.refEnvName}</p> : <></>} */}
                    {currentTask.apiUrl && <Row>
                        <Col span={22}>
                            <Tooltip title={taskUrl}>
                                <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    <Icon type="link" /> {taskUrl}
                                </p>
                            </Tooltip>
                        </Col>
                        <Col span={2} style={{ textAlign: 'right' }} onClick={(e) => { e.stopPropagation(); }}>
                            <CopyToClipboard text={taskUrl} onCopy={() => message.success(`拷贝成功地址：${taskUrl}`)}>
                                <Icon type="copy" />
                            </CopyToClipboard>
                        </Col>
                    </Row>}
                    {currentTask.consumeEmail && <p><Icon type="mail" /> {currentTask.consumeEmail}</p>}
                </Card>
            </Popover>

            <Modal
                title="查看日志"
                width="60%"
                visible={this.state.logModalVisible}
                footer={[
                    <Button key="refresh" onClick={() => this.handleSearchLog({ current: 1, pageSize: 10 })}>
                        刷新
                    </Button>,
                    <Button key="back" onClick={this.closeLogList}>
                        关闭
                    </Button>,
                ]}
                onCancel={this.closeLogList}
            >
                {this.state.logModalVisible && <Table
                    columns={logColumns}
                    dataSource={logs.list}
                    pagination={logs.pagination}
                    onChange={this.handleSearchLog}
                    expandedRowRender={record => <div style={{ 'overflow-wrap': 'anywhere' }} dangerouslySetInnerHTML={{ __html: `${record.taskDetail.replaceAll('\n', '</br>')}`, }} />}
                    loading={loading}
                />}
            </Modal>

            {copyModalVisible && <Modal
                title="复制任务"
                visible={copyModalVisible}
                footer={[<Button key="submit" type="primary" onClick={this.handleCopyTask}>复制</Button>]}
                onCancel={this.closeCopyModal}
            >
                <Form style={{ marginTop: 8 }}>
                    <FormItem {...formItemLayout} label="复制到：">
                        {getFieldDecorator('envId', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择环境',
                                },
                            ],
                        })
                            (<Select allowClear placeholder="请选择环境" onChange={this.handleSelectEnv}>
                                {envList.map(e =>
                                    // e.id != env.id ?
                                    <Select.Option key={e.id} value={e.id}>
                                        {e.envName} ({e.envPrefix})
                                    </Select.Option>
                                    //  : <></>
                                )}
                            </Select>)
                        }
                    </FormItem>
                </Form>
            </Modal>}

            {logDetailModalVisible && <Modal
                title="日志详情"
                visible={logDetailModalVisible}
                footer={[<Button key="back" onClick={this.closeLogDetail}>关闭</Button>]}
                onCancel={this.closeLogDetail}
                width="60%"
            >
                <Form style={{ marginTop: 8 }}>
                    <FormItem {...formItemLayout} label="开始时间">
                        <span>{logDetail.taskStartTime}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="结束时间">
                        <span>{logDetail.taskEndTime}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="执行结果">
                        <span>{logDetail.taskResult != null ? (logDetail.taskResult === 0 ? '失败' : '成功') : '-'}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="日志内容">
                        <div style={{ overflowWrap: 'anywhere', height: '400px', overflow: 'scroll' }} dangerouslySetInnerHTML={{ __html: `${logDetail.taskDetail.replaceAll('\n', '</br>')}`, }} />
                    </FormItem>
                </Form>
            </Modal>}

        </>
    }
}

export default TaskCard;