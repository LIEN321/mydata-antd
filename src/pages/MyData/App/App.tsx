import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteApp, deleteApps, appPage, saveApp } from "@/services/zhiwei/app";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Drawer } from "antd";
import { useRef, useState } from "react";
import AppForm from "./AppForm";
import { ApiParamDataType } from "../AppApi/ApiParamsTable";
import AppApi from "../AppApi/AppApi";
import AppAuth from "../AppAuth/AppAuth";

const App: React.FC = () => {
    // 请求Header
    const [reqHeaders, setReqHeaders] = useState<ApiParamDataType[]>([]);

    // 所选的应用id
    const [appId, setAppId] = useState<any>(null);
    // API管理显示开关
    const [apiListOpen, setApiListOpen] = useState<boolean>(false);

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
            title: '接口前缀',
            dataIndex: 'apiPrefix',
            search: true,
        },
        {
            title: 'API管理',
            dataIndex: 'apiCount',
            search: false,
            render: (_, record) => {
                const { apiCount } = record;
                if (apiCount) {
                    return <Button type="link" onClick={() => {
                        setAppId(record.id);
                        setApiListOpen(true);
                    }}>{apiCount}</Button>
                }
                return "-";
            },
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

            {/* API列表 */}
            {apiListOpen &&
                <Drawer
                    open={apiListOpen}
                    onClose={() => {
                        setApiListOpen(false);
                        tableRef.current?.reload();
                    }}
                    width={"80%"}
                >
                    <AppApi appId={appId} />
                </Drawer>
            }
        </>
    );
};

export default App;