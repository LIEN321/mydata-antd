import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteData, deleteDatas, dataPage, saveData, dataDetail } from "@/services/zhiwei/data";
import { projectList, projectSelect } from "@/services/zhiwei/project";
import { ActionType, ProColumns, ProFormText, ProFormSelect, } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import DataFieldTable, { DataType } from "./DataFieldTable";

const Data: React.FC = () => {

    // 用户自定义字段列表
    const [dataFields, setDataFields] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false);

    // 表格列
    const columns: ProColumns<API.DataVO>[] = [
        {
            title: '所属项目',
            dataIndex: 'projectName',
            search: false,
        },
        {
            title: '数据编号',
            dataIndex: 'dataCode',
            search: true,
        },
        {
            title: '数据名称',
            dataIndex: 'dataName',
            search: true,
        },
        {
            title: '业务数据',
            dataIndex: 'dataCount',
            search: false,
        },
    ];

    const dataForm = <>
        <Row gutter={24}>
            <Col span={12}>
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
                />
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
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
            <Col span={12}>
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
                {loading && <p>加载中...</p>}
                {/* 加载完成后再显示字段列表 */}
                {!loading && <DataFieldTable
                    dataFields={dataFields}
                    handleUpdateDataFields={setDataFields}
                    loading={loading}
                />
                }
            </Col>
        </Row>
    </>;

    const tableRef = useRef<ActionType>();

    const handleOnClickCreateBtn = () => {
        setDataFields([]);
    }

    const handleOnClickEditBtn = async (record: any) => {
        setLoading(true);
        try {
            const response = await dataDetail({ id: record.id });
            if (response.success) {
                const dataFields = await response.data?.dataFields;
                if (dataFields) {
                    setDataFields(prevFields => {
                        return dataFields as DataType[]
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSaveOrUpdate = async (formData: any) => {
        const body = { ...formData, dataFields: dataFields };
        await saveData(body);
    }

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="标准数据"
                columns={columns}

                formWidth={1300}
                createForm={dataForm}
                updateForm={dataForm}

                handlePage={dataPage}
                handleCreate={handleSaveOrUpdate}
                handleUpdate={handleSaveOrUpdate}
                handleDelete={deleteData}
                handleBatchDelete={deleteDatas}

                onClickCreateBtn={handleOnClickCreateBtn}
                onClickEditBtn={handleOnClickEditBtn}
            />
        </>
    );
};

export default Data;