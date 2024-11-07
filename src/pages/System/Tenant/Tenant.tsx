import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteTenant, deleteTenants, tenantPage, saveTenant } from "@/services/zhiwei/tenant";
import { ActionType, ProColumns, ProFormText, ProFormDatePicker, } from "@ant-design/pro-components";
import { useRef } from "react";

const Tenant: React.FC = () => {

    // 表格列
    const columns: ProColumns<API.TenantVO>[] = [
        {
            title: '租户编号',
            dataIndex: 'tenantCode',
            search: true,
        },
        {
            title: '租户名称',
            dataIndex: 'tenantName',
            search: true,
        },
        {
            title: '到期时间',
            dataIndex: 'expireTime',
            search: false,
        },
        {
            title: '联系人姓名',
            dataIndex: 'contactsName',
            search: false,
        },
        {
            title: '联系人电话',
            dataIndex: 'contactsPhone',
            search: false,
        },
        {
            title: '联系人地址',
            dataIndex: 'contactsAddress',
            search: false,
        },
    ];

    const tenantForm = <>
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入租户编号",
                }
            ]}
            name="tenantCode"
            label="租户编号"
            placeholder="请输入租户编号"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入租户名称",
                }
            ]}
            name="tenantName"
            label="租户名称"
            placeholder="请输入租户名称"
        />
        <ProFormDatePicker
            rules={[
                {
                    required: true,
                    message: "请输入到期时间",
                }
            ]}
            name="expireTime"
            label="到期时间"
            placeholder="请输入到期时间"
        />
        <ProFormText
            rules={[
                {
                    required: false,
                    message: "请输入联系人姓名",
                }
            ]}
            name="contactsName"
            label="联系人姓名"
            placeholder="请输入联系人姓名"
        />
        <ProFormText
            rules={[
                {
                    required: false,
                    message: "请输入联系人电话",
                }
            ]}
            name="contactsPhone"
            label="联系人电话"
            placeholder="请输入联系人电话"
        />
        <ProFormText
            rules={[
                {
                    required: false,
                    message: "请输入联系人地址",
                }
            ]}
            name="contactsAddress"
            label="联系人地址"
            placeholder="请输入联系人地址"
        />
    </>;

    const tableRef = useRef<ActionType>();

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="系统租户"
                columns={columns}

                formWidth={400}
                createForm={tenantForm}
                updateForm={tenantForm}

                handlePage={tenantPage}
                handleCreate={saveTenant}
                handleUpdate={saveTenant}
                handleDelete={deleteTenant}
                handleBatchDelete={deleteTenants}
            />
        </>
    );
};

export default Tenant;