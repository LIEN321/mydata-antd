import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Checkbox, Divider, Form, Input, Popconfirm, Radio, Select, Switch, Table } from 'antd';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    /** 字段编号 */
    fieldCode: string;
    /** 字段名称 */
    fieldName: string;
    /** 数据类型 */
    fieldType: string;
    /** 默认值 */
    defaultValue: string;
    /** 是否标识 */
    isId?: boolean;
    /** 显示模式 */
    displayMode?: number;
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
        if (dataIndex == "fieldType") {
            return <Select
                defaultValue="String"
                options={[
                    { value: "default", label: "默认" }
                    , { value: "number", label: "数值" }
                    , { value: "int", label: "整数" }
                    , { value: "string", label: "字符串" }
                    , { value: "date", label: "日期时间" }
                ]}
                onSelect={save}
            />
        } else if (dataIndex == "isId") {
            return <Switch onChange={save} />
        } else if (dataIndex == "displayMode") {
            return <Switch onChange={save} />
        } else {
            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        }
    };

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[{
                    required: ["fieldCode", "fieldName"].indexOf(dataIndex) >= 0
                    , message: ''
                }]}
                initialValue={record[dataIndex]}
            >
                {getInput()}
            </Form.Item>
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

export interface DataType {
    key: React.Key;
    /** 字段编号 */
    fieldCode: string;
    /** 字段名称 */
    fieldName: string;
    /** 数据类型 */
    fieldType: string;
    /** 默认值 */
    defaultValue: string;
    /** 是否标识 */
    isId?: boolean;
    /** 显示模式 */
    displayMode?: number;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 用户自定义属性列表 */
    dataFields: DataType[];
    /** 更新属性列表 */
    handleUpdateDataFields: (dataFields: DataType[]) => any;
    /** 加载状态 */
    loading: boolean;
};

// -------------------- 表格 --------------------
const DataFieldTable: React.FC<EditableTableProps> = (props) => {
    const [dataFields, setDataFields] = useState<DataType[]>(props.dataFields);

    const [count, setCount] = useState(props.dataFields.length);

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '字段编号',
            dataIndex: 'fieldCode',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '数据类型',
            dataIndex: 'fieldType',
            width: 130,
            align: 'center',
            editable: true,
        },
        {
            title: '默认值',
            dataIndex: 'defaultValue',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '是否标识',
            dataIndex: 'isId',
            width: 80,
            align: 'center',
            editable: true,
        },
        {
            title: '显示模式',
            dataIndex: 'displayMode',
            width: 80,
            align: 'center',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            width: 60,
            render: (_, record) =>
                dataFields.length >= 1 ? (
                    <Popconfirm title="确认删除该字段?" onConfirm={() => handleDelete(record.key)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    useEffect(() => {
        var index = 0;
        if (dataFields && dataFields.length > 0) {
            dataFields.map(f => {
                f.key = index;
                index++;
            });
        }
    }, []);

    // 新增行
    const handleAdd = () => {
        const newData: DataType = {
            key: count
            , fieldCode: ''
            , fieldName: ''
            , fieldType: 'default'
            , defaultValue: ''
        };

        setDataFields([...dataFields, newData]);
        setCount(count + 1);
    };

    // 更新数据
    const handleSave = (row: DataType) => {
        const newData = [...dataFields];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataFields(newData);
        props.handleUpdateDataFields(newData);
    };

    const handleDelete = (key: React.Key) => {
        const newData = dataFields.filter((item) => item.key !== key);
        setDataFields(newData);
        props.handleUpdateDataFields(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <div>
            <Fragment>
                <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    添加字段
                </Button>
                {/* <Divider type="vertical" />
                <Switch /> 启用多字段组合标识 */}
            </Fragment>
            <Table<DataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataFields}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 500 }}
                size="small"
                loading={props.loading}
            />
        </div>
    );
};

export default DataFieldTable;