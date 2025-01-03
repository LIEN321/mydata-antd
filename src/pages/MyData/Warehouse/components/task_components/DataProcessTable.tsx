import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Form, Input, Popconfirm, Select, Space, Table } from 'antd';
import { TASK_FILTER_TYPE_FIELD, TASK_FILTER_TYPE_VALUE } from '@/pages/MyData/mydata';
import { PlusOutlined } from '@ant-design/icons';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    /** 字段编号 */
    k: string;
    /** 处理方式 */
    op: string;
    /** 处理值 */
    v: string;
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
                options={[
                    {
                        label: "数字", title: "数字", options: [
                            { label: "+", value: "+" },
                            { label: "-", value: "-" },
                            { label: "*", value: "*" },
                            { label: "÷", value: "/" },
                        ]
                    },
                    {
                        label: "字符串", title: "字符串", options: [
                            { label: "md5", value: "md5" },
                            { label: "base64", value: "base64" },
                            { label: "前置添加", value: "prepend" },
                            { label: "后置追加", value: "append" },
                            { label: "置空(empty)", value: "empty" },
                            { label: "无效时置空(emptyIfNull)", value: "emptyIfNull" },
                        ]
                    },
                    {
                        label: "日期时间", title: "日期时间", options: [
                            { label: "增加秒数", value: "addSecond" },
                        ]
                    },
                    {
                        label: "通用", title: "通用", options: [
                            { label: "置空(null)", value: "null" },
                        ]
                    },
                ]}
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
            (dataIndex === 'k'
                || dataIndex === 'op'
                || (
                    dataIndex === 'v' && record.op !== ''
                    && record.op !== 'md5' && record.op !== 'base64' && record.op !== 'empty' && record.op !== 'emptyIfNull'
                    && record.op !== 'null'
                )
            ) ?
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[{
                        // required: ["code", "value"].indexOf(dataIndex) >= 0
                        required: false
                        , message: ''
                    }]}
                    initialValue={record[dataIndex]}
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

export interface DataProcessDataType {
    key: React.Key;
    /** 字段编号 */
    k: string;
    /** 处理方式 */
    op: string;
    /** 处理值 */
    v: string;
    /** 类型 */
    t: number;
}

type ColumnTypes = Exclude<TableProps<DataProcessDataType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 业务数据字段 */
    dataFields: API.DataFieldVO[];
    /** 用户自定义属性列表 */
    dataProcesses: DataProcessDataType[];
    /** 更新属性列表 */
    handleUpdateDataProcesses: (dataProcesses: DataProcessDataType[]) => any;
    /** 加载状态 */
    loading: boolean;
};

// -------------------- 表格 --------------------
const DataProcessTable: React.FC<EditableTableProps> = (props) => {

    const [dataProcesses, setDataProcesses] = useState<DataProcessDataType[]>(props.dataProcesses || []);
    const [dataFields] = useState<API.DataFieldVO[]>(props.dataFields || []);

    const [count, setCount] = useState(dataProcesses.length);

    useEffect(() => {
        let index = 0;
        if (dataProcesses && dataProcesses.length > 0) {
            dataProcesses.map(f => {
                f.key = index;
                index++;
            });
        }
    }, []);

    // 新增行
    const handleAdd = (type: number) => {
        const newData: DataProcessDataType = {
            key: count
            , k: ''
            , op: ''
            , v: ''
            , t: type
        };

        setDataProcesses([...dataProcesses, newData]);
        setCount(count + 1);
    };

    // 更新数据
    const handleSave = (row: DataProcessDataType) => {
        const newData = [...dataProcesses];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataProcesses(newData);
        props.handleUpdateDataProcesses(newData);
    };

    const handleDelete = (key: React.Key) => {
        const newData = dataProcesses.filter((item) => item.key !== key);
        setDataProcesses(newData);
        props.handleUpdateDataProcesses(newData);
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
            width: 150,
            align: 'center',
            editable: true,
        },
        {
            title: '处理方式',
            dataIndex: 'op',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '处理值',
            dataIndex: 'v',
            width: 150,
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
            onCell: (record: DataProcessDataType) => ({
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
                    数值运算
                </Button>
                <Button icon={<PlusOutlined />} onClick={() => { handleAdd(TASK_FILTER_TYPE_FIELD) }} type="primary" style={{ marginBottom: 16 }}>
                    字段之间运算
                </Button>
            </Space>
            <Table<DataProcessDataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataProcesses}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 500 }}
                size="small"
                loading={props.loading}
            />
        </div>
    );
};

export default DataProcessTable;