import CRUD from "@/components/Gyrfalcon/CRUD";
import FixSelectedTree from "@/components/Gyrfalcon/FixSelectedTree";
import { deleteSysApi, sysApiPage, saveSysApi, deleteSysApis } from "@/services/zhiwei/api";
import { menuTree } from "@/services/zhiwei/menu";
import { ActionType, ProColumns, ProFormRadio, ProFormText, ProFormTextArea, ProFormTreeSelect } from "@ant-design/pro-components";
import { Card, Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";

const Api: React.FC = () => {

    // 所有菜单
    const [menus, setMenus] = useState<any[]>();
    const [menuId, setMenuId] = useState<any>();

    useEffect(() => {
        const loadMenuData = async () => {
            // 查询菜单树
            const menuTreeData = await menuTree();
            // 拼接完整树
            const tree = [{ title: '全部', key: '', value: '', children: menuTreeData }];
            setMenus(tree);
        }

        loadMenuData();
    }, []);

    // 表格列
    const columns: ProColumns<API.SysApiVO>[] = [
        {
            title: '所属菜单',
            dataIndex: 'menuName',
            search: false,
        },
        {
            title: '接口名称',
            dataIndex: 'name',
        },
        {
            title: '接口编号',
            dataIndex: 'code',
        },
        {
            title: '请求方式',
            dataIndex: 'method',
            search: false,
        },
        {
            title: '接口地址',
            dataIndex: 'path',
            search: false,
        },
    ];

    const apiForm = <>
        <Row>
            <Col span={12}>
                <ProFormTreeSelect
                    rules={[
                        {
                            required: true,
                            message: "请选择所属菜单",
                        }
                    ]}
                    name="menuId"
                    label="所属菜单"
                    placeholder="请选择所属菜单"
                    request={menuTree}
                    fieldProps={{
                        treeDefaultExpandAll: true,
                    }}
                />
            </Col>
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
                    name="name"
                    label="接口名称"
                    tooltip="长度限制50"
                    placeholder="请输入接口名称"
                />
            </Col>
            <Col span={12}>
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入接口编号",
                        }
                    ]}
                    name="code"
                    label="接口编号"
                    tooltip="长度限制50"
                    placeholder="请输入接口编号"
                />
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入接口地址",
                        }
                    ]}
                    name="path"
                    label="接口地址"
                    placeholder="请输入接口地址"
                    extra="使用星号(*)作为路径变量，例如 /demo/* 表示 /demo/{id}"
                />
            </Col>
            <Col span={12}>
                <ProFormRadio.Group
                    rules={[
                        {
                            required: true,
                            message: "请选择请求方式",
                        }
                    ]}
                    name="method"
                    label="请求方式"
                    placeholder="请选择请求方式"
                    request={async () => [
                        { label: 'GET', value: 'GET' },
                        { label: 'POST', value: 'POST' },
                        { label: 'PUT', value: 'PUT' },
                        { label: 'DELETE', value: 'DELETE' },
                    ]}
                    initialValue={'GET'}
                />
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={24}>
                <ProFormTextArea
                    name="remark"
                    label="系统接口备注"
                    tooltip="长度限制255"
                    placeholder="请输入系统接口备注"
                />
            </Col>
        </Row>
    </>;

    /** 左侧菜单树 */
    const menuTreeCard = <>
        <Card>
            <FixSelectedTree
                treeData={menus}
                onSelect={(keys) => {
                    setMenuId(keys[0]);
                    tableRef.current?.reload();
                }}
            />
        </Card>
    </>;


    const tableRef = useRef<ActionType>();

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="系统接口"
                columns={columns}

                createForm={apiForm}
                updateForm={apiForm}
                formWidth={800}

                handlePage={(params, options) => {
                    params.menuId = menuId;
                    return sysApiPage(params, options);
                }}
                handleCreate={saveSysApi}
                handleUpdate={saveSysApi}
                handleDelete={deleteSysApi}
                handleBatchDelete={deleteSysApis}

                leftContent={menuTreeCard}
                leftColSpan={6}
            />
        </>
    );
};

export default Api;