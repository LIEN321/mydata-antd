import { PageContainer, ProColumns } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import React from "react";
import CRUD_Simple from "./CRUD_Simple";

export type CRUDProps = {
    /** 是否显示面包屑 */
    showBreadcrumb?: boolean;
    /** 标题 */
    title: string | null;
    /** 搜索栏 */
    search?: any;
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

    /** 
     * 新建按钮点击事件
     */
    onClickCreateBtn?: () => any;
    /** 
     * 编辑按钮点击事件
     */
    onClickEditBtn?: (record: any) => any;
    /** 
     * 删除按钮点击事件
     */
    onClickDeleteBtn?: (record: any) => any;

    /** 左侧布局内容 */
    leftContent?: any;
    /** 左侧布局col span */
    leftColSpan?: number;
    /** 右侧布局内容 */
    rightContent?: any;
    /** 右侧布局col span */
    rightColSpan?: number;
    /** 表格上方内容 */
    upContent?: any;

    tableRef?: any;
};

const CRUD: React.FC<CRUDProps> = (props) => {
    let leftColSpan = props.leftColSpan || 0;
    let rightColSpan = props.rightColSpan || 0;
    const mainColSpan = [leftColSpan, 24 - leftColSpan - rightColSpan, rightColSpan];

    return (
        <PageContainer
            header={{
                breadcrumbRender: () => { return props.showBreadcrumb },
                title: props.title,
            }}
        >
            {props.upContent && props.upContent}
            <Row gutter={12}>
                <Col span={mainColSpan[0]}>
                    {props.leftContent && props.leftContent}
                </Col>
                <Col span={mainColSpan[1]}>
                    <CRUD_Simple
                        title={props.title}
                        search={props.search}
                        toolBarButton={props.toolBarButton}
                        rowSelectionCallBack={props.rowSelectionCallBack}
                        pagination={props.pagination}
                        columns={props.columns}
                        formWidth={props.formWidth}
                        optionWidth={props.optionWidth}
                        renderOptionButton={props.renderOptionButton}
                        createForm={props.createForm}
                        updateForm={props.updateForm}
                        formRef={props.formRef}
                        handlePage={props.handlePage}
                        handleCreate={props.handleCreate}
                        handleUpdate={props.handleUpdate}
                        handleDelete={props.handleDelete}
                        handleBatchDelete={props.handleBatchDelete}
                        onClickCreateBtn={props.onClickCreateBtn}
                        onClickEditBtn={props.onClickEditBtn}
                        onClickDeleteBtn={props.onClickDeleteBtn}
                        tableRef={props.tableRef} />
                </Col>
                <Col span={mainColSpan[2]}>
                    {props.rightContent && props.rightContent}
                </Col>
            </Row>

        </PageContainer>
    );
}

export default CRUD;