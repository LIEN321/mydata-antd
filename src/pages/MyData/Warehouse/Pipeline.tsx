import { pipelineGroupList, savePipelineGroup } from "@/services/zhiwei/pipelineGroup";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { DrawerForm, ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Button, Card, Col, message, Row } from "antd";
import { Fragment, useEffect, useState } from "react";

export type PipelineProp = {
    project: API.ProjectVO;
};

const Pipeline: React.FC<PipelineProp> = (props) => {

    const { project } = props;
    const [groups, setGroups] = useState<API.PipelineGroupVO[]>([]);

    // useEffect(() => {
    const loadPipelineGroups = async () => {
        const response = await pipelineGroupList({ projectId: project.id });
        if (response && response.success) {
            setGroups(response.data || []);
        }
    };

    //     loadPipelineGroups();
    // }, []);

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
            >
                <Row gutter={12} wrap={false}>
                    {groups.map((group) => {
                        return (
                            <Col>
                                <Card
                                    style={{ width: 300, minHeight: 800 }}
                                    title={group.groupName}
                                    extra={
                                        <Fragment>
                                            <Button icon={<EditOutlined />} type="text" />
                                            <Button icon={<DeleteOutlined />} type="text" />
                                        </Fragment>
                                    }
                                >
                                </Card>
                            </Col>
                        )
                    })}
                    <Col>
                        <Card style={{ width: 300, minHeight: 800 }}>
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
                                        return true;
                                    }
                                }}
                            >
                                {pipelineGroupForm}
                            </ModalForm>

                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: 300, minHeight: 800 }}>
                            <Button type="dashed" block>
                                <PlusOutlined />
                                新建流水线分组
                            </Button>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: 300, minHeight: 800 }}>
                            <Button type="dashed" block>
                                <PlusOutlined />
                                新建流水线分组
                            </Button>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: 300, minHeight: 800 }}>
                            <Button type="dashed" block>
                                <PlusOutlined />
                                新建流水线分组
                            </Button>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: 300, minHeight: 800 }}>
                            <Button type="dashed" block>
                                <PlusOutlined />
                                新建流水线分组
                            </Button>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: 300, minHeight: 800 }}>
                            <Button type="dashed" block>
                                <PlusOutlined />
                                新建流水线分组
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </DrawerForm >
        </>
    );
};

export default Pipeline;