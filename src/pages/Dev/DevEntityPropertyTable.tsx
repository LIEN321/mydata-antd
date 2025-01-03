import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Divider, Form, Input, Popconfirm, Radio, Select, Switch, Table } from 'antd';

export const IdEntityProperties: DataType[] = [
    { key: '0', code: 'id', name: '主键id', type: 'Long', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
];

export const BaseEntityProperties: DataType[] = [...IdEntityProperties
    , { key: '1', code: 'createUser', name: '创建人id', type: 'Long', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '2', code: 'createTime', name: '创建时间', type: 'Date', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '3', code: 'createDepartment', name: '创建部门id', type: 'Long', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '4', code: 'updateUser', name: '更新人id', type: 'Long', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '5', code: 'updateTime', name: '更新时间', type: 'Date', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '6', code: 'updateDepartment', name: '更新部门id', type: 'Long', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '7', code: 'status', name: '状态', type: 'Integer', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '8', code: 'isDeleted', name: '删除标记', type: 'Integer', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
];

export const TreeEntityProperties: DataType[] = [...BaseEntityProperties
    , { key: '9', code: 'parentId', name: '父记录id', type: 'Long', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '10', code: 'idTreePath', name: 'id层级路径', type: 'String', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
    , { key: '11', code: 'isLeaf', name: '是否叶子节点', type: 'Integer', isList: false, isSearch: false, searchType: 'like', isForm: false, formComponent: 'date', isRequired: false }
]

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    /** 属性编号 */
    code: string;
    /** 属性名称 */
    name: string;
    /** 属性类型 */
    type: string;
    /** 是否显示在列表 */
    isList?: boolean;
    /** 是否作为查询条件 */
    isSearch?: boolean;
    /** 查询类型 */
    searchType?: string;
    /** 是否显示在表单 */
    isForm?: boolean;
    /** 表单组件 */
    formComponent?: string;
    /** 是否必填 */
    isRequired?: boolean;
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

            // 取消切换编辑状态 toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    const getInput = () => {
        if (dataIndex === "type") {
            return <Select
                defaultValue="String"
                options={[
                    { value: "String", label: "String" }
                    , { value: "Long", label: "Long" }
                    , { value: "Integer", label: "Integer" }
                    , { value: "Date", label: "Date" }
                    , { value: "Double", label: "Double" }
                    , { value: "Boolean", label: "Boolean" }
                    , { value: "BigDecimal", label: "BigDecimal" }
                ]}
                onSelect={save}
            />
        } else if (dataIndex === "isList") {
            return <Switch onChange={save} />
        } else if (dataIndex === "isSearch") {
            return <Switch onChange={save} />
        } else if (dataIndex === "searchType") {
            return <Select
                defaultValue=""
                options={[
                    { value: "eq", label: "等于(=)" }
                    , { value: "like", label: "模糊(like)" }
                    // , { value: "between", label: "介于(between)" }
                    , { value: "ne", label: "不等于(ne)" }
                    , { value: "gt", label: "大于(gt)" }
                    , { value: "ge", label: "大于等于(ge)" }
                    , { value: "lt", label: "小于(lt)" }
                    , { value: "le", label: "小于等于(le)" }
                    , { value: "likeLeft", label: "左模糊(%like)" }
                    , { value: "likeRight", label: "右模糊(like%)" }
                ]}
                onSelect={save}
            />
        } else if (dataIndex === "isForm") {
            return <Switch onChange={save} />
        } else if (dataIndex === "formComponent") {
            return <Select
                defaultValue=""
                options={[
                    { value: "input", label: "单行文本" }
                    , { value: "textArea", label: "多行文本" }
                    , { value: "date", label: "日期" }
                    , { value: "time", label: "时间" }
                    , { value: "select", label: "下拉框" }
                    , { value: "treeSelect", label: "树型下拉框" }
                    , { value: "radio", label: "单选框" }
                    , { value: "checkbox", label: "多选框" }
                    , { value: "switch", label: "开关" }
                ]}
                onChange={save}
            />
        } else if (dataIndex === "isRequired") {
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
                    required: ["code", "name"].indexOf(dataIndex) >= 0
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
    /** 属性编号 */
    code: string;
    /** 属性名称 */
    name: string;
    /** 属性类型 */
    type: string;
    /** 是否显示在列表 */
    isList?: boolean;
    /** 是否作为查询条件 */
    isSearch?: boolean;
    /** 查询类型 */
    searchType?: string;
    /** 是否显示在表单 */
    isForm?: boolean;
    /** 表单组件 */
    formComponent?: string;
    /** 是否必填 */
    isRequired?: boolean;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

// -------------------- 表格属性 --------------------
export type EditableTableProps = {
    /** 用户自定义属性列表 */
    properties: DataType[];
    /** 更新属性列表 */
    handleUpdateProperties: (properties: DataType[]) => any;

    /** 继承模式 */
    extendMode: string;
    /** 更新继承模式 */
    handleUpdateExtendMode: (extendMode: string) => any;
};

// -------------------- 表格 --------------------
const DevEntityPropertyTable: React.FC<EditableTableProps> = (props) => {
    const [properties, setProperties] = useState<DataType[]>(props.properties);

    const [count, setCount] = useState(props.properties.length);

    // 新增行
    const handleAdd = () => {
        const newData: DataType = {
            key: count
            , code: ''
            , name: ''
            , type: 'String',
        };

        setProperties([...properties, newData]);
        setCount(count + 1);
    };

    // 更新数据
    const handleSave = (row: DataType) => {
        const newData = [...properties];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setProperties(newData);
        props.handleUpdateProperties(newData);
    };

    const handleDelete = (key: React.Key) => {
        const newData = properties.filter((item) => item.key !== key);
        setProperties(newData);
        props.handleUpdateProperties(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '属性编号',
            dataIndex: 'code',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '属性名称',
            dataIndex: 'name',
            width: 200,
            align: 'center',
            editable: true,
        },
        {
            title: '属性类型',
            dataIndex: 'type',
            width: 130,
            align: 'center',
            editable: true,
        },
        {
            title: '列表显示',
            dataIndex: 'isList',
            width: 80,
            align: 'center',
            editable: true,
        },
        {
            title: '查询条件',
            dataIndex: 'isSearch',
            width: 80,
            align: 'center',
            editable: true,
        },
        {
            title: '查询类型',
            dataIndex: 'searchType',
            width: 150,
            align: 'center',
            editable: true,
        },
        {
            title: '表单显示',
            dataIndex: 'isForm',
            width: 80,
            align: 'center',
            editable: true,
        },
        {
            title: '表单组件',
            dataIndex: 'formComponent',
            width: 130,
            align: 'center',
            editable: true,
        },
        {
            title: '是否必填',
            dataIndex: 'isRequired',
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
                properties.length >= 1 ? (
                    <Popconfirm title="确认删除该属性吗?" onConfirm={() => handleDelete(record.key)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

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
                    添加属性
                </Button>
                <Divider type="vertical" />
                继承实体：
                <Radio.Group
                    options={[
                        { label: '简易 (IdEntity)', value: 'id' }
                        , { label: '通用 (BaseEntity)', value: 'base' }
                        , { label: '层级树 (TreeEntity)', value: 'tree' }
                        , { label: '租户隔离 (TenantEntity)', value: 'tenant' }
                        , { label: '租户层级树 (TreeTenantEntity)', value: 'tree_tenant' }
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                    defaultValue={props.extendMode}
                    onChange={(e) => {
                        props.handleUpdateExtendMode(e.target.value);
                    }}
                />
            </Fragment>
            <Table<DataType>
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={properties}
                columns={columns as ColumnTypes}
                pagination={{ pageSize: 100, position: ['none', 'none'] }}
                scroll={{ y: 500 }}
                size="small"
            />
        </div>
    );
};

export default DevEntityPropertyTable;