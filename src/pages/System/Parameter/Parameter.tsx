import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteParameters } from "@/services/zhiwei/parameter";
import { deleteParameter, parameterPage, saveParameter } from "@/services/zhiwei/parameter";
import { ProColumns, ProFormText, ProFormTextArea } from "@ant-design/pro-components";

const Parameter: React.FC = () => {

    // 表格列
    const columns: ProColumns<API.ParameterVO>[] = [
        {
            title: '参数名称',
            dataIndex: 'name',
        },
        {
            title: '参数编号',
            dataIndex: 'code',
        },
        {
            title: '参数值',
            dataIndex: 'value',
            search: false,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            search: false,
        },
    ];

    const parameterForm = <>
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入参数名称",
                }
            ]}
            width="md"
            name="name"
            label="参数名称"
            tooltip="长度限制50"
            placeholder="请输入参数名称"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入参数编号",
                }
            ]}
            width="md"
            name="code"
            label="参数编号"
            tooltip="长度限制50"
            placeholder="请输入参数编号"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入参数值",
                }
            ]}
            width="md"
            name="value"
            label="参数值"
            placeholder="请输入参数值"
        />
        <ProFormTextArea
            width="md"
            name="remark"
            label="系统参数备注"
            tooltip="长度限制255"
            placeholder="请输入系统参数备注"
        />
    </>;

    return (
        <>
            <CRUD
                title="系统参数"
                formWidth={400}

                columns={columns}

                createForm={parameterForm}
                updateForm={parameterForm}

                handlePage={parameterPage}
                handleCreate={saveParameter}
                handleUpdate={saveParameter}
                handleDelete={deleteParameter}
                handleBatchDelete={deleteParameters}
            />
        </>
    );
};

export default Parameter;