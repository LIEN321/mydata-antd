import { bizDataFieldList, bizDataPage, deleteBizData, saveBizData } from "@/services/zhiwei/bizData";
import Icon from "@ant-design/icons";
import { ActionType, ModalForm, ProColumns, ProForm, ProFormText, ProTable } from "@ant-design/pro-components";
import { Button, Divider, message, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";

export type BizDataProp = {
    /** 数据标准 */
    data: API.DataVO,

    /** 是否显示 */
    open: boolean,
    /** 打开关闭事件 */
    onOpenChange: (open: boolean) => void;
};

const BizData: React.FC<BizDataProp> = (props) => {
    const { data } = props;
    const [bizDataFields, setBizDataFields] = useState<API.DataFieldVO[]>([]);
    const [columns, setColumns] = useState<ProColumns<API.DataFieldVO>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const tableRef = useRef<ActionType>();

    const [editFormOpen, setEditFormOpen] = useState<boolean>(false);
    const [bizData, setBizData] = useState<any>({});
    const handleEditBizData = (bizData: any) => {
        setBizData(() => bizData);
        setEditFormOpen(() => true);
    }

    const handleDeleteBizData = async (bizData: any) => {
        const dataId = data.id;
        const bizDataId = bizData._MD_DATA_ID_;
        if (dataId) {
            const response = await deleteBizData({ dataId, bizDataId });
            if (response.success) {
                message.success("删除成功！");
                tableRef.current?.reload();
            }
        } else {
            message.warning("数据无效");
        }
    };

    // 加载业务数据的字段列
    const loadColumns = async () => {
        setLoading(true);
        if (data.id) {
            // 调用接口 查询业务数据的字段
            const response = await bizDataFieldList({ dataId: data.id });
            if (response.success && response.data) {
                // 查询返回的字段列表
                const bizDataFields = response.data;
                setBizDataFields(bizDataFields);

                const columnsUpdate: ProColumns<API.DataFieldVO>[] = [];

                for (const field of bizDataFields) {
                    columnsUpdate.push({
                        title: field.fieldName,
                        dataIndex: field.fieldCode,
                        // search: field.isId === 1,
                        search: true,
                        renderText(text) {
                            return (text !== undefined && text !== null) ? text.toString() : "";
                        },
                    });
                }
                columnsUpdate.push(
                    {
                        title: "最后更新时间",
                        dataIndex: "_MD_UPDATE_TIME_",
                        search: false,
                    },
                    {
                        title: '操作',
                        width: 120,
                        search: false,
                        render: (record) => {
                            return <>
                                <a onClick={() => handleEditBizData(record)}>编辑</a>
                                <Divider type="vertical" />
                                <Popconfirm
                                    title="确认删除该数据吗？"
                                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                    placement="topRight"
                                    onConfirm={() => handleDeleteBizData(record)}
                                >
                                    <a title="删除">删除</a>
                                </Popconfirm>
                                {<>
                                    {/* <a onClick={() => { this.handleShowBizDataHistory(record) }}>历史数据</a> */}
                                </>
                                }
                            </>
                        }
                    }
                );
                setColumns(() => columnsUpdate);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        loadColumns();
    }, []);

    return <>
        <ModalForm
            title={`业务数据 - ${data.dataName}`}
            width={'90%'}
            submitter={{
                render: () => {
                    return [
                        <Button key="refresh">刷新</Button>
                    ];
                },
            }}
            open={props.open}
            onOpenChange={props.onOpenChange}
            layout="horizontal"
        >
            <ProTable<any, API.bizDataPageParams>
                loading={loading}
                columns={columns}
                options={false}
                search={{
                    span: 4,
                    // defaultCollapsed: false,
                }}
                request={(params: API.bizDataPageParams) => {
                    params.dataId = data.id || 0;
                    return bizDataPage(params);
                }}
                pagination={{ pageSize: 10, }}
                actionRef={tableRef}
            />
        </ModalForm>
        {editFormOpen && <>
            <ModalForm
                initialValues={bizData}
                open={editFormOpen}
                title="编辑业务数据"
                width={600}
                onOpenChange={setEditFormOpen}
                onFinish={async (formData) => {
                    const dataId = data.id;
                    const bizDataId = bizData._MD_DATA_ID_;
                    if (dataId) {
                        const response = await saveBizData({ dataId, bizDataId }, formData);
                        if (response.success) {
                            message.success("保存成功！");
                            setBizData({});
                            setEditFormOpen(false);
                            tableRef.current?.reload();
                            return true;
                        }
                    } else {
                        message.warning("数据无效");
                    }
                    return false;
                }}
            >
                {bizDataFields.map(field => {
                    return <>
                        <ProFormText
                            name={field.fieldCode}
                            label={field.fieldName}
                        />
                    </>
                })}
            </ModalForm>
        </>}

    </>
};

export default BizData;