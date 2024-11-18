import { ProFormText, ProFormTextArea } from "@ant-design/pro-components";

const AppForm: React.FC = () => {
    return (
        <>
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: "请输入应用编号",
                    }
                ]}
                name="appCode"
                label="应用编号"
                placeholder="请输入应用编号"
            />
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: "请输入应用名称",
                    }
                ]}
                name="appName"
                label="应用名称"
                placeholder="请输入应用名称"
            />
            <ProFormText
                rules={[
                    {
                        required: false,
                        message: "请输入访问地址",
                    }
                ]}
                name="appUrl"
                label="访问地址"
                placeholder="请输入访问地址"
            />
            <ProFormText
                rules={[
                    {
                        required: false,
                        message: "请输入接口前缀地址",
                    }
                ]}
                name="apiPrefix"
                label="接口前缀地址"
                placeholder="请输入接口前缀地址"
            />
            <ProFormTextArea
                rules={[
                    {
                        required: false,
                        message: "请输入应用描述",
                    }
                ]}
                name="appDesc"
                label="应用描述"
                placeholder="请输入应用描述"
            />
        </>
    )
};

export default AppForm;