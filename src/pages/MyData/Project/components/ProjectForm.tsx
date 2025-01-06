import { ProFormText, ProFormTextArea } from "@ant-design/pro-components";

export type ProjectFormProp = {
    projectId?: number;
};

const ProjectForm: React.FC<ProjectFormProp> = (props) => {
    return (
        <>
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
                disabled={props.projectId != undefined}
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
        </>
    );
};

export default ProjectForm;