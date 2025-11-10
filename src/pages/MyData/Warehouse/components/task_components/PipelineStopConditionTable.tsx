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
    /** 条件值 */
    v: string;
    /** 条件 */
    op: string;
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
}

// -------------------- 单元格 --------------------
const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    // 默认可编辑
    const [editing, setEditing] = useState(true);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    const opOptions: any[] = [
        { label: "=", value: "=" },
        { label: "!=", value: "!=" },
        { label: ">", value: ">" },
        { label: ">=", value: ">=" },
        { label: "<", value: "<" },
        { label: "<=", value: "<=" },
        { label: "not null", value: "nn" },
        { label: "not empty", value: "ne" },
        { label: "is null", value: "is null" },
        { label: "is empty", value: "is empty" },
    ];

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
            console.info("values = ", values);
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    const getInput = () => {
        if (dataIndex === "op") {
            return <Select
                defaultValue={"="}
                options={opOptions}
                onSelect={save}
            />
        }
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    };

    if (editable) {
        childNode = editing ? (
            (dataIndex === 'k' || dataIndex === 'op' || (dataIndex === 'v' && record.op !== '' && record.op !== 'nn' && record.op !== 'ne' && record.op !== 'is null' && record.op !== 'is empty')) ?
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

export interface ConditionType {
    key: React.Key;
    /** 字段名 */
    k: string;
    /** 条件之 */
    v: string;
    /** 条件 */
    op: string;
}

type ColumnTypes = Exclude<TableProps<ConditionType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 业务数据字段 */
    dataFields: API.DataFieldVO[];
    /** 用户自定义属性列表 */
    stopConditions: ConditionType[];
    /** 更新属性列表 */
    handleUpdateStopConditions: (stopConditions: ConditionType[]) => any;
    /** 加载状态 */
    loading: boolean;
};

// -------------------- 表格 --------------------
const PipelineStopConditionTable: React.FC<EditableTableProps> = (props) => {

    const [stopConditions, setStopConditions] = useState<ConditionType[]>(props.stopConditions || []);
    const [dataFields] = useState<API.DataFieldVO[]>(props.dataFields || []);

    const [count, setCount] = useState(stopConditions.length);

    useEffect(() => {
        let index = 0;
        if (stopConditions && stopConditions.length > 0) {
            stopConditions.map(f => {
                f.key = index;
                index++;
            });
        }
    }, []);

    // 新增行
    const handleAdd = () => {
        const newData: ConditionType = {
            key: count
            , k: ''
            , v: ''
            , op: '='
        };

        setStopConditions([...stopConditions, newData]);
        setCount(count + 1);
    };

    // 更新数据
    const handleSave = (row: ConditionType) => {
        const newData = [...stopConditions];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setStopConditions(newData);
        props.handleUpdateStopConditions(newData);
    };

    const handleDelete = (key: React.Key) => {
        const newData = stopConditions.filter((item) => item.key !== key);
        setStopConditions(newData);
        props.handleUpdateStopConditions(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '变量字段',
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
            title: '条件值（字符串请使用引号）',
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
            onCell: (record: ConditionType) => ({
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
            <Button icon={<PlusOutlined />} onClick={() => { handleAdd() }} type="primary" style={{ marginBottom: 16 }}>新增条件</Button>
            <Table<ConditionType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={stopConditions}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 500 }}
                size="small"
                loading={props.loading}
            />
        </div>
    );
};

export default PipelineStopConditionTable;