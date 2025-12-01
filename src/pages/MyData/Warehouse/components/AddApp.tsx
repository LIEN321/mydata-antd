import { ModalForm } from "@ant-design/pro-components";
import AppForm from "../../App/AppForm";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { saveApp } from "@/services/zhiwei/app";
import { useState } from "react";
import { ApiParamDataType } from "../../AppApi/ApiParamsTable";

export type AddAppProp = {
    /** 新建应用完成后的操作 */
    onSuccess?: (newAppId: number) => void;
};

const AddApp: React.FC<AddAppProp> = (props) => {
    // 请求Header
    const [reqHeaders, setReqHeaders] = useState<ApiParamDataType[]>([]);
    // 认证类型
    const [authType, setAuthType] = useState<string>('');
    // 认证配置
    const [authConfig, setAuthConfig] = useState<any>({});
    // 响应配置
    const [respConfig, setRespConfig] = useState<Record<string, any>>({ isValidCode: true, codeValue: 200 });

    return (
        <>
            <ModalForm
                title={'新建应用'}
                width={800}
                trigger={<Button icon={<PlusOutlined />} title="新建应用" />}
                onFinish={async (value) => {
                    const body = {
                        ...value
                        , reqHeaders: reqHeaders
                        , authType
                        , authConfig
                        , respConfig
                    };
                    const response = await saveApp(body);
                    if (response.success) {
                        if (props.onSuccess && response.data) {
                            await props.onSuccess(response.data);
                        }
                        return true;
                    }
                    return false;
                }}
            >
                <AppForm
                    reqHeaders={reqHeaders}
                    setReqHeaders={setReqHeaders}
                    authType={authType}
                    setAuthType={setAuthType}
                    authConfig={authConfig}
                    setAuthConfig={setAuthConfig}
                    respConfig={respConfig}
                    setRespConfig={setRespConfig}
                />
            </ModalForm>
        </>
    );
};

export default AddApp;