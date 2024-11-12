import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Checkbox, Divider, Form, Input, Popconfirm, Radio, Select, Switch, Table } from 'antd';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    /** 参数名 */
    k: string;
    /** 参数值 */
    v: string;
    /** 描述 */
    desc: string;
    /** 是否启用 */
    enable: boolean;
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
        if (dataIndex == "enable") {
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
                    required: ["k", "v"].indexOf(dataIndex) >= 0
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
    /** 参数名 */
    k: string;
    /** 参数值 */
    v: string;
    /** 描述 */
    desc: string;
    /** 是否启用 */
    enable: boolean;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 参数列表 */
    params: DataType[];
    /** 更新属性列表 */
    handleUpdateParams: (dataFields: DataType[]) => any;
    /** 加载状态 */
    loading?: boolean;
};

// -------------------- 表格 --------------------
const ApiParamsTable: React.FC<EditableTableProps> = (props) => {
    const [params, setParams] = useState<DataType[]>(props.params);

    const [count, setCount] = useState(props.params.length);

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '参数名',
            dataIndex: 'k',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '参数值',
            dataIndex: 'v',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '描述',
            dataIndex: 'desc',
            width: 130,
            align: 'center',
            editable: true,
        },
        {
            title: '启用',
            dataIndex: 'enable',
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
                params.length >= 1 ? (
                    <Popconfirm title="确认删除该字段?" onConfirm={() => handleDelete(record.key)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    useEffect(() => {
        var index = 0;
        if (params && params.length > 0) {
            params.map(f => {
                f.key = index;
                index++;
            });
        }
    }, []);

    // 新增行
    const handleAdd = () => {
        const newData: DataType = {
            key: count
            , k: ''
            , v: ''
            , desc: ''
            , enable: true
        };

        setParams([...params, newData]);
        setCount(count + 1);
    };

    // 更新数据
    const handleSave = (row: DataType) => {
        const newData = [...params];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setParams(newData);
        props.handleUpdateParams(newData);
    };

    const handleDelete = (key: React.Key) => {
        const newData = params.filter((item) => item.key !== key);
        setParams(newData);
        props.handleUpdateParams(newData);
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
                    添加
                </Button>
            </Fragment>
            <Table<DataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={params}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 300 }}
                size="small"
                loading={props.loading}
            />
        </div>
    );
};

export default ApiParamsTable;