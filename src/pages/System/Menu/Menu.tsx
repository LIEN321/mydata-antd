import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteMenu, menuList, menuTree, saveMenu } from "@/services/zhiwei/menu";
import { ProColumns, ProFormDigit, ProFormInstance, ProFormRadio, ProFormText, ProFormTextArea, ProFormTreeSelect } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { deleteMenus } from '@/services/zhiwei/menu';
import { useRef } from 'react';
import { getIcon } from "@/util/FixMenuItemIcon";
import IconPicker from "@/components/Gyrfalcon/IconPicker";

const Menu: React.FC = () => {

    const formRef = useRef<ProFormInstance>();

    // 表格列
    const columns: ProColumns<API.MenuVO>[] = [
        {
            title: '菜单图标',
            dataIndex: 'icon',
            search: false,
            width: 80,
            renderText: (text) => {
                return text ? getIcon(text.toString()) : <></>;
            }
        },
        {
            title: '菜单名称',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: '菜单编号',
            dataIndex: 'code',
            width: 200,
        },
        {
            title: '路由地址',
            dataIndex: 'path',
            search: false,
        },
        {
            title: '排序',
            dataIndex: 'sort',
            search: false,
            width: 100,
            align: 'center',
        },
        {
            title: '类型',
            dataIndex: 'type',
            search: false,
            valueEnum: {
                1: "菜单",
                2: "按钮",
            },
            width: 100,
            align: 'center',
        },
    ];

    const menuForm = <>
        <Row gutter={24}>
            {/* 上级菜单 */}
            <Col span={12}>
                <ProFormTreeSelect
                    name="parentId"
                    label="上级菜单"
                    tooltip="若不选则为一级菜单"
                    placeholder="请选择上级菜单"
                    request={menuTree}
                />
            </Col>
            <Col span={12}>
            </Col>
        </Row>
        <Row gutter={24}>
            {/* 菜单名称 */}
            <Col span={12}>
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入菜单名称",
                        }
                    ]}
                    name="name"
                    label="菜单名称"
                    tooltip="长度限制20"
                    placeholder="请输入菜单名称"
                />
            </Col>
            {/* 菜单编号 */}
            <Col span={12}>
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入菜单编号",
                        }
                    ]}
                    name="code"
                    label="菜单编号"
                    tooltip="长度限制20"
                    placeholder="请输入菜单编号"
                />
            </Col>
        </Row>
        <Row gutter={24}>
            {/* 路由地址 */}
            <Col span={12}>
                <ProFormText
                    rules={[
                        {
                            required: false,
                            message: "请输入路由地址",
                        }
                    ]}
                    name="path"
                    label="路由地址"
                    tooltip="长度限制255"
                    placeholder="请输入路由地址"
                />
            </Col>
            {/* 菜单图标 */}
            <Col span={12}>
                <Form.Item name="icon" label="菜单图标">
                    <IconPicker onChoose={(icon) => {
                        formRef.current?.setFieldsValue({icon: icon});
                    }} />
                </Form.Item>
                {/* <ProFormText
                    rules={[
                        {
                            required: false,
                            message: "请选择菜单图标",
                        }
                    ]}
                    name="icon"
                    label="菜单图标"
                    tooltip="长度限制20"
                    placeholder="请选择菜单图标"
                /> */}
            </Col>
        </Row>
        <Row gutter={24}>
            {/* 菜单排序 */}
            <Col span={12}>
                <ProFormDigit
                    rules={[
                        {
                            required: true,
                            message: "请输入菜单排序",
                        }
                    ]}
                    name="sort"
                    label="菜单排序"
                    placeholder="请输入菜单排序"
                    min={1}
                    width="xs"
                />
            </Col>
            {/* 菜单类型 */}
            <Col span={12}>
                <ProFormRadio.Group
                    rules={[
                        {
                            required: true,
                            message: "请选择菜单类型",
                        }
                    ]}
                    name="type"
                    label="菜单类型"
                    placeholder="请选择菜单类型"
                    request={async () => [
                        { label: '菜单', value: 1 },
                        { label: '按钮', value: 2 },
                    ]}
                    initialValue={1}
                />
            </Col>
        </Row>
        <Row gutter={24}>
            {/* 菜单备注 */}
            <Col span={24}>
                <ProFormTextArea
                    name="remark"
                    label="菜单备注"
                    tooltip="长度限制255"
                    placeholder="请输入菜单备注"
                />
            </Col>
        </Row>
    </>;

    return (
        <CRUD
            title="菜单"
            formWidth={800}

            columns={columns}
            createForm={menuForm}
            updateForm={menuForm}

            handlePage={menuList}
            handleCreate={saveMenu}
            handleUpdate={saveMenu}
            handleDelete={deleteMenu}
            handleBatchDelete={deleteMenus}

            pagination={{ pageSize: 500 }}

            formRef={formRef}
        />
    );
};

export default Menu;