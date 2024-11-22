import { ModalForm } from "@ant-design/pro-components";
import AppForm from "../../App/AppForm";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { saveApp } from "@/services/zhiwei/app";
import { saveAppApi } from "@/services/zhiwei/appApi";
import ApiForm from "../../AppApi/ApiForm";
import { useState } from "react";
import { ApiParamDataType } from "../../AppApi/ApiParamsTable";

export type AddApiProp = {
    /** 所属应用id */
    appId: number;
    /** 新建应用完成后的操作 */
    onSuccess?: (newAppId: number) => void;
};

const AddApi: React.FC<AddApiProp> = (props) => {
    // 请求参数
    const [reqParams, setReqParams] = useState<ApiParamDataType[]>([]);
    // 请求Header
    const [reqHeaders, setReqHeaders] = useState<ApiParamDataType[]>([]);
    // 请求body类型
    const [reqBodyType, setReqBodyType] = useState<string>("");
    // 请求body，form格式
    const [reqBodyForm, setReqBodyForm] = useState<ApiParamDataType[]>([]);
    // 请求body，raw格式
    const [reqBodyRaw, setReqBodyRaw] = useState<string>("");
    // 响应示例
    const [respExample, setRespExample] = useState<string>("");

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
        const response = await saveAppApi(body);
        if (response.success) {
            if (props.onSuccess && response.data) {
                await props.onSuccess(response.data);
            }
            return true;
        }
        return false;
    }

    return (
        <>
            <ModalForm
                title={'新建API'}
                width={800}
                trigger={<Button icon={<PlusOutlined />} disabled={props.appId <= 0} title={props.appId <= 0 ? "请先选择应用" : "新建API"} />}
                onFinish={handleSaveAppApi}
                clearOnDestroy
                modalProps={{ destroyOnClose: true }}
            >
                <ApiForm
                    appId={props.appId}
                    reqParams={reqParams}
                    setReqParams={setReqParams}
                    reqHeaders={reqHeaders}
                    setReqHeaders={setReqHeaders}
                    reqBodyType={reqBodyType}
                    setReqBodyType={setReqBodyType}
                    reqBodyForm={reqBodyForm}
                    setReqBodyForm={setReqBodyForm}
                    reqBodyRaw={reqBodyRaw}
                    setReqBodyRaw={setReqBodyRaw}
                    respExample={respExample}
                    setRespExample={setRespExample}
                />
            </ModalForm>
        </>
    );
};

export default AddApi;