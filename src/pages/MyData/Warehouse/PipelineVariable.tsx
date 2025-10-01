import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Form, Input, Popconfirm, Select, Space, Switch, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    /** 变量编号 */
    varCode: string;
    /** 变量值 */
    varValue: string;
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
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    };

    if (editable) {
        childNode = editing ? (
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

export interface PipelineVariablesDataType {
    key: React.Key;
    /** 变量编号 */
    varCode: string;
    /** 变量值 */
    varValue: string;
}

type ColumnTypes = Exclude<TableProps<PipelineVariablesDataType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 业务数据字段 */
    pipelineVariables: PipelineVariablesDataType[];
    /** 更新属性列表 */
    handleUpdatePipelineVariables: (pipelineVariables: PipelineVariablesDataType[]) => any;
    /** 加载状态 */
    loading: boolean;
};

// -------------------- 表格 --------------------
const PipelineVariables: React.FC<EditableTableProps> = (props) => {

    const [pipelineVariables, setPipelineVariables] = useState<PipelineVariablesDataType[]>(props.pipelineVariables || []);
    const [count, setCount] = useState(pipelineVariables.length);

    useEffect(() => {
        let index = 0;
        if (pipelineVariables && pipelineVariables.length > 0) {
            pipelineVariables.map(f => {
                f.key = index;
                index++;
            });
        }
    }, []);

    // 新增行
    const handleAdd = () => {
        const newData: PipelineVariablesDataType = {
            key: count
            , varCode: ''
            , varValue: ''
        };

        setPipelineVariables([...pipelineVariables, newData]);
        setCount(count + 1);
    };

    // 更新数据
    const handleSave = (row: PipelineVariablesDataType) => {
        const newData = [...pipelineVariables];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setPipelineVariables(newData);
        props.handleUpdatePipelineVariables(newData);
    };

    const handleDelete = (key: React.Key) => {
        const newData = pipelineVariables.filter((item) => item.key !== key);
        setPipelineVariables(newData);
        props.handleUpdatePipelineVariables(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '变量名',
            dataIndex: 'varCode',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '变量值',
            dataIndex: 'varValue',
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
            onCell: (record: PipelineVariablesDataType) => ({
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
            <Space>
                <Button icon={<PlusOutlined />} onClick={() => { handleAdd() }} type="primary" style={{ marginBottom: 16 }}>
                    添加变量
                </Button>
            </Space>
            <Table<PipelineVariablesDataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={pipelineVariables}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 500 }}
                size="small"
                loading={props.loading}
            />
        </div>
    );
};

export default PipelineVariables;