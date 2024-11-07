import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteDepartment, departmentList, departmentTree, saveDepartment, deleteDepartments } from "@/services/zhiwei/department";
import { ProColumns, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect } from "@ant-design/pro-components";

const Department: React.FC = () => {
    // 表格列
    const columns: ProColumns<API.DepartmentVO>[] = [
        {
            title: '机构名称',
            dataIndex: 'name',
        },
        {
            title: '机构类型',
            dataIndex: 'type',
            search: false,
            valueEnum: {
                1: "公司",
                2: "部门",
                3: "小组",
            },
        },
        {
            title: '机构排序',
            dataIndex: 'sort',
            search: false,
        },
    ];

    const departmentForm = <>
        <ProFormTreeSelect
            width="md"
            name="parentId"
            label="上级机构"
            tooltip="若不选则为一级机构"
            placeholder="请选择上级机构"
            request={departmentTree}
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入机构名称",
                }
            ]}
            width="md"
            name="name"
            label="机构名称"
            tooltip="长度限制20"
            placeholder="请输入机构名称"
        />
        <ProFormSelect
            rules={[
                {
                    required: true,
                    message: "请选择机构类型",
                }
            ]}
            width="md"
            name="type"
            label="机构类型"
            placeholder="请选择机构类型"
            request={async () => [
                { label: '公司', value: 1 },
                { label: '部门', value: 2 },
                { label: '小组', value: 3 },
            ]}
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入机构排序",
                }
            ]}
            width="md"
            name="sort"
            label="机构排序"
            tooltip="必须填数字"
            placeholder="请输入机构排序"
        />
        <ProFormTextArea
            width="md"
            name="remark"
            label="机构备注"
            tooltip="长度限制255"
            placeholder="请输入机构备注"
        />
    </>;

    return (
        <CRUD
            title="机构部门"
            formWidth={400}

            columns={columns}
            createForm={departmentForm}
            updateForm={departmentForm}

            handlePage={departmentList}
            handleCreate={saveDepartment}
            handleUpdate={saveDepartment}
            handleDelete={deleteDepartment}
            handleBatchDelete={deleteDepartments}

            pagination={{ pageSize: 500 }}
        />
    );
};

export default Department;