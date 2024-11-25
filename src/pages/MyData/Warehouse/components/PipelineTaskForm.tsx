import { ProCard, ProForm, ProFormItem, ProFormSelect, ProFormText, ProTable } from "@ant-design/pro-components";
import { Button, Col, Form, Row, Skeleton, Table } from "antd";
import { API_GET_DATA, API_SEND_DATA, SAVE_DATA } from "./task";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { TaskItem } from "./PipelineTasks";
import { appSelect } from "@/services/zhiwei/app";
import { apiSelect } from "@/services/zhiwei/appApi";
import { dataSelect, fieldList } from "@/services/zhiwei/data";
import AddApp from "./AddApp";
import AddApi from "./AddApi";
import FieldMappingTable, { FieldMappingDataType } from "./task_components/FieldMappingTable";

export type TaskFormProp = {
    /** 任务信息 */
    task: TaskItem,
    /** 更新任务信息 */
    updateTask: (task: TaskItem) => void;
    /** 所属项目id */
    projectId: any;
};

const PipelineTaskForm: React.FC<TaskFormProp> = (props) => {

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
        console.info("task", task);
        form.resetFields();
        if (task) {
            form.setFieldsValue(task);
        }
        loadDataFields(task.dataId || null);
    }, [task]);

    // 字段映射 相关对象
    const [fieldMappings, setFieldMappings] = useState<FieldMappingDataType[]>([]);

    // 加载标准数据的字段列表
    const loadDataFields = async (dataId: number | null) => {
        setLoading(true);
        if (dataId) {
            const response = await fieldList({ dataId });
            if (response.success) {
                // 字段列表
                const fieldList = response.data;
                // 取字段的 code和name
                const fieldMappings = fieldList as FieldMappingDataType[];
                // 若任务中配置的字段映射，则并入fieldMappings 用于表格显示
                const fieldMapping = task.taskConfig.FIELD_MAPPING;
                if (fieldMapping) {
                    fieldMappings.map(m => {
                        m.apiField = fieldMapping[m.fieldCode] || "";
                    });
                }
                setFieldMappings(() => fieldMappings);
            }
        }
        else {
            setFieldMappings(() => []);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (task && task.dataId) {
            loadDataFields(task.dataId);
        }
    }, []);

    const handleUpdateFieldMappings = (fieldMappings: FieldMappingDataType[]) => {
        setFieldMappings(fieldMappings);
        const fieldMapping = {} as any;
        // 提取 数据字段-接口字段 的映射关系
        fieldMappings.map(m => {
            fieldMapping[m.fieldCode] = m.apiField;
        });
        // 映射关系写入taskConfig.FIELD_MAPPING
        task.taskConfig.FIELD_MAPPING = fieldMapping;
        updateTask();
    };

    /** 加载状态 */
    const [loading, setLoading] = useState<boolean>(false);

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
                            // 获取数据 或 发送数据
                            (task.taskType === API_GET_DATA || task.taskType === API_SEND_DATA) && <>
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
                                            // 新建应用
                                            addonAfter={<AddApp onSuccess={(newAppId) => {
                                                // 重新加载应用列表
                                                form.resetFields(['appId']);
                                                // 选择新增的应用
                                                form.setFieldValue('appId', newAppId);
                                                // 更新task的应用id
                                                task.appId = newAppId;
                                                updateTask();
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
                                            disabled={!task.appId || task.appId <= 0}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择API！',
                                                }
                                            ]}
                                            width={"sm"}
                                            // 新建API
                                            addonAfter={<AddApi
                                                appId={task.appId || 0}
                                                onSuccess={(newApiId) => {
                                                    // 重新加载API列表
                                                    form.resetFields(['apiId']);
                                                    // 选择新增的API
                                                    form.setFieldValue('apiId', newApiId);
                                                    // 更新task的API id
                                                    task.apiId = newApiId;
                                                    updateTask();
                                                }} />}
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
                                                loadDataFields(dataId);
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
                                        >
                                            <Skeleton loading={loading} active>
                                                {
                                                    !loading && <FieldMappingTable
                                                        fieldMappings={fieldMappings}
                                                        handleUpdateFieldMappings={handleUpdateFieldMappings}
                                                        loading={loading}
                                                    />
                                                }
                                            </Skeleton>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>
                        }
                        {
                            // 保存数据
                            (task.taskType === SAVE_DATA && <>
                                <Row gutter={24}>
                                    {/* 仓库名称 */}
                                    <Col span={12}>
                                        <ProFormText
                                            name="warehouse"
                                            label="仓库名称"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入仓库名称！',
                                                }
                                            ]}
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.warehouse = e.target.value;
                                                    updateTask();
                                                }
                                            }}
                                        />
                                    </Col>
                                    <Col span={12}></Col>
                                </Row>
                            </>)
                        }
                    </ProForm>
                </ProCard>
            }
        </>
    );
};

export default PipelineTaskForm;