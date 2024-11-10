import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteDevEntity, deleteDevEntities, devEntityPage, saveDevEntity, saveDevEntityProperty } from "@/services/zhiwei/devEntity";
import { generateCode } from "@/services/zhiwei/generateCode";
import { ActionType, ModalForm, ProColumns, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Button, Card, Col, Divider, Row, Space, message } from "antd";
import { Fragment, useRef, useState } from "react";
import DevEntityPropertyTable, { BaseEntityProperties, DataType } from "./DevEntityPropertyTable";
import { devEntityPropertyList } from "@/services/zhiwei/devEntityProperty";

const DevEntity: React.FC = () => {

    // 生成代码的业务实体
    const [currentEntity, setCurrentEntity] = useState<any>();

    // 待生成代码的实体id数组
    const [entityIds, setEntityIds] = useState<number[]>([]);

    // 生成代码的Modal打开状态
    const [generateCodeModalOpen, setGenerateCodeModalOpen] = useState<boolean>(false);

    // 属性管理的Modal打开状态
    const [propertiesModalOpen, setPropertiesModalOpen] = useState<boolean>(false);

    // 选择继承实体的模式
    const [extendMode, setExtendMode] = useState<string>("tenant");

    // 用户自定义属性列表
    const [entityProperties, setEntityProperties] = useState<DataType[]>([]);

    // 按钮加载状态
    const [loading, setLoading] = useState<boolean>(false);

    // 表格列
    const columns: ProColumns<API.DevEntityVO>[] = [
        {
            title: '实体编号',
            dataIndex: 'code',
        },
        {
            title: '实体名称',
            dataIndex: 'name',
        },
        {
            title: '后端包名',
            dataIndex: 'packageName',
            search: false,
        },
        {
            title: '数据库表名',
            dataIndex: 'tableName',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 300,
            search: false,
        },
    ];

    // 操作列扩展按钮
    const renderOptionButton = (id: any, devEntity: any) => {
        return <Fragment>
            {/* 按钮：属性管理 */}
            <Divider type="vertical" />
            <a onClick={async () => {
                // 设置当前业务实体
                setCurrentEntity(devEntity);
                // 设置选中的记录id
                setEntityIds([devEntity.id]);
                // 设置继承模式
                if(devEntity.extendMode){
                    setExtendMode(devEntity.extendMode);
                }

                // 查询实体属性列表
                const response = await devEntityPropertyList({ id: devEntity.id });
                if (response.success) {
                    const responseData = response.data;
                    if (responseData) {
                        let count = 0;
                        let properties: DataType[] = [];
                        responseData.map(p => {
                            const property = p as DataType;
                            property.key = count.toString();
                            count++;

                            properties.push(property);
                        });
                        setEntityProperties(properties);
                    }
                }

                // 显示Modal
                setPropertiesModalOpen(true);
            }}>属性管理</a>

            <Divider type="vertical" />

            {/* 按钮：生成代码 */}
            <a onClick={() => {
                // 设置当前业务实体
                setCurrentEntity(devEntity);
                setEntityIds([devEntity.id]);
                // 显示Modal
                setGenerateCodeModalOpen(true);
            }}>生成代码</a>
        </Fragment>;
    };

    // 业务实体的表单
    const devEntityForm = <>
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入实体编号",
                }
            ]}
            name="code"
            label="实体编号"
            tooltip="长度限制50"
            placeholder="请输入实体编号"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入实体名称",
                }
            ]}
            name="name"
            label="实体名称"
            tooltip="长度限制50"
            placeholder="请输入实体名称"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入后端包名",
                }
            ]}
            name="packageName"
            label="后端包名"
            tooltip="长度限制50"
            placeholder="请输入后端包名"
            initialValue="tech.zhiwei.frostmetal.modules.{请替换}"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入数据库表名",
                }
            ]}
            name="tableName"
            label="数据库表名"
            tooltip="长度限制50"
            placeholder="请输入数据库表名"
        />
        <ProFormTextArea
            name="remark"
            label="实体备注"
            tooltip="长度限制255"
            placeholder="请输入实体备注"
        />

    </>;

    // 保存实体属性
    const saveProperties = async (isGenerate: boolean) => {
        setLoading(true);

        const params = {
            id: currentEntity.id,
            extendMode: extendMode,
            properties: entityProperties
        };

        const hide = message.loading("正在提交...");
        const success = await saveDevEntityProperty(params);
        setLoading(false);
        if (success) {
            hide();
            message.success(`属性保存成功！`);

            if (isGenerate === true) {
                // 若要继续生成代码，则显示生成代码窗口，不关闭当前属性列表窗口
                setGenerateCodeModalOpen(true);
            } else {
                // 关闭当前属性列表窗户
                setPropertiesModalOpen(false);
            }
        }
    };

    const tableRef = useRef<ActionType>();

    // 表格选择
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

    const toolBarButton = [
        <Button disabled={selectedRowKeys.length === 0} onClick={() => {
            setEntityIds([...selectedRowKeys]);
            // 显示Modal
            setGenerateCodeModalOpen(true);
        }}>
            生成代码
        </Button>
    ];

    return (
        <>
            <CRUD
                title="业务实体"
                tableRef={tableRef}
                rowSelectionCallBack={setSelectedRowKeys}
                toolBarButton={toolBarButton}

                columns={columns}
                optionWidth={300}
                renderOptionButton={renderOptionButton}

                formWidth={600}
                createForm={devEntityForm}
                updateForm={devEntityForm}

                handlePage={devEntityPage}
                handleCreate={saveDevEntity}
                handleUpdate={saveDevEntity}
                handleDelete={deleteDevEntity}
                handleBatchDelete={deleteDevEntities}
            />

            {/* 生成代码 Modal */}
            {generateCodeModalOpen && <ModalForm
                title='生成代码 - 确认配置'
                width={600}
                open={generateCodeModalOpen}
                onOpenChange={setGenerateCodeModalOpen}
                onFinish={async (value) => {
                    const params = {
                        ...value,
                        ids: entityIds,
                    };
                    const hide = message.loading("正在生成...");
                    const success = await generateCode(params);
                    if (success) {
                        hide();
                        message.success(`代码已生成！`);
                        // 关闭窗户
                        setGenerateCodeModalOpen(false);
                        // setPropertiesModalOpen(false);

                        tableRef.current?.reload();
                    }
                }}
                initialValues={currentEntity}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入作者名",
                        }
                    ]}
                    name="authName"
                    label="作者名"
                    tooltip="长度限制50"
                    placeholder="请输入作者名"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入前端代码目录",
                        }
                    ]}
                    name="uiCodePath"
                    label="前端代码目录"
                    tooltip="长度限制255"
                    placeholder="请输入前端代码目录"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: "请输入后端代码目录",
                        }
                    ]}
                    name="javaCodePath"
                    label="后端代码目录（含sql）"
                    tooltip="长度限制255"
                    placeholder="请输入后端代码目录"
                />
            </ModalForm>
            }

            {/* 属性管理 Modal */}
            {propertiesModalOpen && <ModalForm
                title={`${currentEntity.name} - 属性管理`}
                width={1300}
                open={propertiesModalOpen}
                onOpenChange={setPropertiesModalOpen}
                onFinish={saveProperties}

                submitter={{
                    searchConfig: {
                        submitText: '保存',
                    },
                    submitButtonProps: {
                        type: 'default',
                    },
                    render: (_, doms) => {
                        return [
                            ...doms,
                            <Button loading={loading} htmlType="button" type="primary" onClick={() => { saveProperties(true); }} key="saveAndGenerate">
                                保存并生成代码
                            </Button>
                        ];
                    }
                }}
            >
                <DevEntityPropertyTable
                    properties={entityProperties}
                    handleUpdateProperties={setEntityProperties}

                    extendMode={extendMode}
                    handleUpdateExtendMode={setExtendMode}
                />
            </ModalForm>}
        </>
    );
};

export default DevEntity;