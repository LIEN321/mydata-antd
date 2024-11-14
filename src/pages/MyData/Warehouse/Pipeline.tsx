import { deletePipelineGroup, pipelineGroupList, savePipelineGroup } from "@/services/zhiwei/pipelineGroup";
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { DrawerForm, ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Button, Card, Col, message, Popconfirm, Row, Space } from "antd";
import { Fragment, useEffect, useState } from "react";
import PipelineForm from "./PipelineForm";

export type PipelineProp = {
    project: API.ProjectVO;
};

const Pipeline: React.FC<PipelineProp> = (props) => {

    const { project } = props;
    const [groups, setGroups] = useState<API.PipelineGroupVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

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

    return (
        <>
            <DrawerForm
                trigger={
                    <Button onClick={() => { loadPipelineGroups(); }}>
                        流水线管理
                    </Button>
                }
                width={"90%"}
                title={`流水线管理 - ${project.projectName}`}
                submitter={false}
            >
                <Row
                    gutter={12}
                    wrap={false}
                >
                    {loading && <LoadingOutlined />}
                    {!loading && groups.map((group) => {
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
                                            <PipelineForm
                                                title="新建流水线"
                                                projectId={project.id}
                                                groupId={group.id}
                                            />
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
                                    <Space direction="vertical" style={{ width: 300 }}>
                                        {
                                            group.pipelines && group.pipelines.length > 0 && group.pipelines.map(pipeline => (
                                                <Card title={pipeline.pipelineName} type="inner" size="small"></Card>
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
                        <Card style={{ width: 300 }}>
                            <ModalForm
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
                                    if (response && response.success === true) {
                                        hide();
                                        message.success("新建成功");
                                        loadPipelineGroups();
                                        return true;
                                    }
                                }}
                                initialValues={{}}
                            >
                                {pipelineGroupForm}
                            </ModalForm>

                        </Card>
                    </Col>
                </Row>
            </DrawerForm >
        </>
    );
};

export default Pipeline;