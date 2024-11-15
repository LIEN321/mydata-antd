import { deletePipelineGroup, pipelineGroupList, savePipelineGroup } from "@/services/zhiwei/pipelineGroup";
import { CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, ExclamationCircleFilled, ExclamationCircleOutlined, HistoryOutlined, LoadingOutlined, PlayCircleOutlined, PlusOutlined, StarOutlined, StopOutlined } from "@ant-design/icons";
import { DrawerForm, ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Button, Card, Col, Dropdown, Form, MenuProps, message, Modal, Popconfirm, Row, Skeleton, Space, Spin } from "antd";
import { Fragment, useEffect, useState } from "react";
import PipelineForm from "./PipelineForm";
import { deletePipeline } from "@/services/zhiwei/pipeline";

export type PipelineProp = {
    project: API.ProjectVO;
};

const Pipeline: React.FC<PipelineProp> = (props) => {

    const [modal, contextHolder] = Modal.useModal();

    const cardWidth = 300;
    const { project } = props;
    const [groups, setGroups] = useState<API.PipelineGroupVO[]>([]);
    const [group, setGroup] = useState<API.PipelineGroupVO>({});
    const [pipeline, setPipeline] = useState<API.PipelineVO>({});
    const [loading, setLoading] = useState<boolean>(false);

    // 加载分组
    const loadPipelineGroups = async () => {
        setGroups([]);
        if (project && project.id) {
            setLoading(true);
            const response = await pipelineGroupList({ projectId: project.id });
            if (response && response.success) {
                setGroups(response.data || []);
                setLoading(false);
            }
        } else {
            message.warning("项目参数无效，请重试...");
        }
    };

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
            label: '复制(TODO)',
            icon: <CopyOutlined />
        },
        {
            key: '3',
            label: '禁用(TODO)',
            icon: <StopOutlined />
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

    return (
        <>
            {contextHolder}
            <DrawerForm
                trigger={
                    <Button onClick={() => { loadPipelineGroups(); }} disabled={!project.id}>
                        流水线管理
                    </Button>
                }
                width={"90%"}
                title={`流水线管理 - ${project.projectName}`}
                submitter={false}
            >
                <Skeleton loading={loading} active>
                    <Row
                        gutter={12}
                        wrap={false}
                    >
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
                                    >
                                        {/* 分组的 流水线列表 */}
                                        <Space direction="vertical" style={{ width: cardWidth }}>
                                            {
                                                group.pipelines && group.pipelines.length > 0 && group.pipelines.map(pipeline => (
                                                    <Card
                                                        title={pipeline.pipelineName}
                                                        type="inner"
                                                        size="small"
                                                        actions={[
                                                            <PlayCircleOutlined />
                                                            , <HistoryOutlined />
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
                                                    >

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
                        title="新建流水线"
                        projectId={project.id}
                        groupId={group.id}
                        id={pipeline.id}
                        onSuccess={() => {
                            loadPipelineGroups();
                        }}
                    />
                    }
                </Skeleton>
            </DrawerForm >
        </>
    );
};

export default Pipeline;