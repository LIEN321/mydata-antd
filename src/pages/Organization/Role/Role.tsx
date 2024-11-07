import CRUD from "@/components/Gyrfalcon/CRUD";
import { menuListByRole, menuTree } from "@/services/zhiwei/menu";
import { deleteRole, deleteRoles, grantRole, rolePage, saveRole } from "@/services/zhiwei/role";
import { ModalForm, ProColumns, ProFormText, ProFormTextArea, ProFormTreeSelect } from "@ant-design/pro-components";
import { Divider, Tree, TreeProps, message } from "antd";
import { Fragment, useState } from "react";

const Role: React.FC = () => {

    // 表格列
    const columns: ProColumns<API.RoleVO>[] = [
        {
            title: '角色编号',
            dataIndex: 'code',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
        },
    ];

    const roleForm = <>
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入角色编号",
                }
            ]}
            width="md"
            name="code"
            label="角色编号"
            tooltip="长度限制50"
            placeholder="请输入角色编号"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入角色名称",
                }
            ]}
            width="md"
            name="name"
            label="角色名称"
            tooltip="长度限制50"
            placeholder="请输入角色名称"
        />
        <ProFormTextArea
            width="md"
            name="remark"
            label="角色备注"
            tooltip="长度限制255"
            placeholder="请输入角色备注"
        />
    </>;

    // 所有菜单
    const [menus, setMenus] = useState<any[]>();
    // 角色已关联 & 用户选择的菜单id
    const [roleMenuIds, setRoleMenuIds] = useState<any[]>();
    // 权限配置的角色id
    const [currentRole, setCurrentRole] = useState<any>();
    // 权限配置的Modal打开状态
    const [grantModalOpen, setGrantModalOpen] = useState<boolean>(false);

    // 操作列 增加权限配置按钮
    const renderOptionButton = (id: any, role: any) => (
        <Fragment>
            <Divider type="vertical" />
            <a onClick={async () => {
                // 设置当前所选角色
                setCurrentRole(role);
                // 查询菜单列表
                const menus = await menuTree();
                setMenus(menus);
                // 查询角色已关联的菜单
                const roleMenuIds = await menuListByRole({ roleId: role.id });
                setRoleMenuIds(roleMenuIds);
                // 显示Modal
                setGrantModalOpen(true);
            }}>权限配置</a>
        </Fragment>
    )

    // 选择菜单
    const handleSelectMenu: any = (checkedKeys: any) => {
        setRoleMenuIds(checkedKeys);
    };

    // 提交权限配置
    const handleGrantRole = async (fields: API.RoleGrantDTO) => {
        console.info("fields", fields);
        const hide = message.loading("正在提交...");
        try {
            await grantRole({ ...fields });
            hide();
            message.success("权限配置成功");
            return true;
        } catch (error) {
            hide();
            message.error("权限配置失败，请重试！");
            return false;
        }
    };

    return (
        <>
            <CRUD
                title="角色"
                formWidth={400}

                columns={columns}
                optionWidth={200}
                renderOptionButton={renderOptionButton}

                createForm={roleForm}
                updateForm={roleForm}

                handlePage={rolePage}
                handleCreate={saveRole}
                handleUpdate={saveRole}
                handleDelete={deleteRole}
                handleBatchDelete={deleteRoles}
            />

            {grantModalOpen && <ModalForm
                title={`权限配置：${currentRole.name}`}
                width={300}
                open={grantModalOpen}
                onOpenChange={setGrantModalOpen}
                onFinish={async (value) => {
                    value.roleIds = [currentRole.id];
                    value.menuIds = roleMenuIds;
                    const success = await handleGrantRole(value as API.RoleGrantDTO);
                    if (success) {
                        // 关闭新建窗口
                        setGrantModalOpen(false);
                    }
                }}
            >
                <Tree
                    checkable
                    selectable={false}
                    onCheck={handleSelectMenu}
                    treeData={menus}
                    defaultCheckedKeys={roleMenuIds}
                    defaultExpandAll
                    height={500}
                />
            </ModalForm>
            }
        </>
    );
};

export default Role;