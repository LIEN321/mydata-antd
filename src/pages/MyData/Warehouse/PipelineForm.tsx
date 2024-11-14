import { savePipeline } from "@/services/zhiwei/pipeline";
import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Button, Col, message, Row, Tabs, TabsProps } from "antd";

export type PipelineFormProp = {
    /** 表单的标题 */
    title: React.ReactNode;
    /** 所属项目id */
    projectId: any;
    /** 所属分组id */
    groupId: any;
    /** 流水线id */
    id?: any;
};

const PipelineForm: React.FC<PipelineFormProp> = (props) => {

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: '基本信息',
            children: <>
                <Row>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: "请输入流水线名称",
                                }
                            ]}
                            name="pipelineName"
                            label="流水线名称"
                            placeholder="请输入流水线名称"
                        />
                        <ProFormTextArea
                            rules={[
                                {
                                    required: false,
                                    message: "请输入流水线描述",
                                }
                            ]}
                            name="pipelineDesc"
                            label="流水线描述"
                            placeholder="请输入流水线描述"
                        />
                    </Col>
                </Row>
            </>
        },
    ];

    if (props.id) {
        tabItems.push(
            {
                key: '2',
                label: '任务编排',
                children: <></>
            },
            {
                key: '3',
                label: '参数设置',
                children: <></>
            },
            {
                key: '4',
                label: '执行计划',
                children: <></>
            },);
    }

    return (
        <>
            <ModalForm
                trigger={<Button icon={<PlusOutlined title="新建流水线" />} type="text" />}
                title={props.title}
                onFinish={async (value) => {
                    const hide = message.loading("正在提交...");

                    const params : API.PipelineDTO = { ...value };
                    if (props.id) {
                        params.id = props.id;
                    }
                    params.projectId = props.projectId;
                    params.groupId = props.groupId;

                    const response = await savePipeline(params);
                    hide();
                    if (response.success) {
                        message.success("提交成功");
                        return true;
                    }
                }}
            >
                <Tabs items={tabItems} centered />
            </ModalForm>
        </>
    );
};

export default PipelineForm;