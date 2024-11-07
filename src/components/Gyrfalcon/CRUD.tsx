import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProColumns, ProFormInstance, ProTable } from "@ant-design/pro-components";
import { Button, Col, Divider, message, Popconfirm, Row } from "antd";
import React, { Fragment, useRef, useState } from "react";

export type CRUDProps = {
    /** 标题 */
    title: string
    /** 表格工具栏 */
    toolBarButton?: any;
    /** 表格选择方式 */
    rowSelectionType?: 'none' | 'checkbox' | 'radio';
    /** 表格选择 */
    rowSelectionCallBack?: (any);
    /** 表格分页 */
    pagination?: any;
    /** 表格列 */
    columns: ProColumns<any>[];
    /** 表单宽度 */
    formWidth?: string | number;
    /** 操作列的宽度 */
    optionWidth?: string | number;
    /** 扩展操作列按钮 */
    renderOptionButton?: (id: any, record: any) => any;
    /** 新建表单 */
    createForm?: any;
    /** 编辑表单 */
    updateForm?: any;
    /** 表单ref引用 */
    formRef?: any;
    /** 分页查询接口 */
    handlePage: (params: any, options?: { [key: string]: any }) => any;
    /** 保存数据接口 */
    handleCreate?: (body: any, options?: { [key: string]: any }) => any;
    /** 更新数据接口 */
    handleUpdate?: (body: any, options?: { [key: string]: any }) => any;
    /** 删除数据接口 */
    handleDelete?: (params: any, options?: { [key: string]: any }) => any;
    /** 批量删除接口 */
    handleBatchDelete?: (params: any, options?: { [key: string]: any }) => any;

    /** 左侧布局内容 */
    leftContent?: any;
    /** 左侧布局col span */
    leftColSpan?: number;
    /** 右侧布局内容 */
    rightContent?: any;
    /** 右侧布局col span */
    rightColSpan?: number;

    tableRef?: any;
};

