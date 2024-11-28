import { pipelineDetail, savePipeline } from "@/services/zhiwei/pipeline";
import { ModalForm, ProFormCheckbox, ProFormItem, ProFormRadio, ProFormSwitch, ProFormText, ProFormTextArea, ProFormTimePicker } from "@ant-design/pro-components";
import { Button, Col, message, Row, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import PipelineTasks from "./components/PipelineTasks";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";

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
                    setTasks(response.data.tasks);
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
                    tasks={tasks || []}
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
                children: <>
                    <Row gutter={24}>
                        <Col span={6}></Col>
                        <Col span={2}>
                            <ProFormSwitch
                                label="启用定时"
                                name="isSchedule"
                            />
                        </Col>
                        <Col span={12}>
                            <ProFormCheckbox.Group
                                label="执行日"
                                name="dayOfWeek"
                                rules={[{ required: false, message: "请选择执行日" }]}
                                options={[
                                    { label: "周日", value: 1 }
                                    , { label: "周一", value: 2 }
                                    , { label: "周二", value: 3 }
                                    , { label: "周三", value: 4 }
                                    , { label: "周四", value: 5 }
                                    , { label: "周五", value: 6 }
                                    , { label: "周六", value: 7 }
                                ]}
                                initialValue={[2, 3, 4, 5, 6]}
                            />
                            <ProFormItem
                                label="时间段"
                                style={{ marginBottom: 0 }}
                            >
                                <Row>
                                    <ProFormTimePicker
                                        name="startTime"
                                        allowClear={false}
                                        fieldProps={{ format: "HH:mm", needConfirm: false }}
                                        initialValue={"00:00"}
                                        rules={[{ required: true, message: "请选择开始时间" }]}
                                    />
                                    <span style={{ marginLeft: 12, marginRight: 12 }}>至</span>
                                    <ProFormTimePicker
                                        name="endTime"
                                        allowClear={false}
                                        fieldProps={{ format: "HH:mm", needConfirm: false }}
                                        initialValue={"23:59"}
                                        rules={[{ required: true, message: "请选择结束时间" }]}
                                    />
                                </Row>
                            </ProFormItem>
                            <ProFormTimePicker
                                label="时间间隔"
                                name="intervalTime"
                                allowClear={false}
                                fieldProps={{ needConfirm: false, showNow: false }}
                                rules={[{ required: true, message: "请选择时间间隔" }]}
                                initialValue={"00:15:00"}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}></Col>
                        <Col span={2}>
                            <ProFormSwitch
                                label="Webhook"
                                name="isWebhook"
                            />
                        </Col>
                        <Col span={12}>
                            <ProFormText
                                label="Webhook地址"
                                disabled
                                fieldProps={{
                                    addonAfter: (
                                        <CopyToClipboard
                                            text={`https://api.mydata.work/webhook/${pipeline.id}/${pipeline.webhookCode}`}
                                            onCopy={() => {
                                                message.success('拷贝成功');
                                            }}
                                        >
                                            <Button type="text" size="small" disabled={false} icon={<CopyOutlined />} />
                                        </CopyToClipboard>
                                    ),
                                    value: `https://api.mydata.work/webhook/${pipeline.id}/${pipeline.webhookCode}`,
                                }}
                            />
                            <ProFormRadio.Group
                                radioType="button"
                                label="认证方式"
                                name="webhookAuthType"
                                rules={[{ required: false, message: "请选择认证方式" }]}
                                options={[
                                    { label: "无", value: 0 }
                                    , { label: "API Key", value: 1 }
                                    , { label: "Basic Auth", value: 2 }
                                    // , { label: "HMAC", value: 3 }
                                ]}
                                initialValue={0}
                                fieldProps={{
                                    onChange: (e) => {
                                        const updatePipeline = { ...pipeline, webhookAuthType: e.target.value };
                                        setPipeline(updatePipeline);
                                    }
                                }}
                            />
                            <Row gutter={24}>
                                <Col span={2}></Col>
                                {pipeline.webhookAuthType === 1 &&
                                    <>
                                        <Col span={10}>
                                            <ProFormText label="Header Key"
                                                fieldProps={{
                                                    onChange: (e) => {
                                                        const webhookAuthParams = { ...pipeline.webhookAuthParams };
                                                        if(!webhookAuthParams.ApiKey){
                                                            webhookAuthParams.ApiKey = {};
                                                        }
                                                        webhookAuthParams.ApiKey.key = e.target.value;
                                                        const updatePipeline = { ...pipeline, webhookAuthParams };
                                                        setPipeline(updatePipeline);
                                                    },
                                                    value: pipeline.webhookAuthParams && pipeline.webhookAuthParams.ApiKey?.key,
                                                }}
                                            />
                                        </Col>
                                        <Col span={10}>
                                            <ProFormText label="Header Value"
                                                fieldProps={{
                                                    onChange: (e) => {
                                                        const webhookAuthParams = { ...pipeline.webhookAuthParams };
                                                        if(!webhookAuthParams.ApiKey){
                                                            webhookAuthParams.ApiKey = {};
                                                        }
                                                        webhookAuthParams.ApiKey.value = e.target.value;
                                                        const updatePipeline = { ...pipeline, webhookAuthParams };
                                                        setPipeline(updatePipeline);
                                                    },
                                                    value: pipeline.webhookAuthParams && pipeline.webhookAuthParams.ApiKey?.value,
                                                }}
                                            />
                                        </Col>
                                    </>
                                }
                                {pipeline.webhookAuthType === 2 &&
                                    <>
                                        <Col span={10}>
                                            <ProFormText label="Username"
                                                fieldProps={{
                                                    onChange: (e) => {
                                                        const webhookAuthParams = { ...pipeline.webhookAuthParams };
                                                        if(!webhookAuthParams.BasicAuth){
                                                            webhookAuthParams.BasicAuth = {};
                                                        }
                                                        webhookAuthParams.BasicAuth.username = e.target.value;
                                                        const updatePipeline = { ...pipeline, webhookAuthParams };
                                                        setPipeline(updatePipeline);
                                                    },
                                                    value: pipeline.webhookAuthParams && pipeline.webhookAuthParams.BasicAuth?.username,
                                                }}
                                            />
                                        </Col>
                                        <Col span={10}>
                                            <ProFormText label="Password"
                                                fieldProps={{
                                                    onChange: (e) => {
                                                        const webhookAuthParams = { ...pipeline.webhookAuthParams };
                                                        if(!webhookAuthParams.BasicAuth){
                                                            webhookAuthParams.BasicAuth = {};
                                                        }
                                                        webhookAuthParams.BasicAuth.password = e.target.value;
                                                        const updatePipeline = { ...pipeline, webhookAuthParams };
                                                        setPipeline(updatePipeline);
                                                    },
                                                    value: pipeline.webhookAuthParams && pipeline.webhookAuthParams.BasicAuth?.password,
                                                }}
                                            />
                                        </Col>
                                    </>
                                }
                                {pipeline.webhookAuthType === 3 &&
                                    <>
                                        <Col span={20}>
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <ProFormText label="Algorithm" />
                                                </Col>
                                                <Col span={12}>
                                                    <ProFormText label="Encoding" />
                                                </Col>
                                            </Row>
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <ProFormText label="Signature Header Key" />
                                                </Col>
                                                <Col span={12}>
                                                    <ProFormText label="Password" />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </>
                                }
                            </Row>
                        </Col>
                    </Row>
                </>
            },);
    }

    return (
        <>
            {!loading && <ModalForm
                open={props.open}
                title={id ? '编辑流水线' : '新建流水线'}
                width={1200}
                style={{ height: 800 }}
                clearOnDestroy
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
                    if (id) {
                        params.id = id;
                    }
                    params.projectId = props.projectId;
                    params.groupId = props.groupId;
                    params.tasks = tasks;
                    params.webhookAuthParams = pipeline.webhookAuthParams;

                    const response = await savePipeline(params);
                    hide();
                    if (response.success) {
                        message.success("提交成功");

                        // 初始的id无效，则为新建流水线，不关闭表单
                        if (!id) {
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