import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteApp, deleteApps, appPage, saveApp } from "@/services/zhiwei/app";
import { ActionType, ProColumns, ProFormText, ProFormTextArea, } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef } from "react";
import AppForm from "./AppForm";

const App: React.FC = () => {

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
                if (appUrl && appUrl != "") {
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

    const appForm = <AppForm />;

    const tableRef = useRef<ActionType>();

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="应用"
                columns={columns}

                formWidth={400}
                createForm={appForm}
                updateForm={appForm}

                handlePage={appPage}
                handleCreate={saveApp}
                handleUpdate={saveApp}
                handleDelete={deleteApp}
                handleBatchDelete={deleteApps}
            />
        </>
    );
};

export default App;