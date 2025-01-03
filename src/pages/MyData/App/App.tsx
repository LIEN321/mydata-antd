import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteApp, deleteApps, appPage, saveApp } from "@/services/zhiwei/app";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef, useState } from "react";
import AppForm from "./AppForm";
import { ApiParamDataType } from "../AppApi/ApiParamsTable";

const App: React.FC = () => {
    // 请求Header
    const [reqHeaders, setReqHeaders] = useState<ApiParamDataType[]>([]);

    // 表格列
    const columns: ProColumns<API.AppVO>[] = [
        {
            title: '应用编号',
            dataIndex: 'appCode',
            search: true,
        },
        {
            title: '应用名称',
            dataIndex: 'appName',
            search: true,
        },
        {
            title: '访问地址',
            dataIndex: 'appUrl',
            search: true,
            render: (_, record) => {
                const { appUrl } = record;
                if (appUrl && appUrl !== "") {
                    return <Button type="link" href={appUrl} target="_blank">{appUrl}</Button>
                }
                return "-";
            },
        },
        {
            title: '接口前缀地址',
            dataIndex: 'apiPrefix',
            search: false,
        },
        {
            title: 'API管理',
            dataIndex: 'apiCount',
            search: false,
        },
    ];

    const appForm = <AppForm
        reqHeaders={reqHeaders}
        setReqHeaders={setReqHeaders}
    />;

    const tableRef = useRef<ActionType>();

    const handleOnClickEditBtn = (record: any) => {
        setReqHeaders(record.reqHeaders);
    }

    const handleSaveAppApi = async (formData: any) => {
        const body = {
            ...formData
            , reqHeaders: reqHeaders
        };
        await saveApp(body);
    }

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="应用"
                columns={columns}

                formWidth={800}
                createForm={appForm}
                updateForm={appForm}

                handlePage={appPage}
                handleCreate={handleSaveAppApi}
                handleUpdate={handleSaveAppApi}
                handleDelete={deleteApp}
                handleBatchDelete={deleteApps}

                onClickEditBtn={handleOnClickEditBtn}
            />
        </>
    );
};

export default App;