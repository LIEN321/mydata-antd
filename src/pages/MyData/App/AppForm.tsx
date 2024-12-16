import { ProFormItem, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import ApiParamsTable, { ApiParamDataType } from "../AppApi/ApiParamsTable";
import { Col, Row } from "antd";

export type AppFormProp = {
    // 请求Header
    reqHeaders: ApiParamDataType[],
    setReqHeaders: (reqParams: ApiParamDataType[]) => void,
};

const AppForm: React.FC<AppFormProp> = (props) => {
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
                <Col span={24}>
                    <ProFormItem
                        label="全局Headers"
                    >
                        <ApiParamsTable
                            params={props.reqHeaders}
                            handleUpdateParams={props.setReqHeaders}
                        />
                    </ProFormItem>
                </Col>
            </Row>
        </>
    )
};

export default AppForm;