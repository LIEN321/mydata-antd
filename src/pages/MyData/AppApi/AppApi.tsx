import CRUD from "@/components/Gyrfalcon/CRUD";
import { appSelect } from "@/services/zhiwei/app";
import { deleteAppApi, deleteAppApis, appApiPage, saveAppApi } from "@/services/zhiwei/appApi";
import { ActionType, ProColumns, ProFormText, ProFormSelect, ProFormRadio, } from "@ant-design/pro-components";
import { Col, Input, Radio, Row, Tabs, TabsProps } from "antd";
import { useRef, useState } from "react";
import ApiParamsTable, { DataType } from "./ApiParamsTable";

const AppApi: React.FC = () => {

    // 请求参数
    const [reqParams, setReqParams] = useState<DataType[]>([]);
    // 请求Header
    const [reqHeaders, setReqHeaders] = useState<DataType[]>([]);
    // 请求body类型
    const [reqBodyType, setReqBodyType] = useState<string>("");
    // 请求body，form格式
    const [reqBodyForm, setReqBodyForm] = useState<DataType[]>([]);
    // 请求body，raw格式
    const [reqBodyRaw, setReqBodyRaw] = useState<string>("");
    // 响应示例
    const [respExample, setRespExample] = useState<string>("");

    // 表格列
    const columns: ProColumns<API.AppApiVO>[] = [
        {
            title: '所属应用',
            dataIndex: 'appId',
            search: true,
            request: appSelect,
            hideInTable: true,
        },
        {
            title: '所属应用',
            dataIndex: 'appName',
            search: false,
        },
        {
            title: 'API名称',
            dataIndex: 'apiName',
            search: true,
        },
        {
            title: 'API类型',
            dataIndex: 'opType',
            search: false,
            render: (_, record) => {
                const { opType } = record;
                return opType === 1 ? "提供数据" : "消费数据";
            }
        },
        {
            title: '请求方法',
            dataIndex: 'apiMethod',
            search: false,
        },
        {
            title: '接口路径',
            dataIndex: 'apiUri',
            search: false,
        },
    ];

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Params',
            children: (
                <ApiParamsTable
                    params={reqParams}
                    handleUpdateParams={setReqParams}
                />
            ),
        },
        {
            key: '2',
            label: 'Headers',
            children: (
                <ApiParamsTable
                    params={reqHeaders}
                    handleUpdateParams={setReqHeaders}
                />
            ),
        },
        {
            key: '3',
            label: 'Body',
            children: (
                <>
                    <Radio.Group
                        options={[
                            { label: "空", value: "" }
                            , { label: "x-www-form-urlencoded", value: "x-www-form-urlencoded" }
                            , { label: "json", value: "json" }
                        ]}
                        defaultValue={reqBodyType}
                        onChange={(e) => {
                            setReqBodyType(e.target.value);
                        }}
                    />
                    <br />
                    <br />
                    {
                        reqBodyType == "x-www-form-urlencoded" &&
                        <ApiParamsTable
                            params={reqBodyForm}
                            handleUpdateParams={setReqBodyForm}
                        />
                    }
                    {
                        reqBodyType == "json" &&
                        <Input.TextArea value={reqBodyRaw} style={{ height: 350 }} onChange={(e) => {
                            setReqBodyRaw(e.target.value);
                        }} />
                    }
                </>
            ),
        },
        {
            key: '4',
            label: '响应示例',
            children: (
                <Input.TextArea value={respExample} style={{ height: 400 }} onChange={(e) => {
                    setRespExample(e.target.value);
                }} />
            ),
        },
    ];

    const appApiForm = <>
        <Row gutter={24}>
            <Col span={6}>
                <ProFormSelect
                    rules={[
                        {
                            required: true,
                            message: "请输入所属应用",
                        }
                    ]}
                    name="appId"
                    label="所属应用"
                    placeholder="请输入所属应用"
                    request={appSelect}
                />
            </Col>
            <Col span={18}>
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入接口名称",
                        }
                    ]}
                    name="apiName"
                    label="API名称"
                    placeholder="请输入接口名称"
                />
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={6}>
                <ProFormSelect
                    rules={[
                        {
                            required: true,
                            message: "请选择请求方法",
                        }
                    ]}
                    name="apiMethod"
                    label="请求方法"
                    placeholder="请选择请求方法"
                    options={[
                        { label: 'GET', value: 'GET' }
                        , { label: 'POST', value: 'POST' }
                        , { label: 'PUT', value: 'PUT' }
                        , { label: 'DELETE', value: 'DELETE' }
                    ]}
                    initialValue={"GET"}
                />
            </Col>
            <Col span={18}>
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入接口路径",
                        }
                    ]}
                    name="apiUri"
                    label="接口路径"
                    placeholder="请输入接口路径"
                />
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={6}>
                <ProFormRadio.Group
                    rules={[
                        {
                            required: true,
                            message: "请选择API类型",
                        }
                    ]}
                    name="opType"
                    label="数据角色"
                    placeholder="请选择请求方法"
                    options={[
                        {
                            label: '提供者',
                            value: 1,
                        },
                        {
                            label: '消费者',
                            value: 2,
                        },
                    ]}
                    radioType="button"
                    initialValue={1}
                    fieldProps={{ block: true }}
                />
            </Col>
            <Col span={6}>
                <ProFormRadio.Group
                    rules={[
                        {
                            required: true,
                            message: "请选择数据类型",
                        }
                    ]}
                    name="dataType"
                    label="数据类型"
                    placeholder="请选择数据类型"
                    options={[
                        { label: 'JSON', value: 'JSON' }
                        , { label: '待扩展', value: '', disabled: true }
                    ]}
                    radioType="button"
                    initialValue={"JSON"}
                    fieldProps={{ block: true }}
                />
            </Col>
            <Col span={12}>
                <ProFormText
                    rules={[
                        {
                            required: false,
                            message: "请输入数据层级",
                        }
                    ]}
                    name="fieldPrefix"
                    label="数据层级"
                    placeholder="请输入数据层级"
                />
            </Col>
        </Row>
        <Tabs defaultActiveKey="1" items={tabItems} type="card" />
    </>;

    const tableRef = useRef<ActionType>();

    const handleOnClickEditBtn = (record: any) => {
        setReqParams(record.reqParams);
        setReqHeaders(record.reqHeaders);
        setReqBodyType(record.reqBodyType);
        setReqBodyRaw(record.reqBodyRaw);
        setRespExample(record.respExample);
    }

    const handleSaveAppApi = async (formData: any) => {
        const body = {
            ...formData
            , reqParams: reqParams
            , reqHeaders: reqHeaders
            , reqBodyType: reqBodyType
            , reqBodyForm: reqBodyForm
            , reqBodyRaw: reqBodyRaw
            , respExample: respExample
        };
        await saveAppApi(body);
    }

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="应用接口"
                columns={columns}

                formWidth={800}
                createForm={appApiForm}
                updateForm={appApiForm}

                handlePage={appApiPage}
                handleCreate={handleSaveAppApi}
                handleUpdate={handleSaveAppApi}
                handleDelete={deleteAppApi}
                handleBatchDelete={deleteAppApis}

                onClickEditBtn={handleOnClickEditBtn}
            />
        </>
    );
};

export default AppApi;