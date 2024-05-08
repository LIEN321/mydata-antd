import { Button, Col, Icon, message, Modal, Popconfirm, Row, Table } from "antd";
import { connect } from "dva";
import React, { PureComponent } from "react";
import { BIZ_FIELD_LIST, BIZ_DATA_LIST } from '../../../actions/data';
import { deleteBizDataByEnv } from '../../../services/data';

@connect(({ data, loading }) => ({
    data,
    loading: loading.models.data,
}))
class BizData extends PureComponent {
    constructor(props) {
        super(props);

        const { dispatch, projectId, envId, currentData } = this.props;
        dispatch(BIZ_FIELD_LIST({ dataId: currentData.id }));
        dispatch(BIZ_DATA_LIST({ dataId: currentData.id, projectId, envId }));
    }

    handleSearchBizData = (pagination) => {
        const { dispatch, projectId, envId, currentData } = this.props;
        dispatch(BIZ_DATA_LIST({ ...pagination, dataId: currentData.id, projectId, envId }));
    };

    handleDeleteBizData = () => {
        const { currentData, envId } = this.props;
        deleteBizDataByEnv({ dataId: currentData.id, envId }).then(resp => {
            if (resp.success) {
                message.info(resp.msg);
                this.props.onClose();
            } else {
                message.error(resp.msg);
            }
        });
    };

    render() {
        const {
            loading,
            data: { bizField, bizData },
            projectId,
            visible,
            currentData
        } = this.props;

        const bizDataColumns = [];
        if (bizField) {
            for (let i = 0; i < bizField.length; i++) {
                const field = bizField[i];
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
            >
                <Row justify='end' style={{ marginBottom: 12 }}>
                    <Col>
                        <div style={{ float: 'right' }}>
                            <Popconfirm
                                title="删除数据是不可逆操作，确认要删除吗？"
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                onConfirm={this.handleDeleteBizData}
                            >
                                <Button type='danger'>全部删除</Button>
                            </Popconfirm>
                        </div>
                    </Col>
                </Row>
                <Table
                    columns={bizDataColumns}
                    dataSource={bizData.list}
                    pagination={bizData.pagination}
                    onChange={this.handleSearchBizData}
                    size="small"
                />
            </Modal>
        );
    }
}

export default BizData;