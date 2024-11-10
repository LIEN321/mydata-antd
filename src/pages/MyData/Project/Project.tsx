import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteProject, deleteProjects, projectPage, saveProject } from "@/services/zhiwei/project";
import { ActionType, ProColumns, ProFormText, ProFormTextArea, } from "@ant-design/pro-components";
import { useRef } from "react";

const Project: React.FC = () => {

    // 表格列
    const columns: ProColumns<API.ProjectVO>[] = [
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            search: true,
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            search: true,
        },
    ];

    const projectForm = <>
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入项目编号",
                }
            ]}
            name="projectCode"
            label="项目编号"
            placeholder="请输入项目编号"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入项目名称",
                }
            ]}
            name="projectName"
            label="项目名称"
            placeholder="请输入项目名称"
        />
        <ProFormTextArea
            rules={[
                {
                    required: false,
                    message: "请输入项目描述",
                }
            ]}
            name="projectDesc"
            label="项目描述"
            placeholder="请输入项目描述"
        />
    </>;

    const tableRef = useRef<ActionType>();

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="项目"
                columns={columns}

                formWidth={400}
                createForm={projectForm}
                updateForm={projectForm}

                handlePage={projectPage}
                handleCreate={saveProject}
                handleUpdate={saveProject}
                handleDelete={deleteProject}
                handleBatchDelete={deleteProjects}
            />
        </>
    );
};

export default Project;