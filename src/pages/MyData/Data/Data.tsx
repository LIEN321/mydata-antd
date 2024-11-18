import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteData, deleteDatas, dataPage, saveData, dataDetail } from "@/services/zhiwei/data";
import { projectList, projectSelect } from "@/services/zhiwei/project";
import { ActionType, ProColumns, ProFormText, ProFormSelect, } from "@ant-design/pro-components";
import { Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import DataFieldTable, { DataFieldDataType } from "./DataFieldTable";
import DataForm from "./components/DataForm";

const Data: React.FC = () => {

    // 用户自定义字段列表
    const [dataFields, setDataFields] = useState<DataFieldDataType[]>([]);
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

    const dataForm = <DataForm loading={loading} dataFields={dataFields} setDataFields={setDataFields} />;

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
                        return dataFields as DataFieldDataType[]
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