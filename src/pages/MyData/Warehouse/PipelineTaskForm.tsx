import { ProCard, ProForm, ProFormDigit, ProFormItem, ProFormRadio, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, Skeleton, Switch, Typography } from "antd";
import { API_GET_JSON, API_SEND_DATA, DATA_TO_JSON, FILTER_DATA, JSON_TO_DATA, JSON_TO_VAR, PROCESS_DATA, QUERY_DATA, SAVE_DATA, SEND_EMAIL, STOP_PIPELINE, TRIGGER_PIPELINE, REMOVE_DATA, WEBHOOK_GET_JSON, WRITE_EXCEL, SET_PIPELINE_VAR, SCRIPT_JS } from "../mydata";
import { useEffect, useState } from "react";
import { TaskItem } from "./PipelineTask";
import { appSelect } from "@/services/zhiwei/app";
import { apiSelect } from "@/services/zhiwei/appApi";
import { dataSelect, fieldList } from "@/services/zhiwei/data";
import AddApp from "./components/AddApp";
import AddApi from "./components/AddApi";
import FieldMappingTable, { FieldMappingDataType } from "./components/task_components/FieldMappingTable";
import BatchParamTable, { BatchParamDataType } from "./components/task_components/BatchParamTable";
import DataFilterTable, { DataFilterDataType } from "./components/task_components/DataFilterTable";
import DataProcessTable, { DataProcessDataType } from "./components/task_components/DataProcessTable";
import { pipelineSelect } from "@/services/zhiwei/pipeline";
import VarMapppingTable, { VarMappingDataType } from "./components/task_components/VarMapppingTable";
import PipelineStopConditionTable, { ConditionType } from "./components/task_components/PipelineStopConditionTable";
import JsonVarMapppingTable, { JsonVarMappingDataType } from "./components/task_components/JsonVarMapppingTable";

