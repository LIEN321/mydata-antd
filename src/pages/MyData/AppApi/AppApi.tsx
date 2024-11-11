import CRUD from "@/components/Gyrfalcon/CRUD";
import { appSelect } from "@/services/zhiwei/app";
import { deleteAppApi, deleteAppApis, appApiPage, saveAppApi } from "@/services/zhiwei/appApi";
import { ActionType, ProColumns, ProFormText, ProFormSelect, ProFormRadio, } from "@ant-design/pro-components";
import { Col, Row, Tabs, TabsProps } from "antd";
import { useRef } from "react";

const AppApi: React.FC = () => {

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

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Params',
            children: 'Params',
        },
        {
            key: '2',
            label: 'Headers',
            children: 'Headers',
        },
        {
            key: '3',
            label: 'Body',
            children: 'Body',
        },
        {
            key: '4',
            label: '响应示例',
            children: '响应示例',
        },
    ];

    const appApiForm = <>
        <Row gutter={24}>
            <Col span={12}>
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
                />
            </Col>
            <Col span={12}></Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
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
            <Col span={12}>
                <ProFormRadio.Group
                    rules={[
                        {
                            required: true,
                            message: "请选择API类型",
                        }
                    ]}
                    name="opType"
                    label="API类型"
                    placeholder="请选择请求方法"
                    options={[
                        {
                            label: '提供数据',
                            value: '1',
                        },
                        {
                            label: '消费数据',
                            value: '2',
                        },
                    ]}
                    radioType="button"
                    initialValue={"1"}
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
                        {
                            label: 'GET',
                            value: 'GET',
                        },
                        {
                            label: 'POST',
                            value: 'POST',
                        },
                        {
                            label: 'PUT',
                            value: 'PUT',
                        },
                        {
                            label: 'DELETE',
                            value: 'DELETE',
                        },
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
                            message: "请选择数据类型",
                        }
                    ]}
                    name="dataType"
                    label="数据类型"
                    placeholder="请选择数据类型"
                    options={[
                        {
                            label: 'JSON',
                            value: 'JSON',
                        },
                    ]}
                    radioType="button"
                    initialValue={"JSON"}
                />
            </Col>
            <Col span={8}>
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
        </Row>
        <Tabs defaultActiveKey="1" items={tabItems} />
    </>;

    const tableRef = useRef<ActionType>();

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="应用接口"
                columns={columns}

                formWidth={600}
                createForm={appApiForm}
                updateForm={appApiForm}

                handlePage={appApiPage}
                handleCreate={saveAppApi}
                handleUpdate={saveAppApi}
                handleDelete={deleteAppApi}
                handleBatchDelete={deleteAppApis}
            />
        </>
    );
};

export default AppApi;