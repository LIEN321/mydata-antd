import CRUD from "@/components/Gyrfalcon/CRUD";
import { appSelect } from "@/services/zhiwei/app";
import { deleteAppApi, deleteAppApis, appApiPage, saveAppApi } from "@/services/zhiwei/appApi";
import { ActionType, ProColumns, ProFormText, ProFormSelect, ProFormRadio, } from "@ant-design/pro-components";
import { Col, Input, Radio, Row, Tabs, TabsProps } from "antd";
import { useRef, useState } from "react";
import ApiParamsTable, { ApiParamDataType } from "./ApiParamsTable";
import ApiForm from "./ApiForm";

const AppApi: React.FC = () => {

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

    // 编辑时的数据
    const [record, setRecord] = useState<API.AppApiVO>({});

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

    const appApiForm = <ApiForm
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
        record={record}
    />;

    const tableRef = useRef<ActionType>();

    const handleOnClickEditBtn = (record: any) => {
        setRecord(record);
        setReqParams(record.reqParams);
        setReqHeaders(record.reqHeaders);
        setReqBodyType(record.reqBodyType);
        setReqBodyForm(record.reqBodyForm);
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