import { appSelect } from "@/services/zhiwei/app";
import { ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Input, Radio, Row, Tabs, TabsProps } from "antd";
import ApiParamsTable, { ApiParamDataType } from "./ApiParamsTable";

export type ApiFormProp = {
    // 请求参数
    reqParams: ApiParamDataType[],
    setReqParams: (reqParams: ApiParamDataType[]) => void,
    // 请求Header
    reqHeaders: ApiParamDataType[],
    setReqHeaders: (reqParams: ApiParamDataType[]) => void,
    // 请求body类型
    reqBodyType: string,
    setReqBodyType: (reqParams: string) => void,
    // 请求body，form格式
    reqBodyForm: ApiParamDataType[],
    setReqBodyForm: (reqParams: ApiParamDataType[]) => void,
    // 请求body，raw格式
    reqBodyRaw: string,
    setReqBodyRaw: (reqParams: string) => void,
    // 响应示例
    respExample: string,
    setRespExample: (reqParams: string) => void,

    /** 初始默认应用id */
    appId?: number;
};

const ApiForm: React.FC<ApiFormProp> = (props) => {

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Params',
            children: (
                <ApiParamsTable
                    params={props.reqParams}
                    handleUpdateParams={props.setReqParams}
                />
            ),
        },
        {
            key: '2',
            label: 'Headers',
            children: (
                <ApiParamsTable
                    params={props.reqHeaders}
                    handleUpdateParams={props.setReqHeaders}
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
                        defaultValue={props.reqBodyType}
                        onChange={(e) => {
                            props.setReqBodyType(e.target.value);
                        }}
                    />
                    <br />
                    <br />
                    {
                        props.reqBodyType == "x-www-form-urlencoded" &&
                        <ApiParamsTable
                            params={props.reqBodyForm}
                            handleUpdateParams={props.setReqBodyForm}
                        />
                    }
                    {
                        props.reqBodyType == "json" &&
                        <Input.TextArea value={props.reqBodyRaw} style={{ height: 350 }} onChange={(e) => {
                            props.setReqBodyRaw(e.target.value);
                        }} />
                    }
                </>
            ),
        },
        {
            key: '4',
            label: '响应示例',
            children: (
                <Input.TextArea value={props.respExample} style={{ height: 400 }} onChange={(e) => {
                    props.setRespExample(e.target.value);
                }} />
            ),
        },
    ];

    return (
        <>
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
                        initialValue={props.appId && props.appId > 0 ? props.appId : null}
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
        </>
    )
};

export default ApiForm;