const { Text } = Typography;

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

    // 所选标准数据的字段
    const [dataFields, setDataFields] = useState<API.DataFieldVO[]>([]);
    // 字段映射 相关对象
    const [fieldMappings, setFieldMappings] = useState<FieldMappingDataType[]>([]);

    /** 加载状态 */
    const [loading, setLoading] = useState<boolean>(false);

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
                // 用户配置的标识字段
                const idFields = task.taskConfig.ID_FIELD || [];
                if (fieldMapping) {
                    fieldMappings.map(m => {
                        m.apiField = fieldMapping[m.fieldCode] || "";
                        if (idFields.length > 0) {
                            m.isId = idFields.indexOf(m.fieldCode) >= 0;
                        }
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

    // 当 task 变化时，更新表单内容
    useEffect(() => {
        form.resetFields();
        setDataFields(() => []);
        setFieldMappings(() => []);

        if (task) {
            form.setFieldsValue(task);
        }
        loadDataFields(task.dataId || null);
    }, [task]);

    const handleUpdateFieldMappings = (fieldMappings: FieldMappingDataType[]) => {
        setFieldMappings(fieldMappings);
        const fieldMapping = {} as any;
        const idFileds: any[] = [];

        fieldMappings.map(m => {
            // 提取 数据字段-接口字段 的映射关系
            fieldMapping[m.fieldCode] = m.apiField;
            // 设置标识字段
            if (m.isId === true) {
                idFileds.push(m.fieldCode);
            }
        });
        // 映射关系写入taskConfig.FIELD_MAPPING
        task.taskConfig.FIELD_MAPPING = fieldMapping;
        // 更新标识字段列表
        task.taskConfig.ID_FIELD = idFileds;

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

    const handleUpdateDataProcesses = (dataProcesses: DataProcessDataType[]) => {
        task.taskConfig.DATA_PROCESS = dataProcesses;
        updateTask();
    };

    const handleUpdateJsonVarMappings = (varMappings: JsonVarMappingDataType[]) => {
        task.taskConfig.VAR_MAPPING = varMappings;
        updateTask();
    };

    const handleUpdateVarMappings = (varMappings: VarMappingDataType[]) => {
        task.taskConfig.VAR_MAPPING = varMappings;
        updateTask();
    };

    const handleUpdateStopConditions = (stopConditions: ConditionType[]) => {
        task.taskConfig.STOP_CONDITION = stopConditions;
        updateTask();
    };

    return (
        <>
            {task &&
                <ProCard style={{ overflowY: "auto" }}>
                    <ProForm
                        form={form}
                        submitter={false}
                        initialValues={task}
                        clearOnDestroy
                    >
                        <Row gutter={24}>
                            {/* 任务名称 */}
                            <Col span={12}>
                                <ProFormText
                                    name="taskName"
                                    label="任务名称"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入任务名称！',
                                        }
                                    ]}
                                    fieldProps={{
                                        onChange: (e) => {
                                            task.taskName = e.target.value.trim();
                                            updateTask();
                                        }
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <ProFormItem
                                    label="任务类型">
                                    {task.typeName}
                                </ProFormItem>
                            </Col>
                        </Row>


                        {/* ######################################## API接口 ######################################## */}
                        {
                            // ---------------------------------------- 调用API获取JSON ----------------------------------------
                            (task.taskType === API_GET_JSON) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="作为参数的业务数据"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.PARAM_DATA = e.target.value.trim();
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.PARAM_DATA || "",
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
                                            <Col span={10}></Col>
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
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="获取的JSON"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.PIPELINE_JSON = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.PIPELINE_JSON) {
                                                                    task.taskConfig.OUTPUT.PIPELINE_JSON = "PIPELINE_JSON";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: (task.taskConfig.OUTPUT.PIPELINE_JSON) || "PIPELINE_JSON",
                                                            allowClear: false,
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
                            // ---------------------------------------- 调用API发送数据 ----------------------------------------
                            (task.taskType === API_SEND_DATA) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    {/* 业务数据变量 */}
                                                    <ProFormText
                                                        label="待发送的业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入业务数据变量名！',
                                                            }
                                                        ]}
                                                        name="input"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.INPUT.BIZ_DATA) {
                                                                    task.taskConfig.INPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
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
                                    {/* 字段映射 */}
                                    <Col span={24}>
                                        <ProFormItem
                                            label="字段映射"
                                        >
                                            {fieldMappings && fieldMappings.length > 0 &&
                                                <Skeleton loading={loading} active>
                                                    {
                                                        !loading && <FieldMappingTable
                                                            fieldMappings={fieldMappings}
                                                            handleUpdateFieldMappings={handleUpdateFieldMappings}
                                                            loading={loading}
                                                        />
                                                    }
                                                </Skeleton>
                                            }
                                            {
                                                (!fieldMappings || fieldMappings.length == 0) &&
                                                <Typography.Text type="danger">前置任务未配置业务数据，请先添加数据配置，再重新添加本任务</Typography.Text>
                                            }
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
                                        </>
                                    }
                                </Row>
                            </>
                        }


                        {/* ######################################## Webhook ######################################## */}
                        {
                            // ---------------------------------------- 从Webhook接收JSON ----------------------------------------
                            (task.taskType === WEBHOOK_GET_JSON) && <>
                                <Row gutter={24}>
                                    {/* 选择应用 */}
                                    <Col span={12}>
                                        <ProFormSelect
                                            name="appId"
                                            label="选择应用"
                                            rules={[
                                                {
                                                    required: false,
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
                                            help="格式为a.b.c，空则表示在json根目录；"
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.FIELD_PREFIX = e.target.value.trim();
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
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="获取的JSON"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.PIPELINE_JSON = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.PIPELINE_JSON) {
                                                                    task.taskConfig.OUTPUT.PIPELINE_JSON = "PIPELINE_JSON";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.PIPELINE_JSON || "PIPELINE_JSON",
                                                            allowClear: false,
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={10}>
                                                </Col>
                                            </Row>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>
                        }


                        {/* ######################################## 数据处理 ######################################## */}
                        {
                            // ---------------------------------------- JSON转业务数据 ----------------------------------------
                            (task.taskType === JSON_TO_DATA) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="获取的JSON"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="input"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.PIPELINE_JSON = e.target.value.trim();
                                                                if (!task.taskConfig.INPUT.PIPELINE_JSON) {
                                                                    task.taskConfig.INPUT.PIPELINE_JSON = "PIPELINE_JSON";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.PIPELINE_JSON || "PIPELINE_JSON",
                                                            allowClear: false,
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
                                                        enableSwtichIdField={true}
                                                    />
                                                }
                                            </Skeleton>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.BIZ_DATA) {
                                                                    task.taskConfig.OUTPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
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
                            </>
                        }
                        {
                            // ---------------------------------------- 数据转JSON ----------------------------------------
                            (task.taskType === DATA_TO_JSON) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="input"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.INPUT.BIZ_DATA) {
                                                                    task.taskConfig.INPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
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
                                    {/* JSON模板 */}
                                    <Col span={24}>
                                        <ProFormTextArea
                                            label="JSON模板"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择数据！',
                                                }
                                            ]}
                                            name="json_template"
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.JSON_TEMPLATE = e.target.value;
                                                    updateTask();
                                                },
                                                value: task.taskConfig.JSON_TEMPLATE || "${DATA_JSON}",
                                                style: { height: 200 }
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="数据JSON"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入JSON的变量名！',
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.PIPELINE_JSON = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.PIPELINE_JSON) {
                                                                    task.taskConfig.OUTPUT.PIPELINE_JSON = "PIPELINE_JSON";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.PIPELINE_JSON || "PIPELINE_JSON",
                                                            allowClear: false,
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
                            </>
                        }
                        {
                            // ---------------------------------------- 过滤数据 ----------------------------------------
                            (task.taskType === FILTER_DATA) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
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
                                                        name="input"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.INPUT.BIZ_DATA) {
                                                                    task.taskConfig.INPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="作为参数的业务数据"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.PARAM_DATA = e.target.value.trim();
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.PARAM_DATA || "",
                                                        }}
                                                    />
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
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="有效的业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.BIZ_DATA) {
                                                                    task.taskConfig.OUTPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="被过滤的无效数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="filterdData"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.FILTER_BLOCKED_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.FILTER_BLOCKED_DATA) {
                                                                    task.taskConfig.OUTPUT.FILTER_BLOCKED_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.FILTER_BLOCKED_DATA || "FILTER_BLOCKED_DATA",
                                                            allowClear: false,
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
                            // ---------------------------------------- 处理数据 ----------------------------------------
                            (task.taskType === PROCESS_DATA) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    {/* 待处理的数据 */}
                                                    <ProFormText
                                                        label="待处理的数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入待处理的数据变量名',
                                                            }
                                                        ]}
                                                        name="input"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.INPUT.BIZ_DATA) {
                                                                    task.taskConfig.INPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
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
                                    {/* 处理数据 */}
                                    <Col span={24}>
                                        <ProFormItem
                                            label="处理数据"
                                        >
                                            <Skeleton loading={loading} active>
                                                {
                                                    !loading && <DataProcessTable
                                                        dataProcesses={task.taskConfig.DATA_PROCESS}
                                                        dataFields={dataFields}
                                                        handleUpdateDataProcesses={handleUpdateDataProcesses}
                                                        loading={loading}
                                                    />
                                                }
                                            </Skeleton>

                                        </ProFormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="处理后的业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.BIZ_DATA) {
                                                                    task.taskConfig.OUTPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.BIZ_DATA || "BIZ_DATA",
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
                            </>
                        }
                        {
                            // ---------------------------------------- 写入Excel ----------------------------------------
                            (task.taskType === WRITE_EXCEL) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    {/* 业务数据 */}
                                                    <ProFormText
                                                        label="业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入业务数据的变量名！',
                                                            }
                                                        ]}
                                                        name="input"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.INPUT.BIZ_DATA) {
                                                                    task.taskConfig.INPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
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
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="Excel文件"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.EXCEL_FILE = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.EXCEL_FILE) {
                                                                    task.taskConfig.OUTPUT.EXCEL_FILE = "EXCEL_FILE";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.EXCEL_FILE || "EXCEL_FILE",
                                                            allowClear: false,
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
                            </>
                        }


                        {/* ######################################## 数据仓库 ######################################## */}
                        {
                            // ---------------------------------------- 保存数据 ----------------------------------------
                            (task.taskType === SAVE_DATA && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
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
                                                        name="input"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.INPUT.BIZ_DATA) {
                                                                    task.taskConfig.INPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
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
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="实际保存的数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.SAVED_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.SAVED_DATA) {
                                                                    task.taskConfig.OUTPUT.SAVED_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.SAVED_DATA || "SAVED_DATA",
                                                            allowClear: false,
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
                            // ---------------------------------------- 查询数据 ----------------------------------------
                            (task.taskType === QUERY_DATA && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="作为参数的业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入业务数据变量名',
                                                            }
                                                        ]}
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.PARAM_DATA = e.target.value.trim();
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.PARAM_DATA || "",
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
                                            label="配置查询条件"
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
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <ProFormTextArea
                                            label="自定义查询条件"
                                            rules={[
                                                {
                                                    required: false,
                                                }
                                            ]}
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.CONDITION = e.target.value.trim();
                                                    updateTask();
                                                },
                                                value: task.taskConfig.CONDITION || "",
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输出变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="查询的业务数据"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="output"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.OUTPUT.BIZ_DATA = e.target.value.trim();
                                                                if (!task.taskConfig.OUTPUT.BIZ_DATA) {
                                                                    task.taskConfig.OUTPUT.BIZ_DATA = "BIZ_DATA";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.OUTPUT.BIZ_DATA || "BIZ_DATA",
                                                            allowClear: false,
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
                            // ---------------------------------------- 删除数据 ----------------------------------------
                            (task.taskType === REMOVE_DATA && <>
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
                                    <Col span={24}>
                                        <ProFormTextArea
                                            label="自定义过滤条件（若空 则会删除全部数据）"
                                            rules={[
                                                {
                                                    required: false,
                                                }
                                            ]}
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.CONDITION = e.target.value.trim();
                                                    updateTask();
                                                },
                                                value: task.taskConfig.CONDITION || "",
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </>)
                        }


                        {/* ######################################## 邮件 ######################################## */}
                        {
                            // ---------------------------------------- 发送邮件 ----------------------------------------
                            (task.taskType === SEND_EMAIL && <>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <ProFormText
                                            label="收件邮箱"
                                            rules={[
                                                {
                                                    required: true,
                                                }
                                            ]}
                                            name="address"
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.EMAIL.ADDRESS = e.target.value.trim();
                                                    updateTask();
                                                },
                                                value: task.taskConfig.EMAIL.ADDRESS || "",
                                                allowClear: false,
                                            }}
                                        />
                                    </Col>
                                    <Col span={12}></Col>

                                    <Col span={12}>
                                        <ProFormText
                                            label="邮件主题"
                                            rules={[
                                                {
                                                    required: true,
                                                }
                                            ]}
                                            name="subject"
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.EMAIL.SUBJECT = e.target.value.trimStart();
                                                    updateTask();
                                                },
                                                value: task.taskConfig.EMAIL.SUBJECT || "",
                                            }}
                                        />
                                    </Col>
                                    <Col span={12}></Col>

                                    <Col span={24}>
                                        <ProFormTextArea
                                            label="邮件内容"
                                            rules={[
                                                {
                                                    required: true,
                                                }
                                            ]}
                                            name="content"
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.EMAIL.CONTENT = e.target.value;
                                                    updateTask();
                                                },
                                                value: task.taskConfig.EMAIL.CONTENT || "",
                                            }}
                                        />
                                    </Col>

                                    <Col span={12}>
                                        <ProFormText
                                            label="附件文件（变量名）"
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.EMAIL.FILE = e.target.value.trim();
                                                    task.taskConfig.INPUT.FILE = e.target.value.trim();
                                                    updateTask();
                                                },
                                                value: task.taskConfig.EMAIL.FILE || "",
                                            }}
                                        />
                                    </Col>
                                    <Col span={12}></Col>
                                </Row>
                            </>)
                        }


                        {/* ######################################## 流水线 ######################################## */}
                        {
                            // ---------------------------------------- 触发流水线 ----------------------------------------
                            (task.taskType === TRIGGER_PIPELINE) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="推送的数据JSON"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '请输入JSON的变量名！',
                                                            }
                                                        ]}
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.PIPELINE_JSON = e.target.value.trim();
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.PIPELINE_JSON || "",
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
                                    <Col span={12}>
                                        <ProFormSelect
                                            label="选择流水线"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择流水线！',
                                                }
                                            ]}
                                            name="pipelineId"
                                            width={"sm"}
                                            request={(params) => {
                                                params.projectId = props.projectId;
                                                return pipelineSelect(params);
                                            }}
                                            onChange={(pipelineId: number, option: any) => {
                                                task.taskConfig.PIPELINE_ID = pipelineId;
                                                if (option)
                                                    task.taskConfig.OUTPUT.PIPELINE = option.title;
                                                else {
                                                    task.taskConfig.OUTPUT.PIPELINE = null;
                                                }
                                                updateTask();
                                            }}
                                            fieldProps={{
                                                value: task.taskConfig.PIPELINE_ID,
                                            }}
                                            showSearch
                                        />

                                    </Col>
                                    <Col span={12}>
                                        <ProFormSwitch
                                            label="同步执行"
                                            fieldProps={{
                                                onChange: (checked) => {
                                                    task.taskConfig.SYNC = checked;
                                                    updateTask();
                                                },
                                                value: task.taskConfig.SYNC != null ? task.taskConfig.SYNC : true,
                                            }}
                                            extra={<>
                                                <p>同步模式：等待流水线执行完 再往下执行；</p>
                                                <p>非同步模式：即异步，触发流水线后 立即往下执行；</p>
                                            </>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </>
                        }
                        {
                            // ---------------------------------------- 停止流水线 ----------------------------------------
                            (task.taskType === STOP_PIPELINE) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem
                                            label="停止条件"
                                        >
                                            <Skeleton loading={loading} active>
                                                {
                                                    !loading && <PipelineStopConditionTable
                                                        stopConditions={task.taskConfig.STOP_CONDITION}
                                                        dataFields={dataFields}
                                                        handleUpdateStopConditions={handleUpdateStopConditions}
                                                        loading={loading}
                                                    />
                                                }
                                            </Skeleton>
                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>
                        }


                        {/* ######################################## 参数变量 ######################################## */}
                        {
                            // ---------------------------------------- JSON值存入变量 ----------------------------------------
                            (task.taskType === JSON_TO_VAR) && <>
                                <Row>
                                    <Col span={24}>
                                        <ProFormItem label="输入变量" >
                                            <Row gutter={24}>
                                                <Col span={2}></Col>
                                                <Col span={10}>
                                                    <ProFormText
                                                        label="JSON"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            }
                                                        ]}
                                                        name="input"
                                                        fieldProps={{
                                                            onChange: (e) => {
                                                                task.taskConfig.INPUT.PIPELINE_JSON = e.target.value.trim();

                                                                if (!task.taskConfig.INPUT.PIPELINE_JSON) {
                                                                    task.taskConfig.INPUT.PIPELINE_JSON = "PIPELINE_JSON";
                                                                }
                                                                updateTask();
                                                            },
                                                            value: task.taskConfig.INPUT.PIPELINE_JSON || "PIPELINE_JSON",
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
                                    <Col span={24}>
                                        <ProFormItem
                                            label="变量配置"
                                        >
                                            <Skeleton loading={loading} active>
                                                {
                                                    !loading && <JsonVarMapppingTable
                                                        jsonVarMappings={task.taskConfig.VAR_MAPPING}
                                                        handleUpdateJsonVarMappings={handleUpdateJsonVarMappings}
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
                            // ---------------------------------------- 设置流水线变量 ----------------------------------------
                            (task.taskType === SET_PIPELINE_VAR) && <>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <ProFormItem
                                            label="变量配置"
                                        >
                                            <Skeleton loading={loading} active>
                                                {
                                                    !loading && <VarMapppingTable
                                                        varMappings={task.taskConfig.VAR_MAPPING}
                                                        handleUpdateVarMappings={handleUpdateVarMappings}
                                                        loading={loading}
                                                    />
                                                }
                                            </Skeleton>

                                        </ProFormItem>
                                    </Col>
                                </Row>
                            </>
                        }


                        {/* ######################################## 脚本 ######################################## */}
                        {
                            // ---------------------------------------- JS脚本 ----------------------------------------
                            (task.taskType === SCRIPT_JS) && <>
                                <Row gutter={24}>
                                    <Col span={16}>
                                        <ProFormTextArea
                                            label="JS脚本"
                                            rules={[
                                                {
                                                    required: false,
                                                }
                                            ]}
                                            fieldProps={{
                                                onChange: (e) => {
                                                    task.taskConfig.SCRIPT = e.target.value;
                                                    updateTask();
                                                },
                                                value: task.taskConfig.SCRIPT || "",
                                                style: { height: 500 }
                                            }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Text>脚本说明：</Text>
                                        <div>
                                            基于GraalJs引擎实现，支持ES6；<br />
                                            1. 变量context：操作上下文数据；<br />
                                            2. 获取数据：context.get("k");<br />
                                            3. 写入数据：context.put("k",v);<br />
                                            * 涉及安全，其他操作待扩展...<br/>
                                            <br />
                                            <Text type="danger">注：脚本运行时长限制在5秒内！！！</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        }


                        {/* 通用配置 */}
                        <ProFormItem label="异常处理" >
                            <Row gutter={24}>
                                <Col span={2}></Col>
                                <Col span={4}>
                                    <ProFormDigit
                                        label="重试次数"
                                        name="retry"
                                        min={0}
                                        max={10}
                                        tooltip="任务执行异常时，重新执行的次数，默认0不重试"
                                        fieldProps={{
                                            onChange: (value) => {
                                                if (value) {
                                                    task.retry = value;
                                                }
                                            },
                                        }}
                                    />
                                </Col>
                                <Col span={2}></Col>
                                <Col span={10}>
                                    <ProFormRadio.Group
                                        label="失败后是否继续运行"
                                        rules={[{ required: true, message: "请选择" }]}
                                        name="preCondition"
                                        radioType="button"
                                        options={[
                                            { label: "是", value: 0 }
                                            , { label: "否", value: 1 }
                                        ]}
                                        initialValue={1}
                                        fieldProps={{
                                            buttonStyle: "solid",
                                            onChange: (e) => {
                                                task.preCondition = e.target.value;
                                                updateTask();
                                            },
                                        }}
                                    />
                                </Col>
                            </Row>
                        </ProFormItem>
                    </ProForm>
                </ProCard >
            }
        </>
    );
};

export default PipelineTaskForm;