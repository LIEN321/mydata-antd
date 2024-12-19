import { deletePipelineGroup, pipelineGroupList, savePipelineGroup } from "@/services/zhiwei/pipelineGroup";
import { ApiOutlined, ApiTwoTone, CheckOutlined, ClockCircleOutlined, CloseOutlined, CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, ExclamationCircleOutlined, HistoryOutlined, HourglassTwoTone, LoadingOutlined, PauseOutlined, PlayCircleOutlined, PlusOutlined, StarOutlined, StopOutlined, UserOutlined } from "@ant-design/icons";
import { DrawerForm, ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Button, Card, Col, Dropdown, Form, MenuProps, message, Modal, Popconfirm, Row, Skeleton, Space, theme } from "antd";
import { Fragment, useEffect, useState } from "react";
import PipelineForm from "./PipelineForm";
import { deletePipeline, executePipeline, stopPipeline } from "@/services/zhiwei/pipeline";
import { timeAgo } from "@/util/DateUtil";
import PipelineHistory from "./PipelineHistory";
import { STATUS_RUNNING, openLogWindow } from "../mydata";
import CopyToClipboard from "react-copy-to-clipboard";

export type PipelineProp = {
    project: API.ProjectVO;
};

const timeout = 5000;

const Pipeline: React.FC<PipelineProp> = (props) => {
    const { useToken } = theme;
    const { token } = useToken();

    const [modal, contextHolder] = Modal.useModal();

    const cardWidth = 300;
    const { project } = props;
    const [groups, setGroups] = useState<API.PipelineGroupVO[]>([]);
    const [group, setGroup] = useState<API.PipelineGroupVO>({});
    const [pipeline, setPipeline] = useState<API.PipelineVO>({});
    const [loading, setLoading] = useState<boolean>(false);
    // 是否自动刷新
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    // 加载分组
    const loadPipelineGroups = async () => {
        setGroups([]);
        if (project && project.id) {
            setLoading(true);
            const response = await pipelineGroupList({ projectId: project.id });
            if (response && response.success) {
                setGroups(response.data || []);
                setLoading(false);

                checkIsRefresh(response.data || []);
            }
        } else {
            // message.warning("项目参数无效，请重试...");
        }
    };

    // 只加载分组数据，不使用loading效果
    const fetchPipelineGroups = async () => {
        if (project && project.id) {
            // 查询分组
            const response = await pipelineGroupList({ projectId: project.id });

            if (response && response.success) {
                const groups = response.data || [];
                setGroups(groups);

                checkIsRefresh(groups);
            }
        }
    };

    const checkIsRefresh = (groups: API.PipelineGroupVO[]) => {
        let hasRunningPipeline = false;
        if (groups.length > 0) {
            // 若有运行中的流水线，则自动刷新
            for (const group of groups) {
                const { pipelines } = group;
                if (pipelines && pipelines.length > 0) {
                    for (const pipeline of pipelines) {
                        if (pipeline.latestHistory?.executionStatus === STATUS_RUNNING) {
                            hasRunningPipeline = true;
                            break;
                        }
                    }
                    if (hasRunningPipeline) {
                        break;
                    }
                }
            }
        }
        setIsRefreshing(hasRunningPipeline);
    };

    useEffect(() => {
        loadPipelineGroups();
    }, []);

    useEffect(() => {
        if (!isRefreshing)
            return;

        const interval = setInterval(() => {
            fetchPipelineGroups();
        }, timeout);

        return () => clearInterval(interval);
    }, [isRefreshing]);

    // 分组的编辑表单内容
    const pipelineGroupForm = <>
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入分组名称",
                }
            ]}
            name="groupName"
            label="分组名称"
            placeholder="请输入分组名称"
        />
        <ProFormTextArea
            rules={[
                {
                    required: false,
                    message: "请输入备注",
                }
            ]}
            name="groupDesc"
            label="备注"
            placeholder="请输入备注"
        />
    </>

    // 流水线表单显示状态
    const [pipelineFormOpen, setPipelineFormOpen] = useState<boolean>(false);

    const [form] = Form.useForm();

    // 流水线卡片···的下拉按钮
    const dropdownItems: MenuProps['items'] = [
        {
            key: 'edit',
            label: '编辑',
            icon: <EditOutlined />
        },
        {
            key: '2',
            label: '复制',
            icon: <CopyOutlined />,
            disabled: true,
        },
        {
            key: '3',
            label: '禁用',
            icon: <StopOutlined />,
            disabled: true,
        },
        {
            key: 'delete',
            label: '删除',
            icon: <DeleteOutlined />,
        },
    ];

    // const handleDropdownClick: MenuProps['onClick'] = ({key}) => {
    const handleDropdownClick = (key: string, pipeline: API.PipelineVO) => {
        if (key === 'edit') {
            setPipelineFormOpen(true);
        }
        if (key === 'delete') {
            if (!pipeline.id)
                return;
            modal.confirm({
                title: '是否确认删除',
                icon: <ExclamationCircleOutlined />,
                content: `您确认删除流水线 ${pipeline.pipelineName} 吗？`,
                okType: 'danger',
                okText: '删除',
                onOk: async () => {
                    if (pipeline.id) {
                        const hide = message.loading("正在删除...");
                        await deletePipeline({ id: pipeline.id });
                        hide();
                        message.success("删除成功");
                        loadPipelineGroups();
                    }
                }
            });
        }
    };

    // 流水线状态图标
    const pipelineStatusIcons = [
        <></>
        , <LoadingOutlined style={{ color: token.blue }} title="执行中" />
        , <StopOutlined style={{ color: token.colorWarning }} title="手动停止" />
        , <CheckOutlined style={{ color: token.colorSuccess }} title="执行成功" />
        , <CloseOutlined style={{ color: token.colorError }} title="执行失败" />
    ];

    const getPipelineStatusIcon = (historyId: string, executionStatus: number) => {
        return [
            <></>
            , <LoadingOutlined style={{ color: token.blue }} title="执行中" onClick={() => openLogWindow(historyId)} />
            , <StopOutlined style={{ color: token.colorWarning }} title="手动停止" onClick={() => openLogWindow(historyId)} />
            , <CheckOutlined style={{ color: token.colorSuccess }} title="执行成功" onClick={() => openLogWindow(historyId)} />
            , <CloseOutlined style={{ color: token.colorError }} title="执行失败" onClick={() => openLogWindow(historyId)} />
        ][executionStatus];
    }

    // 流水线触发类型图标
    const pipelineTriggerIcons = [
        <></>
        , <UserOutlined title="触发：手动执行" />
        , <ClockCircleOutlined title="触发：定时任务" />
        , <ApiOutlined title="触发：webhook推送" />
    ];

    return (
        <>
            {contextHolder}
            {/* <DrawerForm
                trigger={
                    <Button onClick={() => { loadPipelineGroups(); }} disabled={!project.id}>
                        流水线管理
                    </Button>
                }
                width={"90%"}
                title={`流水线管理 - ${project.projectName}`}
                submitter={false}
                drawerProps={{ extra: <Button onClick={loadPipelineGroups}>刷新</Button> }}
            > */}
            <Skeleton loading={loading} active>
                <Row
                    gutter={12}
                    wrap={false}
                    style={{ overflow: "auto", height: "71vh" }}
                >
                    {/* 分组列 */}
                    {groups.map((group) => {
                        return (
                            <Col>
                                {/* 流水线分组 Card */}
                                <Card
                                    // bordered={false}
                                    styles={{ body: { padding: 6 } }}
                                    title={group.groupName}
                                    extra={
                                        <Fragment>
                                            {/* 新建流水线 */}
                                            <Button
                                                icon={<PlusOutlined title="新建流水线" />}
                                                type="text"
                                                onClick={() => {
                                                    setPipeline({});
                                                    setGroup(() => group);
                                                    setPipelineFormOpen(true);
                                                }} />
                                            {/* 编辑分组 */}
                                            <ModalForm
                                                trigger={
                                                    <Button icon={<EditOutlined title="编辑分组" />} type="text" />
                                                }
                                                title='编辑分组'
                                                width={400}
                                                onFinish={async (value) => {
                                                    const hide = message.loading("正在提交...");
                                                    const params = { ...value, id: group.id, projectId: project.id };
                                                    const response = await savePipelineGroup(params);
                                                    if (response && response.success === true) {
                                                        hide();
                                                        message.success("编辑成功");
                                                        loadPipelineGroups();
                                                        return true;
                                                    }
                                                }}
                                                initialValues={group}
                                            >
                                                {pipelineGroupForm}
                                            </ModalForm>
                                            {/* 删除分组 */}
                                            <Popconfirm title={'是否确认删除?'} onConfirm={async () => {
                                                if (group.id) {
                                                    const hide = message.loading("正在删除...");
                                                    const response = await deletePipelineGroup({ id: group.id });
                                                    if (response.success) {
                                                        hide();
                                                        message.success("删除成功");
                                                        loadPipelineGroups();
                                                    }
                                                }
                                            }}
                                            >
                                                <Button icon={<DeleteOutlined title="删除分组" />} type="text" />
                                            </Popconfirm>
                                        </Fragment>
                                    }
                                    size="small"
                                >
                                    {/* 流水线列表 */}
                                    <Space direction="vertical" style={{ width: cardWidth }}>
                                        {
                                            group.pipelines && group.pipelines.length > 0 && group.pipelines.map(pipeline => (
                                                <Card
                                                    title={pipeline.pipelineName}
                                                    type="inner"
                                                    size="small"
                                                    actions={[
                                                        (
                                                            (pipeline.latestHistory && pipeline.latestHistory.executionStatus == 1) ?
                                                                <Popconfirm title="确认停止吗？" onConfirm={async () => {
                                                                    if (pipeline.id) {
                                                                        // 暂停执行
                                                                        const response = await stopPipeline({ id: pipeline.id });
                                                                        if (response.success) {
                                                                            loadPipelineGroups();
                                                                        }
                                                                    }
                                                                }}>
                                                                    <PauseOutlined title="停止" />
                                                                </Popconfirm>
                                                                :
                                                                <Popconfirm title="确认执行吗？" onConfirm={async () => {
                                                                    if (pipeline.id) {
                                                                        // 手动执行
                                                                        const response = await executePipeline({ id: pipeline.id });
                                                                        if (response.success) {
                                                                            loadPipelineGroups();
                                                                            setTimeout(() => {
                                                                                setIsRefreshing(true);
                                                                            }, timeout);
                                                                        }
                                                                    }
                                                                }}>
                                                                    <PlayCircleOutlined title="执行" />
                                                                </Popconfirm>
                                                        )
                                                        // 查看流水线历史记录
                                                        , <PipelineHistory pipeline={pipeline} />
                                                        , <StarOutlined />
                                                        , <Dropdown menu={{
                                                            items: dropdownItems, onClick: (info) => {
                                                                setGroup(() => group);
                                                                setPipeline(() => pipeline);
                                                                handleDropdownClick(info.key, pipeline);
                                                            }
                                                        }}
                                                        >
                                                            <EllipsisOutlined />
                                                        </Dropdown>
                                                    ]}
                                                    extra={
                                                        <Space>
                                                            <HourglassTwoTone
                                                                title={`定时周期：${pipeline.isSchedule ? pipeline.intervalTime : '未启用'}`}
                                                                twoToneColor={pipeline.isSchedule ? token.green : token.colorBorder}
                                                                style={{ cursor: "help" }}
                                                            />
                                                            <CopyToClipboard
                                                                text={`https://api.mydata.work/pipeline/${pipeline.id}/webhook/${pipeline.webhookCode}`}
                                                                onCopy={() => {
                                                                    message.success('拷贝成功');
                                                                }}
                                                            >
                                                                <ApiTwoTone
                                                                    title={`Webhook${pipeline.isWebhook ? '已启用，点击复制' : '未启用'}`}
                                                                    twoToneColor={pipeline.isWebhook ? token.green : token.colorBorder}
                                                                />
                                                            </CopyToClipboard>
                                                        </Space>
                                                    }
                                                >
                                                    <Row>
                                                        <Col span={12}>
                                                            最近执行：{pipeline.latestHistory ? <span title={pipeline.latestHistory.startTime}>{timeAgo(pipeline.latestHistory.startTime || '')}</span> : '--'}
                                                        </Col>
                                                        <Col span={8} style={{ textAlign: "center" }}>
                                                            耗时：{pipeline.latestHistory && pipeline.latestHistory.executionTime ? pipeline.latestHistory.executionTime + 's' : '--'}
                                                        </Col>
                                                        <Col span={4} style={{ textAlign: "right" }}>
                                                            <Space>
                                                                <span style={{ cursor: "help" }}>
                                                                    {pipeline.latestHistory && pipelineTriggerIcons[pipeline.latestHistory.triggerType || 0]}
                                                                </span>
                                                                <span style={{ cursor: "help" }}>
                                                                    {pipeline.latestHistory && getPipelineStatusIcon(pipeline.latestHistory.id?.toString() || "", pipeline.latestHistory.executionStatus || 0)}
                                                                </span>
                                                            </Space>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={20}>
                                                            下次执行：{pipeline.nextFireTime || '--'}
                                                        </Col>
                                                        <Col span={4} style={{ textAlign: "right" }}>

                                                        </Col>
                                                    </Row>
                                                </Card>
                                            ))
                                        }
                                        {/* 当没有流水线时，可撑起Space的宽度 */}
                                        <></>
                                    </Space>
                                </Card>
                            </Col>
                        )
                    })}
                    <Col>
                        {/* 新建流水线分组 */}
                        <Card style={{ width: cardWidth }}>
                            <ModalForm
                                form={form}
                                trigger={
                                    <Button type="dashed" block>
                                        <PlusOutlined />
                                        新建流水线分组
                                    </Button>
                                }
                                title='新建分组'
                                width={400}
                                onFinish={async (value) => {
                                    const hide = message.loading("正在提交...");
                                    const params = { ...value, projectId: project.id };
                                    const response = await savePipelineGroup(params);
                                    try {
                                        if (response && response.success === true) {
                                            hide();
                                            message.success("新建成功");
                                            loadPipelineGroups();
                                            return true;
                                        }
                                    } finally {
                                        // 提交后重置表单
                                        form.resetFields();
                                    }
                                }}
                            >
                                {pipelineGroupForm}
                            </ModalForm>
                        </Card>
                    </Col>
                </Row>

                {pipelineFormOpen && <PipelineForm
                    open={pipelineFormOpen}
                    onOpenChange={setPipelineFormOpen}
                    projectId={project.id}
                    groupId={group.id}
                    id={pipeline.id}
                    onSuccess={() => {
                        loadPipelineGroups();
                    }}
                />
                }
            </Skeleton>
            {/* </DrawerForm > */}
        </>
    );
};

export default Pipeline;