const CRUD: React.FC<CRUDProps> = (props) => {

    const handleCreate = async (fields: any) => {
        const hide = message.loading("正在提交...");
        try {
            if (props.handleCreate) {
                await props.handleCreate({ ...fields });
                hide();
                message.success("新建成功");
                return true;
            }
            message.error("不支持新建操作！");
        } catch (error) {
            hide();
            // message.error("新建失败，请重试！");
            return false;
        }
    };

    const handleUpdate = async (fields: any) => {
        const hide = message.loading("正在提交...");
        try {
            if (props.handleUpdate) {
                await props.handleUpdate({ ...fields });
                hide();
                message.success("更新成功");
                return true;
            }
            message.error("不支持更新操作！");
        } catch (error) {
            hide();
            // message.error("更新失败，请重试！");
            return false;
        }
    };

    const handleDelete = async (id: number) => {
        const hide = message.loading("正在删除...");
        try {
            if (props.handleDelete) {
                await props.handleDelete({ id });
                hide();
                message.success("删除成功");
                return true;
            }
            message.error("不支持删除操作！");
        } catch (error) {
            hide();
            // message.error("删除失败，请重试！");
            return false;
        }
    };

    const handleBatchDelete = async () => {
        if (!props.handleBatchDelete) {
            return;
        }
        const hide = message.loading("正在删除...");
        try {
            await props.handleBatchDelete(selectedRowKeys);
            hide();
            message.success("删除成功");
            return true;
        } catch (error) {
            hide();
            // message.error("删除失败，请重试！");
            return false;
        }
    }

    // 新建窗口常量
    const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);

    // 更新窗口常量
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    // 当前编辑记录
    const [currentRow, setCurrentRow] = useState<any>();

    // 表格
    const tableRef = props.tableRef || useRef<ActionType>();
    // 表格选择
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const renderActionButton = props.renderOptionButton;

    let columns = props.columns;
    if (columns[columns.length - 1].key != 'option') {
        if (props.handleUpdate || props.handleDelete) {
            columns.push(
                {
                    title: '操作',
                    valueType: 'option',
                    key: 'option',
                    width: props.optionWidth ? props.optionWidth : 100,
                    align: 'center',
                    render: (_, record) => (
                        <Fragment>
                            {props.handleUpdate &&
                                <a key="edit" onClick={() => {
                                    setCurrentRow(record);
                                    handleUpdateModalOpen(true);
                                }}>编辑</a>
                            }
                            {props.handleUpdate && props.handleDelete &&
                                <Divider type="vertical" />}
                            {props.handleDelete && <Popconfirm
                                title={`是否确认删除?`}
                                onConfirm={async () => {
                                    const success = await handleDelete(record.id as number);
                                    if (success) {
                                        tableRef.current?.reloadAndRest?.();
                                    }
                                }}
                                placement="topRight"
                            >
                                <a>删除</a>
                            </Popconfirm>
                            }

                            {renderActionButton ? renderActionButton(record.id, record) : null}
                        </Fragment>
                    ),
                }
            );

        }
    }

    const toolBarRender = () => {
        let buttons = []

        if (props.handleCreate) {
            buttons.push(
                <Button
                    type="primary"
                    key="primary"
                    onClick={() => {
                        // 打开新建窗口
                        handleCreateModalOpen(true);
                    }}
                >
                    <PlusOutlined /> 新建
                </Button>
            );
        }
        if (props.handleBatchDelete) {
            buttons.push(
                <Popconfirm
                    title={`是否确认删除所选记录?`}
                    onConfirm={async () => {
                        const success = await handleBatchDelete();
                        if (success) {
                            tableRef.current?.reloadAndRest?.();
                        }
                    }}
                    placement="topRight"
                >
                    <Button
                        type="primary"
                        danger
                        disabled={selectedRowKeys.length === 0}
                    >
                        <DeleteOutlined /> 删除
                    </Button>
                </Popconfirm>
            );
        }
        if (props.toolBarButton) {
            buttons.push(props.toolBarButton);
        }
        return buttons;
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        if (props.rowSelectionCallBack) {
            props.rowSelectionCallBack(newSelectedRowKeys);
        }
    };

    const rowSelection = {
        type: props.rowSelectionType ? (props.rowSelectionType === 'none' ? undefined : props.rowSelectionType) : 'checkbox',
        alwaysShowAlert: true,
        onChange: onSelectChange,
    };

    let leftColSpan = props.leftColSpan || 0;
    let rightColSpan = props.rightColSpan || 0;
    const mainColSpan = [leftColSpan, 24 - leftColSpan - rightColSpan, rightColSpan];

    return (
        <PageContainer>
            <Row gutter={12}>
                <Col span={mainColSpan[0]}>
                    {props.leftContent && props.leftContent}
                </Col>
                <Col span={mainColSpan[1]}>
                    {/* 表格 */}
                    <ProTable<any, API.PageParams>
                        actionRef={tableRef}
                        headerTitle={props.title}
                        rowKey="id"
                        columns={props.columns}
                        request={props.handlePage}
                        pagination={props.pagination ? props.pagination : { pageSize: 10 }}
                        toolBarRender={toolBarRender}
                        rowSelection={props.rowSelectionType === 'none' ? undefined : rowSelection}
                        options={false}

                    />

                    {/* 新建窗口 */}
                    {createModalOpen && <ModalForm
                        formRef={props.formRef}
                        title={`新建${props.title}`}
                        width={props.formWidth ? props.formWidth : '80%'}
                        open={createModalOpen}
                        onOpenChange={handleCreateModalOpen}
                        onFinish={async (value) => {
                            // 提交数据
                            const success = await handleCreate(value);
                            // 提交成功
                            if (success) {
                                // 关闭新建窗口
                                handleCreateModalOpen(false);
                                // 刷新表格
                                if (tableRef.current) {
                                    tableRef.current.reload();
                                }
                            }
                        }}
                    >
                        {props.createForm}
                    </ModalForm>
                    }

                    {/* 编辑窗口 */}
                    {updateModalOpen && <ModalForm
                        formRef={props.formRef}
                        title={`编辑${props.title}`}
                        width={props.formWidth}
                        open={updateModalOpen}
                        onOpenChange={(visible) => {
                            if (visible == false) {
                                handleUpdateModalOpen(visible);
                                setCurrentRow(undefined);
                            }
                        }}
                        initialValues={currentRow || {}}
                        onFinish={async (value) => {
                            value.id = currentRow?.id;
                            const success = await handleUpdate(value);
                            if (success) {
                                handleUpdateModalOpen(false);
                                setCurrentRow(undefined);
                                if (tableRef.current) {
                                    tableRef.current.reload();
                                }
                            }
                        }}
                    >
                        {props.updateForm}
                    </ModalForm>
                    }
                </Col>
                <Col span={mainColSpan[2]}>
                    {props.rightContent && props.rightContent}
                </Col>
            </Row>

        </PageContainer>
    );
}

export default CRUD;