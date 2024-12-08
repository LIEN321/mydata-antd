import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteProject, deleteProjects, projectPage, saveProject } from "@/services/zhiwei/project";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { useRef } from "react";
import ProjectForm from "./components/ProjectForm";

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

    const projectForm = <ProjectForm />;

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