import { getAccessToken } from "@/utils/authority";
import { Button, Card, Col, Divider, Form, Icon, Input, message, Modal, Popconfirm, Result, Row, Steps, Table } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { connect } from "dva";
import React, { PureComponent } from "react";
import ExcelFieldMappingTable from "./ExcelFieldMappingTable";
import { saveBizData } from "@/services/data";

const { Step } = Steps;

@connect(({ data, loading }) => ({
    data,
    loading: loading.models.data,
}))
@Form.create()
class ImportExcelForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            current: 0,
            fileList: [],
            fileName: null,
            headerNames: [],

            fieldMapping: {},
        };
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    handleUploadChange = info => {
        let fileList = [...info.fileList];
        //截取最后一个文件
        fileList = fileList.slice(-1);
        this.setState({ fileList });

        const { status, response } = info.file;
        console.info(response);
        if (!response) { return; }
        const { success, data } = response;
        if (success) {
            message.success(`${info.file.name} 文件上传成功`);
            const { fileName, headerNames } = data;
            this.setState({ fileName, headerNames });
            this.next();
        } else {
            message.error(`${info.file.name} 文件上传失败`);
        }
    };

    handleSaveMapping = mapping => {
        const { fieldMapping } = this.state;
        const key = mapping.dataFieldCode;
        if (key && mapping.headerName) {
            fieldMapping[key] = mapping.headerName;
        } else {
            delete fieldMapping[key];
        }
        this.setState({ fieldMapping });
    };

    handleSaveData = () => {
        const {
            projectId,
            envId,
            currentData
        } = this.props;

        const params = {
            projectId,
            envId,
            dataId: currentData.id,
            fileName: this.state.fileName,
            fieldMapping: this.state.fieldMapping
        };

        saveBizData(params).then(resp => {
            this.setState({ success: resp.success, message: resp.msg });
            this.next();
            // if (resp.success) {
            //     message.info(resp.msg);
            //     this.props.onClose();
            // } else {
            //     message.error(resp.msg);
            // }
        });
    }

    render() {
        const {
            form,
            loading,
            visible,
            dataFieldList,
            projectId,
            envId,
            currentData
        } = this.props;

        const { current, success } = this.state;

        const steps = [
            {
                title: '上传Excel',
            },
            {
                title: '匹配字段',
            },
            {
                title: '上传结果',
            },
        ];

        const draggerProps = {
            name: 'file',
            multiple: false,
            accept: ".xls,.xlsx",
            action: '/api/mydata-manage/biz_data/upload_excel',
            headers: {
                'blade-auth': 'bearer ' + getAccessToken()
            },
            onChange: this.handleUploadChange,
        };

        return (
            <Modal
                title={`导入Excel数据 - ${currentData.dataName}`}
                width="50%"
                visible={visible}
                footer={
                    [
                        <div className="steps-action">
                            {current > 0 && (
                                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                    上一步
                                </Button>
                            )}
                            {current == 0 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    下一步
                                </Button>
                            )}
                            {current == 1 && (
                                <Button type="primary" onClick={() => this.handleSaveData()}>
                                    开始上传
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" onClick={this.props.onClose}>
                                    完成
                                </Button>
                            )}
                        </div>
                    ]}
                onCancel={this.props.onClose}
                bodyStyle={{ padding: 24 }}
            >
                <Card>
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div className="steps-content" style={{marginTop:24}}>
                        {/* 第一步：上传excel文件 */}
                        {current === 0 && (<>
                            <Dragger {...draggerProps} fileList={this.state.fileList}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">点击这里 或 直接拖入文件</p>
                                <p className="ant-upload-hint">
                                    上传一个Excel文件，开始导入数据
                                </p>
                            </Dragger>
                        </>)}
                        {/* 第二步：配置字段映射 */}
                        {current === 1 && (<>
                            <ExcelFieldMappingTable
                                dataFieldList={dataFieldList}
                                handleSave={this.handleSaveMapping}
                                headerNames={this.state.headerNames}
                            />
                        </>)}
                        {/* 第三步：导入数据 */}
                        {current === 2 && (<>
                            {success ? <Result status="success" title="导入成功！" /> : <Result status="error" title="导入失败！" subTitle={this.state.message} />}
                        </>)}
                    </div>
                </Card>
            </Modal >
        );
    }
}

export default ImportExcelForm;