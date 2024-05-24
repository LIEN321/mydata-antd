import { Button, Col, Divider, Form, Icon, Input, message, Modal, Popconfirm, Row, Table } from "antd";
import { connect } from "dva";
import React, { PureComponent } from "react";
import { BIZ_FIELD_LIST, BIZ_DATA_LIST } from '../../../actions/data';
import { deleteBizDataByEnv, exportBizData } from '../../../services/data';
import Grid from "@/components/Sword/Grid";
import { getAccessToken } from '../../../utils/authority';
import { stringify } from 'qs';
import ImportExcelForm from "./ImportExcelForm";

const FormItem = Form.Item;

@connect(({ data, loading }) => ({
    data,
    loading: loading.models.data,
}))
@Form.create()
class BizData extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            pagination: {},
            importModalVisible: false,
        };

        const { dispatch, projectId, envId, currentData } = this.props;
        dispatch(BIZ_FIELD_LIST({ dataId: currentData.id }));
        // dispatch(BIZ_DATA_LIST({ dataId: currentData.id, projectId, envId }));
    }

    handleSearchBizData = (pagination) => {
        const { dispatch, projectId, envId, currentData } = this.props;
        dispatch(BIZ_DATA_LIST({ ...pagination, dataId: currentData.id, projectId, envId }));
        this.setState({ pagination });
    };

    handleDeleteBizData = () => {
        const { currentData, envId } = this.props;
        deleteBizDataByEnv({ dataId: currentData.id, envId }).then(resp => {
            if (resp.success) {
                message.info(resp.msg);
                this.handleSearchBizData(this.state.pagination);
                // this.props.onClose();
            } else {
                message.error(resp.msg);
            }
        });
    };

    handleShowImport = () => {
        this.setState({ importModalVisible: true });
    }

    handleCloseBizData = () => {
        this.setState({ importModalVisible: false });
        this.handleSearchBizData(this.state.pagination);
    }

    // ============ 查询表单 ===============
    renderSearchForm = onReset => {
        const {
            form,
            data: { bizFields },
        } = this.props;
        const { getFieldDecorator } = form;

        const { projectId, envId, currentData } = this.props;
        const { pagination } = this.state;
        const params = { ...pagination, dataId: currentData.id, projectId, envId };

        return (
            <Row>
                <Col span={18}>
                    {bizFields && bizFields.map(f => {
                        if (f.isId === 1) {
                            return <div style={{ width: 200, float: 'left' }}><FormItem label={f.fieldName} style={{ marginBottom: 0 }}>
                                {
                                    getFieldDecorator(`${f.fieldCode}`, {})(<Input />)
                                }
                            </FormItem></div>
                        }
                    })}
                    <div style={{ float: 'left' }}>
                        <span style={{ marginLeft: 12 }}></span>
                        <Button type="primary" htmlType="submit">筛选</Button>
                        <Button style={{ marginLeft: 8 }} onClick={onReset}>重置</Button>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{ float: 'right' }}>
                        <Button type="primary" icon="import" onClick={this.handleShowImport}>导入Excel</Button>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确认导出当前数据吗？"
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            placement="topRight"
                            onConfirm={() => {
                                window.open(`/api/mydata-manage/biz_data/export_excel?blade-auth=bearer ${getAccessToken()}&${stringify(params)}`);
                            }}
                        >
                            <Button type="primary" icon="download">导出Excel</Button>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="删除数据是不可逆操作，确认要删除吗？"
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            placement="topRight"
                            onConfirm={this.handleDeleteBizData}
                        >
                            <Button type='danger' icon="delete">全部删除</Button>
                        </Popconfirm>
                    </div>
                </Col>
            </Row>
        );
    };

    render() {
        const {
            form,
            loading,
            data: { bizFields, bizData },
            projectId,
            envId,
            visible,
            currentData
        } = this.props;

        const { importModalVisible } = this.state;

        const bizDataColumns = [];
        if (bizFields) {
            for (let i = 0; i < bizFields.length; i++) {
                const field = bizFields[i];
                bizDataColumns.push({
                    title: field.fieldName,
                    dataIndex: field.fieldCode,
                });
            }
        }
        bizDataColumns.push({
            title: "最后更新时间",
            dataIndex: "_MD_UPDATE_TIME_"
        });

        return (
            <>
                <Modal
                    title={`业务数据 - ${currentData.dataName}`}
                    width="90%"
                    visible={visible}
                    footer={[
                        <Button key="back" onClick={this.props.onClose}>
                            关闭
                        </Button>
                    ]}
                    onCancel={this.props.onClose}
                    bodyStyle={{ padding: 0 }}
                >
                    <Grid
                        form={form}
                        onSearch={this.handleSearchBizData}
                        renderSearchForm={this.renderSearchForm}
                        loading={loading}
                        data={bizData}
                        columns={bizDataColumns}
                        // actionColumnWidth={250}
                        enableRowSelection={false}
                    />
                </Modal>
                {importModalVisible && <ImportExcelForm
                    visible={importModalVisible}
                    projectId={projectId}
                    envId={envId}
                    currentData={currentData}
                    dataFieldList={bizFields}
                    onClose={this.handleCloseBizData}
                />}
            </>
        );
    }
}

export default BizData;