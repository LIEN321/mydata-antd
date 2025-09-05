import { ProFormItem, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import ApiParamsTable, { ApiParamDataType } from "../AppApi/ApiParamsTable";
import { Col, Input, Radio, Row, Select, Splitter, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { authApiSelect } from "@/services/zhiwei/appApi";

export type AppFormProp = {
    appId?: number,
    // 请求Header
    reqHeaders: ApiParamDataType[],
    setReqHeaders: (reqParams: ApiParamDataType[]) => void,
    // 认证类型
    authType: string,
    setAuthType: (authType: string) => void,
    // 认证配置
    authConfig: any,
    setAuthConfig: (authConfig: any) => void,
};

const AppForm: React.FC<AppFormProp> = (props) => {

    const [apiList, setApiList] = useState<API.SelectVO[]>([]);

    useEffect(() => {
        authApiSelect({ appId: props.appId }).then((apiList) => {
            setApiList(apiList);
        });
    }, []);

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Headers',
            children: (
                <ApiParamsTable
                    params={props.reqHeaders}
                    handleUpdateParams={props.setReqHeaders}
                />
            ),
        },
        {
            key: '2',
            label: '认证配置',
            children: (
                <Splitter>
                    {/* 认证类型 */}
                    <Splitter.Panel defaultSize="40%" resizable={false}>
                        认证类型：<Select
                            style={{ width: 200 }}
                            options={[
                                { label: 'No Auth', value: '' },
                                { label: 'Cookie', value: 'cookie' },
                                { label: 'API Key', value: 'api_key' },
                            ]}
                            defaultValue={props.authType}
                            onChange={props.setAuthType}
                        />
                    </Splitter.Panel>
                    <Splitter.Panel>
                        <Row>
                            <Col span={1}></Col>
                            <Col span={22}>
                                {/* cookie */}
                                {props.authType === 'cookie' && <>
                                    选择API：<Select
                                        style={{ width: 200 }}
                                        options={apiList}
                                        defaultValue={props.authConfig.api}
                                        onChange={(value) => {
                                            props.setAuthConfig({ 'api': value })
                                        }}
                                    />
                                </>}
                                {/* api key */}
                                {props.authType === 'api_key' && <>
                                    <Row gutter={[24, 24]}>
                                        <Col span={4} style={{ textAlign: "right" }}>Key:</Col>
                                        <Col span={20}><Input defaultValue="Authorization" /></Col>
                                        <Col span={4} style={{ textAlign: "right" }}>Value:</Col>
                                        <Col span={20}><Input /></Col>
                                        <Col span={4} style={{ textAlign: "right" }}>Add to:</Col>
                                        <Col span={20}><Radio.Group
                                            optionType="button"
                                            options={[
                                                { label: "Header", value: "header" }
                                                , { label: "query", value: "query" }
                                            ]}
                                            defaultValue='header'
                                            onChange={(e) => {

                                            }}
                                        /></Col>
                                    </Row>
                                </>}
                            </Col>
                        </Row>
                    </Splitter.Panel>
                </Splitter>
            ),
        },
    ];

    return (
        <>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText
                        rules={[
                            {
                                required: true,
                                message: "请输入应用编号",
                            }
                        ]}
                        name="appCode"
                        label="应用编号"
                        placeholder="请输入应用编号"
                    />
                </Col>
                <Col span={12}>
                    <ProFormText
                        rules={[
                            {
                                required: true,
                                message: "请输入应用名称",
                            }
                        ]}
                        name="appName"
                        label="应用名称"
                        placeholder="请输入应用名称"
                    /></Col>
                <Col span={12}>
                    <ProFormText
                        rules={[
                            {
                                required: false,
                                message: "请输入访问地址",
                            }
                        ]}
                        name="appUrl"
                        label="访问地址"
                        placeholder="请输入访问地址"
                    />
                </Col>
                <Col span={12}>
                    <ProFormText
                        rules={[
                            {
                                required: false,
                                message: "请输入接口前缀地址",
                            }
                        ]}
                        name="apiPrefix"
                        label="接口前缀地址"
                        placeholder="请输入接口前缀地址"
                    />
                </Col>
                <Col span={24}>
                    <ProFormTextArea
                        rules={[
                            {
                                required: false,
                                message: "请输入应用描述",
                            }
                        ]}
                        name="appDesc"
                        label="应用描述"
                        placeholder="请输入应用描述"
                    />
                </Col>
                {/* <Col span={24}>
                    <ProFormItem
                        label="全局Headers"
                    >
                        <ApiParamsTable
                            params={props.reqHeaders}
                            handleUpdateParams={props.setReqHeaders}
                        />
                    </ProFormItem>
                </Col> */}
            </Row>
            <Tabs defaultActiveKey="1" items={tabItems} type="card" />
        </>
    )
};

export default AppForm;