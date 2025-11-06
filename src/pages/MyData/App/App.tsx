import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteApp, deleteApps, appPage, saveApp } from "@/services/zhiwei/app";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Drawer } from "antd";
import { useRef, useState } from "react";
import AppForm from "./AppForm";
import { ApiParamDataType } from "../AppApi/ApiParamsTable";
import AppApi from "../AppApi/AppApi";

const App: React.FC = () => {
    const [app, setApp] = useState<API.AppVO>({});
    // 请求Header
    const [reqHeaders, setReqHeaders] = useState<ApiParamDataType[]>([]);
    // 认证类型
    const [authType, setAuthType] = useState<string>('');
    // 认证配置
    const [authConfig, setAuthConfig] = useState<any>({});

    // 响应配置
    const [respConfig, setRespConfig] = useState<Record<string, any>>({});

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
                let { apiCount } = record;
                if (!apiCount)
                    apiCount = 0;
                return <Button type="link" onClick={() => {
                    setAppId(record.id);
                    setApiListOpen(true);
                }}>{apiCount}</Button>
            },
        },
    ];

    const appForm = <AppForm
        appId={app.id}
        reqHeaders={reqHeaders}
        setReqHeaders={setReqHeaders}
        authType={authType}
        setAuthType={setAuthType}
        authConfig={authConfig}
        setAuthConfig={setAuthConfig}
        respConfig={respConfig}
        setRespConfig={setRespConfig}
    />;

    const tableRef = useRef<ActionType>();

    const handleOnClickCreateBtn = () => {
        setApp({});
        setReqHeaders([]);
        setAuthType('');
        setAuthConfig({});
        setRespConfig({ isValidCode: true, codeValue: 200 });
    }

    const handleOnClickEditBtn = (record: any) => {
        setApp(record);
        setReqHeaders(record.reqHeaders);
        setAuthType(record.authType);
        setAuthConfig(record.authConfig);
        setRespConfig(record.respConfig);
    }

    const handleSaveAppApi = async (formData: any) => {
        const body = {
            ...formData
            , reqHeaders
            , authType
            , authConfig
            , respConfig
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

                onClickCreateBtn={handleOnClickCreateBtn}
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