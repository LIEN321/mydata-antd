import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Form, Input, Switch, Table } from 'antd';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    /** 字段编号 */
    fieldCode: string;
    /** 字段名称 */
    fieldName: string;
    /** 接口字段 */
    apiField: string;
    /** 是否标识 */
    isId?: boolean;
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
    enableSwtichIdField: boolean,
}

// -------------------- 单元格 --------------------
const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    enableSwtichIdField,
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
        if (dataIndex === "isId") {
            return <Switch onChange={save} />
        }
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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

export interface FieldMappingDataType {
    key: React.Key;
    /** 字段编号 */
    fieldCode: string;
    /** 字段名称 */
    fieldName: string;
    /** 接口字段 */
    apiField: string;
    /** 是否标识 */
    isId?: boolean;
}

type ColumnTypes = Exclude<TableProps<FieldMappingDataType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 用户自定义属性列表 */
    fieldMappings: FieldMappingDataType[];
    /** 更新属性列表 */
    handleUpdateFieldMappings: (fieldMappings: FieldMappingDataType[]) => any;
    /** 是否启用切换id字段 */
    enableSwtichIdField?: boolean;
    /** 加载状态 */
    loading: boolean;
};

// -------------------- 表格 --------------------
const FieldMappingTable: React.FC<EditableTableProps> = (props) => {

    const [fieldMappings, setFieldMappings] = useState<FieldMappingDataType[]>(props.fieldMappings || []);

    const [count, setCount] = useState(fieldMappings.length);

    const { enableSwtichIdField } = props;

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '字段编号',
            dataIndex: 'fieldCode',
            width: 200,
            align: 'center',
            editable: false,
        },
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            width: 200,
            align: 'center',
            editable: false,
        },
        {
            title: '接口字段',
            dataIndex: 'apiField',
            width: 200,
            align: 'center',
            editable: true,
        },
    ];

    if (enableSwtichIdField === true) {
        defaultColumns.push({
            title: '是否标识',
            dataIndex: 'isId',
            width: 80,
            align: 'center',
            editable: true,
        });
    }

    useEffect(() => {
        let index = 0;
        if (fieldMappings && fieldMappings.length > 0) {
            fieldMappings.map(f => {
                f.key = index;
                index++;
            });
        }
    }, []);

    // 更新数据
    const handleSave = (row: FieldMappingDataType) => {
        const newData = [...fieldMappings];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setFieldMappings(newData);
        props.handleUpdateFieldMappings(newData);
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
            onCell: (record: FieldMappingDataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                enableSwtichIdField: enableSwtichIdField,
            }),
        };
    });

    return (
        <div>
            <Table<FieldMappingDataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={fieldMappings}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 500 }}
                size="small"
                loading={props.loading}
            />
        </div>
    );
};

export default FieldMappingTable;