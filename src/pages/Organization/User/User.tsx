import CRUD from "@/components/Gyrfalcon/CRUD";
import FixSelectedTree from "@/components/Gyrfalcon/FixSelectedTree";
import { deleteUser } from "@/services/swagger/user";
import { departmentTree } from "@/services/zhiwei/department";
import { roleSelect } from "@/services/zhiwei/role";
import { deleteUsers, resetPassword, saveUser, userPage } from "@/services/zhiwei/user";
import { CopyOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormText, ProFormTreeSelect } from "@ant-design/pro-components";
import { Card, Col, Divider, Popconfirm, Row, Tree, message, notification } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const User: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType, title: string, content: any) => {
        api[type]({
            message: title,
            description: content,
            duration: 0,
            placement: 'top',
        });
    };

    // 表格列
    const columns: ProColumns<API.UserVO>[] = [
        {
            title: '编号',
            dataIndex: 'code',
        },
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '所属部门',
            dataIndex: 'departmentName',
            search: false,
        },
        {
            title: '所属角色',
            dataIndex: 'roleName',
            search: false,
        },
        {
            title: '登录账号',
            dataIndex: 'loginName',
            search: false,
        },
        {
            title: '手机',
            dataIndex: 'phone',
            search: false,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            search: false,
        },
    ];

    // 新增、编辑表单
    const renderUserForm = (isAdd: boolean) => {
        return <>
            <Card title="基本信息">
                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: "请输入编号",
                                }
                            ]}
                            width="md"
                            name="code"
                            label="编号"
                            tooltip="长度限制20"
                            placeholder="请输入编号"
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: "请输入姓名",
                                }
                            ]}
                            width="md"
                            name="name"
                            label="姓名"
                            tooltip="长度限制20"
                            placeholder="请输入姓名"
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormText
                            width="md"
                            name="phone"
                            label="手机"
                            tooltip="长度限制20"
                            placeholder="请输入手机"
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormText
                            width="md"
                            name="email"
                            label="邮箱"
                            tooltip="长度限制20"
                            placeholder="请输入邮箱"
                        />
                    </Col>
                </Row>
            </Card >
            <Card title="职责信息">
                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormTreeSelect
                            rules={[
                                {
                                    required: true,
                                    message: "请选择所属部门",
                                }
                            ]}
                            width="md"
                            name="departmentId"
                            label="所属部门"
                            placeholder="请选择所属部门"
                            request={departmentTree}
                            fieldProps={{
                                treeDefaultExpandAll: true
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormTreeSelect
                            rules={[
                                {
                                    required: true,
                                    message: "请选择所属角色",
                                }
                            ]}
                            width="md"
                            name="roleId"
                            label="所属角色"
                            placeholder="请选择所属角色"
                            request={roleSelect}
                        />
                    </Col>
                </Row>
            </Card>
            <Card title="登录信息">
                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormText
                            rules={[
                                {
                                    required: true,
                                    message: "请输入登录账号",
                                }
                            ]}
                            width="md"
                            name="loginName"
                            label="登录账号"
                            tooltip="长度限制20"
                            placeholder="请输入登录账号"
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormText.Password
                            rules={[
                                {
                                    required: isAdd,
                                    message: "请输入登录密码",
                                }
                            ]}
                            width="md"
                            name="loginPassword"
                            label="登录密码"
                            tooltip="长度限制20"
                            placeholder="请输入登录密码"
                        />
                    </Col>
                </Row>
            </Card>
        </>;
    }

    // 操作列 增加重置密码按钮
    const renderOptionButton = (id: any, user: any) => (
        <Fragment>
            <Divider type="vertical" />
            <Popconfirm
                title={`是否确认重置 ${user.name} 的登录密码？`}
                placement="topRight"
                onConfirm={async () => {
                    const response = await resetPassword({ id: user.id });
                    if (response.success) {
                        const newPassword = response.data;
                        if (newPassword) {
                            openNotificationWithIcon('success', '重置密码成功',
                                <>
                                    新密码：{newPassword}
                                    <CopyToClipboard text={newPassword} onCopy={() => {
                                        message.success(`拷贝成功地址：${newPassword}`);
                                        api.destroy();
                                    }}>
                                        <CopyOutlined />
                                    </CopyToClipboard>，请及时修改！
                                </>);
                        } else {
                            openNotificationWithIcon('warning', '重置密码失败', "未生成有效密码，请重试");
                        }
                    }
                }}
            >
                <a>重置密码</a>
            </Popconfirm>
        </Fragment>
    )


    // 所有部门
    const [departments, setDepartments] = useState<any[]>();
    const [departmentId, setDepartmentId] = useState<any>();

    // 查询部门数据
    useEffect(() => {
        const loadDepartmentData = async () => {
            // 查询菜单树
            const departments = await departmentTree();
            setDepartments(departments);
        }

        loadDepartmentData();
    }, []);

    /** 左侧部门树 */
    const departmentTreeCard = <>
        <Card>
            <FixSelectedTree
                treeData={departments}
                onSelect={(keys) => {
                    setDepartmentId(keys[0]);
                    tableRef.current?.reload();
                }}
            />
        </Card>
    </>;

    const tableRef = useRef<ActionType>();

    return (
        <>
            {contextHolder}
            <CRUD
                tableRef={tableRef}
                title="用户"
                formWidth={800}

                columns={columns}
                optionWidth={200}
                renderOptionButton={renderOptionButton}

                createForm={renderUserForm(true)}
                updateForm={renderUserForm(false)}

                handlePage={(params, options) => {
                    params.departmentId = departmentId;
                    return userPage(params, options);
                }}
                handleCreate={saveUser}
                handleUpdate={saveUser}
                handleDelete={deleteUser}
                handleBatchDelete={deleteUsers}

                leftContent={departmentTreeCard}
                leftColSpan={6}
            />
        </>
    );
};

export default User;