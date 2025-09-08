import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Form, Input, Popconfirm, Select, Space, Table } from 'antd';
import { TASK_FILTER_TYPE_FIELD, TASK_FILTER_TYPE_VALUE } from '@/pages/MyData/mydata';
import { PlusOutlined } from '@ant-design/icons';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    /** 字段名 */
    k: string;
    /** 条件之 */
    v: string;
    /** 条件 */
    op: string;
    /** 类型 */
    t: number;
}

interface EditableRowProps {
    index: number;
}

// -------------------- 表格行 --------------------
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
    dataFields: API.DataFieldVO[];
}

// -------------------- 单元格 --------------------
const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    dataFields,
    ...restProps
}) => {
    // 默认可编辑
    const [editing, setEditing] = useState(true);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    const dataFieldSelectOptions: any[] = [];
    if (dataFields) {
        dataFields.forEach(field => {
            dataFieldSelectOptions.push({ label: field.fieldName, value: field.fieldCode })
        });
    }

    const opOptions: any[] = [
        { label: "=", value: "=" },
        { label: "!=", value: "!=" },
        { label: ">", value: ">" },
        { label: ">=", value: ">=" },
        { label: "<", value: "<" },
        { label: "<=", value: "<=" },
    ];
    if (record && record.t === TASK_FILTER_TYPE_VALUE) {
        opOptions.push(
            { label: "not null", value: "nn" },
            { label: "not empty", value: "ne" });
    }

    useEffect(() => {
        if (editing) {
            // 取消输入框获取焦点 inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    const getInput = () => {
        if (dataIndex === "k") {
            return <Select options={dataFieldSelectOptions} onSelect={save} />
        }
        if (dataIndex === "op") {
            return <Select
                defaultValue={"="}
                options={opOptions}
                onSelect={save}
            />
        }
        if (dataIndex === "v" && record.t === TASK_FILTER_TYPE_FIELD) {
            return <Select options={dataFieldSelectOptions} onSelect={save} />
        }
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    };

    if (editable) {
        childNode = editing ? (
            (dataIndex === 'k' || dataIndex === 'op' || (dataIndex === 'v' && record.op !== '' && record.op !== 'nn' && record.op !== 'ne') || record.t === TASK_FILTER_TYPE_FIELD) ?
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[{
                        // required: ["code", "value"].indexOf(dataIndex) >= 0
                        required: false
                        , message: ''
                    }]}
                    initialValue={record[dataIndex]}
                    layout="vertical"
                >
                    {getInput()}
                </Form.Item>
                : <></>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingInlineEnd: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export interface DataFilterDataType {
    key: React.Key;
    /** 字段名 */
    k: string;
    /** 条件之 */
    v: string;
    /** 条件 */
    op: string;
    /** 类型 */
    t: number;
}

type ColumnTypes = Exclude<TableProps<DataFilterDataType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 业务数据字段 */
    dataFields: API.DataFieldVO[];
    /** 用户自定义属性列表 */
    dataFilters: DataFilterDataType[];
    /** 更新属性列表 */
    handleUpdateDataFilters: (dataFilters: DataFilterDataType[]) => any;
    /** 加载状态 */
    loading: boolean;
};

// -------------------- 表格 --------------------
const DataFilterTable: React.FC<EditableTableProps> = (props) => {

    const [dataFilters, setDataFilters] = useState<DataFilterDataType[]>(props.dataFilters || []);
    const [dataFields] = useState<API.DataFieldVO[]>(props.dataFields || []);

    const [count, setCount] = useState(dataFilters.length);

    useEffect(() => {
        let index = 0;
        if (dataFilters && dataFilters.length > 0) {
            dataFilters.map(f => {
                f.key = index;
                index++;
            });
        }
    }, []);

    // 新增行
    const handleAdd = (type: number) => {
        const newData: DataFilterDataType = {
            key: count
            , k: ''
            , v: ''
            , op: '='
            , t: type
        };

        setDataFilters([...dataFilters, newData]);
        setCount(count + 1);
    };

    // 更新数据
    const handleSave = (row: DataFilterDataType) => {
        const newData = [...dataFilters];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataFilters(newData);
        props.handleUpdateDataFilters(newData);
    };

    const handleDelete = (key: React.Key) => {
        const newData = dataFilters.filter((item) => item.key !== key);
        setDataFilters(newData);
        props.handleUpdateDataFilters(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '数据字段',
            dataIndex: 'k',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '条件',
            dataIndex: 'op',
            width: 100,
            align: 'center',
            editable: true,
        },
        {
            title: '条件值',
            dataIndex: 'v',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            width: 60,
            render: (_, record) =>
                <Popconfirm title="确认删除吗?" onConfirm={() => handleDelete(record.key)}>
                    <a>删除</a>
                </Popconfirm>
        },
    ];

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataFilterDataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                dataFields: dataFields,
            }),
        };
    });

    return (
        <div>
            <Space>
                <Button icon={<PlusOutlined />} onClick={() => { handleAdd(TASK_FILTER_TYPE_VALUE) }} type="primary" style={{ marginBottom: 16 }}>
                    值条件
                </Button>
                <Button icon={<PlusOutlined />} onClick={() => { handleAdd(TASK_FILTER_TYPE_FIELD) }} type="primary" style={{ marginBottom: 16 }}>
                    字段对比
                </Button>
            </Space>
            <Table<DataFilterDataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataFilters}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 500 }}
                size="small"
                loading={props.loading}
            />
        </div>
    );
};

export default DataFilterTable;