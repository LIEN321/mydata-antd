import { ProCard, ProForm, ProFormItem, ProFormSelect, ProFormText, ProTable } from "@ant-design/pro-components";
import { Button, Col, Form, Row, Table } from "antd";
import { API_GET_DATA } from "./task";
import { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { TaskItem } from "./PipelineTasks";
import { appSelect } from "@/services/zhiwei/app";
import { apiSelect } from "@/services/zhiwei/appApi";
import { dataSelect } from "@/services/zhiwei/data";
import AddApp from "./AddApp";

export type TaskFormProp = {
    /** 任务信息 */
    task: TaskItem,
    /** 更新任务信息 */
    updateTask: (task: TaskItem) => void;
    /** 所属项目id */
    projectId: any;
};

const TaskForm: React.FC<TaskFormProp> = (props) => {

    // 获取外部传入的task信息
    const { task } = props;

    // 更新task信息
    const updateTask = () => {
        props.updateTask(task);
    }

    // 创建 form 实例
    const [form] = Form.useForm();
    // 当 task 变化时，更新表单内容
    useEffect(() => {
        if (task) {
            form.setFieldsValue(task);
        } else {
            form.resetFields();
        }
    }, [task]);

    return (
        <>
            {task &&
                <ProCard>
                    <ProForm
                        form={form}
                        submitter={false}
                        initialValues={task}
                        clearOnDestroy
                    >
                        <Row gutter={24}>
                            {/* 步骤名称 */}
                            <Col span={12}>
                                <ProFormText
                                    name="taskName"
                                    label="步骤名称"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入步骤名称！',
                                        }
                                    ]}
                                    fieldProps={{
                                        onChange: (e) => {
                                            task.taskName = e.target.value;
                                            updateTask();
                                        }
                                    }}
                                />
                            </Col>
                            <Col span={12}></Col>
                        </Row>
                        {
                            // 获取数据
                            task.taskType === API_GET_DATA && <>
                                <Row gutter={24}>
                                    {/* 选择应用 */}
                                    <Col span={12}>
                                        <ProFormSelect
                                            name="appId"
                                            label="选择应用"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择应用！',
                                                }
                                            ]}
                                            width={"sm"}
                                            addonAfter={<AddApp onSuccess={(newAppId) => {
                                                // 重新加载应用列表
                                                form.resetFields(['appId']);
                                                // 选择新增的应用
                                                form.setFieldValue('appId', newAppId);
                                            }} />}
                                            addonWarpStyle={{ width: "100%" }}
                                            request={appSelect}
                                            onChange={(appId: number) => {
                                                task.appId = appId;
                                                updateTask();
                                                form.setFieldValue('apiId', undefined);
                                            }}
                                        />
                                    </Col>
                                    {/* 选择API */}
                                    <Col span={12}>
                                        <ProFormSelect
                                            name="apiId"
                                            label="选择API"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择API！',
                                                }
                                            ]}
                                            width={"sm"}
                                            addonAfter={<Button icon={<PlusOutlined />} />}
                                            // 基于应用Select联动
                                            dependencies={['appId']}
                                            request={apiSelect}
                                            onChange={(apiId: number) => {
                                                task.apiId = apiId;
                                                updateTask();
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    {/* 选择数据 */}
                                    <Col span={12}>
                                        <ProFormSelect
                                            name="dataId"
                                            label="选择数据"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择数据！',
                                                }
                                            ]}
                                            request={() => { return dataSelect({ projectId: props.projectId }); }}
                                            onChange={(dataId: number) => {
                                                task.dataId = dataId;
                                                updateTask();
                                            }}
                                        />
                                    </Col>
                                    <Col span={12}></Col>
                                </Row>
                                <Row gutter={24}>
                                    {/* 字段映射 */}
                                    <Col span={24}>
                                        <ProFormItem
                                            label="字段映射"
                                        />
                                        <Table/>
                                    </Col>
                                </Row>
                            </>
                        }
                    </ProForm>
                </ProCard>
            }
        </>
    );
};

export default TaskForm;