import CRUD from "@/components/Gyrfalcon/CRUD";
import { deleteDemo, deleteDemos, demoPage, saveDemo } from "@/services/zhiwei/demo";
import { ActionType, ProColumns, ProFormText, ProFormSwitch, ProFormTextArea, ProFormSelect, ProFormDateTimePicker, ProFormDatePicker, ProFormRadio, ProFormCheckbox, ProFormTreeSelect, } from "@ant-design/pro-components";
import { Select } from "antd";
import { useRef } from "react";

const Demo: React.FC = () => {

    // 表格列
    const columns: ProColumns<API.DemoVO>[] = [
        {
            title: '字符串',
            dataIndex: 'a',
            search: true,
            renderText: (text, record, index, action) => {
                return <Select options={[
                    { value: "String", label: "String" }
                    , { value: "Long", label: "Long" }
                    , { value: "Integer", label: "Integer" }
                    , { value: "Date", label: "Date" }
                    , { value: "Double", label: "Double" }
                    , { value: "Boolean", label: "Boolean" }
                    , { value: "BigDecimal", label: "BigDecimal" }
                ]} />
            },
        },
        {
            title: '长整型',
            dataIndex: 'b',
            search: true,
        },
        {
            title: '整数',
            dataIndex: 'c',
            search: false,
        },
        {
            title: '日期',
            dataIndex: 'd',
            search: true,
        },
        {
            title: '时间',
            dataIndex: 'e',
            search: true,
        },
        {
            title: '浮点数',
            dataIndex: 'f',
            search: true,
        },
        {
            title: '布尔',
            dataIndex: 'g',
            search: true,
        },
        {
            title: '高精度数',
            dataIndex: 'h',
            search: true,
        },
        {
            title: '多行文本',
            dataIndex: 'i',
            search: true,
        },
        {
            title: '下拉框',
            dataIndex: 'j',
            search: true,
        },
        {
            title: '树型下拉框',
            dataIndex: 'k',
            search: false,
        },
        {
            title: '单选',
            dataIndex: 'l',
            search: false,
        },
        {
            title: '多选',
            dataIndex: 'm',
            search: false,
            render: (_, record) => {
                if (record.m) {
                    const array = [...record.m];
                    return array.join(', ');
                }
                return '-';
            },
        },
    ];

    const demoForm = <>
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入字符串",
                }
            ]}
            name="a"
            label="字符串"
            placeholder="请输入字符串"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入长整型",
                }
            ]}
            name="b"
            label="长整型"
            placeholder="请输入长整型"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入整数",
                }
            ]}
            name="c"
            label="整数"
            placeholder="请输入整数"
        />
        <ProFormDatePicker
            rules={[
                {
                    required: true,
                    message: "请输入日期",
                }
            ]}
            name="d"
            label="日期"
            placeholder="请输入日期"
        />
        <ProFormDateTimePicker
            rules={[
                {
                    required: true,
                    message: "请输入时间",
                }
            ]}
            name="e"
            label="时间"
            placeholder="请输入时间"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入浮点数",
                }
            ]}
            name="f"
            label="浮点数"
            placeholder="请输入浮点数"
        />
        <ProFormSwitch
            rules={[
                {
                    required: true,
                    message: "请输入布尔",
                }
            ]}
            name="g"
            label="布尔"
            placeholder="请输入布尔"
        />
        <ProFormText
            rules={[
                {
                    required: true,
                    message: "请输入高精度数",
                }
            ]}
            name="h"
            label="高精度数"
            placeholder="请输入高精度数"
        />
        <ProFormTextArea
            rules={[
                {
                    required: true,
                    message: "请输入多行文本",
                }
            ]}
            name="i"
            label="多行文本"
            placeholder="请输入多行文本"
        />
        <ProFormSelect
            rules={[
                {
                    required: true,
                    message: "请输入下拉框",
                }
            ]}
            name="j"
            label="下拉框"
            placeholder="请输入下拉框"
            options={[
                {
                    label: 'item 1',
                    value: 'a',
                },
                {
                    label: 'item 2',
                    value: 'b',
                },
                {
                    label: 'item 3',
                    value: 'c',
                },
            ]}
        />
        <ProFormTreeSelect
            rules={[
                {
                    required: true,
                    message: "请输入树型下拉框",
                }
            ]}
            name="k"
            label="树型下拉框"
            placeholder="请输入树型下拉框"
            fieldProps={{
                treeData: [
                    {
                        value: 'parent 1',
                        title: 'parent 1',
                        children: [
                            {
                                value: 'parent 1-0',
                                title: 'parent 1-0',
                                children: [
                                    {
                                        value: 'leaf1',
                                        title: 'leaf1',
                                    },
                                    {
                                        value: 'leaf2',
                                        title: 'leaf2',
                                    },
                                    {
                                        value: 'leaf3',
                                        title: 'leaf3',
                                    },
                                ],
                            },
                            {
                                value: 'parent 1-1',
                                title: 'parent 1-1',
                                children: [
                                    {
                                        value: 'leaf11',
                                        title: 'leaf11',
                                    },
                                ],
                            },
                        ],
                    },
                ]
            }}
        />
        <ProFormRadio.Group
            rules={[
                {
                    required: true,
                    message: "请输入单选",
                }
            ]}
            name="l"
            label="单选"
            placeholder="请输入单选"
            options={[
                {
                    label: 'item 1',
                    value: 'a',
                },
                {
                    label: 'item 2',
                    value: 'b',
                },
                {
                    label: 'item 3',
                    value: 'c',
                },
            ]}
        />
        <ProFormCheckbox.Group
            rules={[
                {
                    required: false,
                    message: "请输入多选",
                }
            ]}
            name="m"
            label="多选"
            placeholder="请输入多选"
            options={[
                {
                    label: 'item 1',
                    value: 'a',
                },
                {
                    label: 'item 2',
                    value: 'b',
                },
                {
                    label: 'item 3',
                    value: 'c',
                },
            ]}
        />
    </>;

    const tableRef = useRef<ActionType>();

    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="生成代码示例1"
                columns={columns}

                formWidth={400}
                createForm={demoForm}
                updateForm={demoForm}

                handlePage={demoPage}
                handleCreate={saveDemo}
                handleUpdate={saveDemo}
                handleDelete={deleteDemo}
                handleBatchDelete={deleteDemos}
            />
        </>
    );
};

export default Demo;