import { appSelect } from "@/services/zhiwei/app";
import { ProFormRadio, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Button, Col, Divider, Input, Radio, Row, Tabs, TabsProps } from "antd";
import ApiParamsTable, { ApiParamDataType } from "./ApiParamsTable";
import { useRef, useState } from "react";

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

    /** 编辑时的数据 */
    record?: API.AppApiVO;
};

const ApiForm: React.FC<ApiFormProp> = (props) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [opType, setOpType] = useState<number>(props.record?.opType || 1);

    const insertTextAtCursor = (text: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            // 确保 TypeScript 知道 textarea 是 HTMLTextAreaElement
            const { selectionStart, selectionEnd, value } = textarea;

            // 插入内容
            const newValue = value.slice(0, selectionStart) + text + value.slice(selectionEnd);

            textarea.value = newValue;
            props.setReqBodyRaw(newValue);

            // 更新光标位置
            const newCursorPosition = selectionStart + text.length;
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);

            // 手动触发 React 的 onChange
            // const event = new Event('input', { bubbles: true });
            // textarea.dispatchEvent(event);
        }
    };

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
                            , { label: "x-www-form-urlencoded", value: "form" }
                            , { label: "json", value: "json" }
                        ]}
                        defaultValue={props.reqBodyType}
                        onChange={(e) => {
                            props.setReqBodyType(e.target.value);
                        }}
                    />
                    <Divider type="vertical" />
                    {opType === 2 && props.reqBodyType === "json" &&
                        <Button type="link" title="插入业务数据占位符" onClick={() => {
                            insertTextAtCursor('${DATA_JSON}');
                        }}>
                            {'${DATA_JSON}'}
                        </Button>}
                    <br />
                    <br />
                    {
                        props.reqBodyType === "form" &&
                        <ApiParamsTable
                            params={props.reqBodyForm}
                            handleUpdateParams={props.setReqBodyForm}
                        />
                    }
                    {
                        props.reqBodyType === "json" &&
                        <Input.TextArea ref={(input) => {
                            if (input) {
                                textareaRef.current = input.resizableTextArea?.textArea || null;
                            }
                        }} value={props.reqBodyRaw} style={{ height: 350 }} onChange={(e) => {
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
                        fieldProps={{
                            block: true
                            , onChange: (e) => {
                                setOpType(e.target.value);
                            }
                        }}
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
                {
                    opType === 1 && <Col span={6}>
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
                }
                {
                    opType === 2 && <Col span={6}>
                        <ProFormRadio.Group
                            rules={[
                                {
                                    required: true,
                                    message: "请选择数据模式",
                                }
                            ]}
                            name="dataMode"
                            label="数据结构"
                            placeholder="请选择数据模式"
                            options={[
                                {
                                    label: '集合',
                                    value: 2,
                                },
                                {
                                    label: '单个',
                                    value: 1,
                                },
                            ]}
                            radioType="button"
                            initialValue={2}
                            fieldProps={{ block: true }}
                        />
                    </Col>
                }
            </Row>
            <Tabs defaultActiveKey="1" items={tabItems} type="card" />
        </>
    )
};

export default ApiForm;