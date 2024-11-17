import { ModalForm } from "@ant-design/pro-components";
import AppForm from "../../App/AppForm";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { saveApp } from "@/services/zhiwei/app";

export type AddAppProp = {
    /** 新建应用完成后的操作 */
    onSuccess?: (newAppId: number) => void;
};

const AddApp: React.FC<AddAppProp> = (props) => {
    return (
        <>
            <ModalForm
                title={'新建应用'}
                width={400}
                trigger={<Button icon={<PlusOutlined />} />}
                onFinish={async (value) => {
                    const response = await saveApp(value);
                    if (response.success) {
                        if (props.onSuccess && response.data) {
                            await props.onSuccess(response.data);
                        }
                        return true;
                    }
                    return false;
                }}
            >
                <AppForm />
            </ModalForm>
        </>
    );
};

export default AddApp;