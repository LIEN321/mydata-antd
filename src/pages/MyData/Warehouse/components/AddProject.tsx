import { ModalForm } from "@ant-design/pro-components";
import ProjectForm from "../../Project/components/ProjectForm";
import { saveProject } from "@/services/zhiwei/project";

export type AddProjectProps = {
    /** 是否显示 */
    open: boolean;
    /** 切换显示状态 */
    onOpenChange: (open: boolean) => void;
    /** 新建项目完成后的 */
    onSuccess?: () => void;
};

const AddProject: React.FC<AddProjectProps> = (props) => {
    return (
        <>
            <ModalForm
                title={'新建项目'}
                width={400}
                open={props.open}
                onOpenChange={props.onOpenChange}
                onFinish={async (value) => {
                    const response = await saveProject(value);
                    if (response.success) {
                        if (props.onSuccess) {
                            await props.onSuccess();
                        }
                        props.onOpenChange(false);
                    }
                }}
            >
                <ProjectForm />
            </ModalForm>
        </>
    );
};

export default AddProject;