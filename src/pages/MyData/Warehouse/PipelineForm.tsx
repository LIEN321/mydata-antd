import { pipelineDetail, savePipeline } from "@/services/zhiwei/pipeline";
import { ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, message, Row, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import PipelineTasks from "./components/PipelineTasks";

export type PipelineFormProp = {
    /** 表单显示状态 */
    open: boolean;
    /** 切换显示状态 */
    onOpenChange: (open: boolean) => void;
    /** 所属项目id */
    projectId: any;
    /** 所属分组id */
    groupId: any;
    /** 流水线id */
    id?: any;
    /** 保存成功的回调 */
    onSuccess?: () => any;
};

const PipelineForm: React.FC<PipelineFormProp> = (props) => {

    const [id, setId] = useState(props.id);
    const [pipeline, setPipeline] = useState<API.PipelineVO>({})
    const [activeKey, setActiveKey] = useState(props.id ? "2" : "1");
    const [loading, setLoading] = useState(false);

    const [tasks, setTasks] = useState<API.PipelineTaskVO[]>();

    useEffect(() => {
        // 初始时 加载流水线详情
        const loadPipeline = async () => {
            if (id) {
                setLoading(true);
                const response = await pipelineDetail({ id });
                if (response.success && response.data) {
                    setPipeline(() => response.data || {});
                }
                setLoading(false);
            }
        }

        loadPipeline();
    }, []);

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

    if (id) {
        tabItems.push(
            {
                key: '2',
                label: '任务编排',
                children: <PipelineTasks
                    tasks={pipeline.tasks || []}
                    setTasks={setTasks}
                    projectId={props.projectId}
                />
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
            {!loading && <ModalForm
                open={props.open}
                title={id ? '编辑流水线' : '新建流水线'}
                width={1200}
                style={{ height: '70vh' }}
                modalProps={{ centered: true, destroyOnClose: true }}
                onOpenChange={(open) => {
                    if (open === false) {
                        if (props.onSuccess) {
                            props.onSuccess();
                        }
                    }
                    props.onOpenChange(open);
                }}
                onFinish={async (value) => {
                    console.info(tasks);
                    const hide = message.loading("正在提交...");

                    const params: API.PipelineDTO = { ...value };
                    if (props.id) {
                        params.id = props.id;
                    }
                    params.projectId = props.projectId;
                    params.groupId = props.groupId;

                    const response = await savePipeline(params);
                    hide();
                    if (response.success) {
                        message.success("提交成功");

                        // 初始的id无效，则为新建流水线，不关闭表单
                        if (id === undefined) {
                            setId(response.data);
                            setActiveKey("2");
                            return false;
                        }
                    }
                    return true;
                }}
                initialValues={pipeline}
            >
                <Tabs items={tabItems} centered activeKey={activeKey} onChange={(key) => setActiveKey(key)} />
            </ModalForm>
            }
        </>
    );
};

export default PipelineForm;