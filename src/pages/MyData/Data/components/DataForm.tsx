import { projectSelect } from "@/services/zhiwei/project";
import { ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import DataFieldTable from "../DataFieldTable";

export type DataFormProp = {
    loading: boolean;
    dataFields: any;
    setDataFields: (dataFields: any) => any;
    projectId?: any;
};

const DataForm: React.FC<DataFormProp> = (props) => {
    return (
        <>
            <Row gutter={24}>
                <Col span={8}>
                    <ProFormSelect
                        rules={[
                            {
                                required: true,
                                message: "请输入所属项目",
                            }
                        ]}
                        name="projectId"
                        label="所属项目"
                        placeholder="请输入所属项目"
                        request={projectSelect}
                        initialValue={props.projectId}
                    />
                </Col>
                <Col span={8}>
                    <ProFormText
                        rules={[
                            {
                                required: true,
                                message: "请输入数据编号",
                            }
                        ]}
                        name="dataCode"
                        label="数据编号"
                        placeholder="请输入数据编号"
                    />
                </Col>
                <Col span={8}>
                    <ProFormText
                        rules={[
                            {
                                required: true,
                                message: "请输入数据名称",
                            }
                        ]}
                        name="dataName"
                        label="数据名称"
                        placeholder="请输入数据名称"
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {props.loading && <p>加载中...</p>}
                    {/* 加载完成后再显示字段列表 */}
                    {!props.loading && <DataFieldTable
                        dataFields={props.dataFields}
                        handleUpdateDataFields={props.setDataFields}
                        loading={props.loading}
                    />
                    }
                </Col>
            </Row>
        </>
    );
};

export default DataForm;