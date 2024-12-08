import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Checkbox, Divider, Form, Input, InputNumber, Popconfirm, Radio, Select, Switch, Table } from 'antd';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    /** 参数名 */
    code: string;
    /** 参数值 */
    value: string;
    /** 变化方式 */
    op: string;
    /** 递增值 */
    step?: number;
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
        if (dataIndex == "op") {
            return <Radio.Group
                optionType="button"
                defaultValue={"fix"}
                options={[
                    { label: "固定", value: "fix" },
                    { label: "递增", value: "inc" },
                ]}
                onChange={save}
            />
        }
        else if (dataIndex == "step") {
            return <InputNumber onPressEnter={save} onBlur={save} />;
        }
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    };

    if (editable) {
        console.info(dataIndex, record.op);
        childNode = editing ? (
            (dataIndex !== "step" || record.op === "inc") ?
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

export interface BatchParamDataType {
    key: React.Key;
    /** 参数名 */
    code: string;
    /** 参数值 */
    value: string;
    /** 变化方式 */
    op: string;
    /** 递增值 */
    step?: number;
}

type ColumnTypes = Exclude<TableProps<BatchParamDataType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 用户自定义属性列表 */
    batchParams: BatchParamDataType[];
    /** 更新属性列表 */
    handleUpdateBatchParams: (batchParams: BatchParamDataType[]) => any;
    /** 加载状态 */
    loading: boolean;
};

// -------------------- 表格 --------------------
const BatchParamTable: React.FC<EditableTableProps> = (props) => {

    const [batchParams, setBatchParams] = useState<BatchParamDataType[]>(props.batchParams || []);

    const [count, setCount] = useState(batchParams.length);

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '参数名',
            dataIndex: 'code',
            width: 150,
            align: 'center',
            editable: true,
        },
        {
            title: '参数值',
            dataIndex: 'value',
            width: 150,
            align: 'center',
            editable: true,
        },
        {
            title: '变化方式',
            dataIndex: 'op',
            width: 150,
            align: 'center',
            editable: true,
        },
        {
            title: '递增值',
            dataIndex: 'step',
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

    useEffect(() => {
        let index = 0;
        if (batchParams && batchParams.length > 0) {
            batchParams.map(f => {
                f.key = index;
                index++;
            });
        }
    }, []);

    // 新增行
    const handleAdd = () => {
        const newData: BatchParamDataType = {
            key: count
            , code: ''
            , value: ''
            , op: 'fix'
            , step: 1
        };

        setBatchParams([...batchParams, newData]);
        setCount(count + 1);
    };

    // 更新数据
    const handleSave = (row: BatchParamDataType) => {
        const newData = [...batchParams];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setBatchParams(newData);
        props.handleUpdateBatchParams(newData);
    };

    const handleDelete = (key: React.Key) => {
        const newData = batchParams.filter((item) => item.key !== key);
        setBatchParams(newData);
        props.handleUpdateBatchParams(newData);
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
            onCell: (record: BatchParamDataType) => ({
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
            <Table<BatchParamDataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={batchParams}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 500 }}
                size="small"
                loading={props.loading}
            />
        </div>
    );
};

export default BatchParamTable;