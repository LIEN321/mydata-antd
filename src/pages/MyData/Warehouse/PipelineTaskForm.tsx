import { ProCard, ProForm, ProFormDigit, ProFormItem, ProFormRadio, ProFormSelect, ProFormSwitch, ProFormText, ProTable } from "@ant-design/pro-components";
import { Button, Col, Form, Row, Skeleton, Table, Typography } from "antd";
import { API_GET_JSON, API_SEND_DATA, FILTER_DATA, JSON_TO_DATA, QUERY_DATA, SAVE_DATA, TASK_TEMPLATE, TaskKey, WEBHOOK_GET_JSON } from "../mydata";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { TaskItem } from "./PipelineTask";
import { appSelect } from "@/services/zhiwei/app";
import { apiSelect } from "@/services/zhiwei/appApi";
import { dataSelect, fieldList } from "@/services/zhiwei/data";
import AddApp from "./components/AddApp";
import AddApi from "./components/AddApi";
import FieldMappingTable, { FieldMappingDataType } from "./components/task_components/FieldMappingTable";
import BatchParamTable, { BatchParamDataType } from "./components/task_components/BatchParamTable";
import DataFilterTable, { DataFilterDataType } from "./components/task_components/DataFilterTable";

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

    // 所选标准数据的字段
    const [dataFields, setDataFields] = useState<API.DataFieldVO[]>([]);
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
                setDataFields(fieldList || []);
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
            setDataFields(() => []);
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

    const handleUpdateBatchParams = (batchParams: BatchParamDataType[]) => {
        task.taskConfig.BATCH.PARAMS = batchParams;
        updateTask();
    };

    const handleUpdateDataFilters = (dataFilters: DataFilterDataType[]) => {
        task.taskConfig.DATA_FILTER = dataFilters;
        updateTask();
    };

    /** 加载状态 */
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <>
            {task &&
                <ProCard style={{ height: 730, overflowY: "scroll" }}>
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
                            // ---------------------------------------- API: 调用API获取JSON ----------------------------------------
                            (task.taskType === API_GET_JSON) && <>
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
                                    <Col span={4}>
                                        <ProFormSwitch
                                            label="启用分批"
                                            fieldProps={{
                                                onChange: (checked) => {
                                                    task.taskConfig.BATCH.ENABLE = checked;
                                                    updateTask();
                                                },
                                                value: task.taskConfig.BATCH.ENABLE || false,
                                            }}
                                        />
                                    </Col>
                                    {
                                        task.taskConfig.BATCH.ENABLE &&
                                        <>
                                            <Col span={5}>
                                                <ProFormDigit label="分批间隔（秒）" min={2} fieldProps={{
                                                    onChange: (value) => {
                                                        task.taskConfig.BATCH.INTERVAL = value;
                                                        updateTask();
                                                    },
                                                    value: task.taskConfig.BATCH.INTERVAL,
                                                }} />
                                            </Col>
                                            <Col span={2}></Col>
                                            <Col span={10}>
                                                {/* <ProFormRadio.Group label="结束方式" radioType="button"
                                                    options={[
                                                        { label: "接口无数据", value: 0 },
                                                        { label: "数据重复", value: 1 },
                                                    ]}
                                                    fieldProps={{
                                                        onChange: (e) => {
                                                            task.taskConfig.BATCH.END_TYPE = e.target.value;
                                                            updateTask();
                                                        },
                                                        value: task.taskConfig.BATCH.END_TYPE,
                                                    }}
                                                /> */}
                                            </Col>
                                            <Col span={24}>
                                                <Skeleton loading={loading} active>
                                                    {
                                                        !loading && <BatchParamTable
                                                            batchParams={task.taskConfig.BATCH.PARAMS}
                                                            handleUpdateBatchParams={handleUpdateBatchParams}
                                                            loading={loading}
                                                        />
                                                    }
                                                </Skeleton>
                                            </Col>
                                        </>
                                    }
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        {/* 输出设置 */}
                                        <ProFormItem label="输出到流水线变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="原始的JSON"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.ORIGIN_JSON = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.ORIGIN_JSON || "ORIGIN_JSON",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="业务数据的JSON"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.DATA_JSON = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.DATA_JSON || "DATA_JSON",
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>
                        }
                        {
                            // ---------------------------------------- API: 调用API发送数据 ----------------------------------------
                            (task.taskType === API_SEND_DATA) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="前置任务的输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    {/* 业务数据变量 */}
                                                    <ProFormText
                                                        label="业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入业务数据变量名！',
                                                            }
                                                        ]}
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
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
                                <Row gutter={24}>
                                    <Col span={4}>
                                        <ProFormSwitch
                                            label="启用分批"
                                            fieldProps={{
                                                onChange: (checked) => {
                                                    task.taskConfig.BATCH.ENABLE = checked;
                                                    updateTask();
                                                },
                                                value: task.taskConfig.BATCH.ENABLE || false,
                                            }}
                                        />
                                    </Col>
                                    {
                                        task.taskConfig.BATCH.ENABLE &&
                                        <>
                                            <Col span={5}>
                                                <ProFormDigit label="分批间隔（秒）" min={2} fieldProps={{
                                                    onChange: (value) => {
                                                        task.taskConfig.BATCH.INTERVAL = value;
                                                        updateTask();
                                                    },
                                                    value: task.taskConfig.BATCH.INTERVAL,
                                                }} />
                                            </Col>
                                            <Col span={2}></Col>
                                            <Col span={5}>
                                                <ProFormDigit label="分批数量" min={1} fieldProps={{
                                                    onChange: (value) => {
                                                        task.taskConfig.BATCH.COUNT = value;
                                                        updateTask();
                                                    },
                                                    value: task.taskConfig.BATCH.COUNT,
                                                }} />
                                            </Col>
                                            {/* <Col span={24}>
                                                <Skeleton loading={loading} active>
                                                    {
                                                        !loading && <BatchParamTable
                                                            batchParams={task.taskConfig.BATCH.PARAMS}
                                                            handleUpdateBatchParams={handleUpdateBatchParams}
                                                            loading={loading}
                                                        />
                                                    }
                                                </Skeleton>
                                            </Col> */}
                                        </>
                                    }
                                </Row>
                            </>
                        }
                        {
                            // ---------------------------------------- API：从Webhook接收JSON ----------------------------------------
                            (task.taskType === WEBHOOK_GET_JSON) && <>
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
                                </Row>
                                <Row gutter={24}>
                                    {/* 字段前缀 */}
                                    <Col span={12}>
                                        <ProFormText
                                            rules={[
                                                {
                                                    required: false,
                                                    message: "请输入数据层级",
                                                }
                                            ]}
                                            name="fieldPrefix"
                                            label="数据在JSON中的前缀层级"
                                            placeholder="请输入数据层级"
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.FIELD_PREFIX = e.target.value;
                                                    updateTask();
                                                },
                                                value: task.taskConfig.FIELD_PREFIX,
                                            }}
                                        />
                                    </Col>
                                    <Col span={12}></Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出到流水线变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="原始的JSON"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.ORIGIN_JSON = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.ORIGIN_JSON || "ORIGIN_JSON",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="业务数据的JSON"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.DATA_JSON = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.DATA_JSON || "DATA_JSON",
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>
                        }
                        {
                            // ---------------------------------------- DATA: JSON转业务数据 ----------------------------------------
                            (task.taskType === JSON_TO_DATA) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="前置任务的输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="原始的JSON"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.ORIGIN_JSON = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.ORIGIN_JSON || "ORIGIN_JSON",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                    {/* JSON变量名 */}
                                                    <ProFormText
                                                        label="JSON"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入JSON的变量名！',
                                                            }
                                                        ]}
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.DATA_JSON = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.DATA_JSON || "DATA_JSON",
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </ProFormItem>
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
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出到流水线变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="业务数据"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.BIZ_DATA = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.BIZ_DATA || "BIZ_DATA",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="业务数据编号"
                                                        disabled
                                                        fieldProps={{
                                                            value: task.taskConfig.OUTPUT.DATA_CODE || "DATA_CODE",
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>
                        }
                        {
                            // ---------------------------------------- DATA: 过滤数据 ----------------------------------------
                            (task.taskType === FILTER_DATA) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="前置任务的输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    {/* 待过滤的数据 */}
                                                    <ProFormText
                                                        label="待过滤的数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入待过滤的数据变量名',
                                                            }
                                                        ]}
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    {/* 过滤条件 */}
                                    <Col span={24}>
                                        <ProFormItem
                                            label="过滤条件"
                                        >
                                            <Skeleton loading={loading} active>
                                                {
                                                    !loading && <DataFilterTable
                                                        dataFilters={task.taskConfig.DATA_FILTER}
                                                        dataFields={dataFields}
                                                        handleUpdateDataFilters={handleUpdateDataFilters}
                                                        loading={loading}
                                                    />
                                                }
                                            </Skeleton>

                                        </ProFormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出到流水线变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="有效业务数据"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.BIZ_DATA = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.BIZ_DATA || "BIZ_DATA",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="被过滤的无效数据"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.FILTER_BLOCKED_DATA = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.FILTER_BLOCKED_DATA || "FILTER_BLOCKED_DATA",
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>
                        }
                        {
                            // ---------------------------------------- 数仓：保存数据 ----------------------------------------
                            (task.taskType === SAVE_DATA && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="前置任务的输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    {/* 业务数据的变量名 */}
                                                    <ProFormText
                                                        label="业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入业务数据的变量名！',
                                                            }
                                                        ]}
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出到流水线变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="实际保存的数据"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.SAVED_DATA = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.SAVED_DATA || "SAVED_DATA",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>)
                        }
                        {
                            // ---------------------------------------- 数仓：查询数据 ----------------------------------------
                            (task.taskType === QUERY_DATA && <>
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
                                    {/* 查询条件 */}
                                    <Col span={24}>
                                        <ProFormItem
                                            label="查询条件"
                                        >
                                            {(dataFields && dataFields.length > 0) ?
                                                <Skeleton loading={loading} active>
                                                    {
                                                        !loading && <DataFilterTable
                                                            dataFilters={task.taskConfig.DATA_FILTER}
                                                            dataFields={dataFields}
                                                            handleUpdateDataFilters={handleUpdateDataFilters}
                                                            loading={loading}
                                                        />
                                                    }
                                                </Skeleton>
                                                : <Typography.Text type="secondary">请先选择数据</Typography.Text>
                                            }
                                        </ProFormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出到流水线变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="查询的业务数据"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.BIZ_DATA = e.target.value;
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.BIZ_DATA || "BIZ_DATA",
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="业务数据编号"
                                                        disabled
                                                        fieldProps={{
                                                            value: task.taskConfig.OUTPUT.DATA_CODE || "DATA_CODE",
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>)
                        }
                    </ProForm>
                </ProCard >
            }
        </>
    );
};

export default PipelineTaskForm;