import { bizDataFieldList, bizDataPage } from "@/services/zhiwei/bizData";
import Icon from "@ant-design/icons";
import { ModalForm, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Divider, Popconfirm } from "antd";
import { useEffect, useState } from "react";

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
    const [columns, setColumns] = useState<ProColumns<API.DataFieldVO>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleEditBizData = (bizData: any) => {
        console.info(bizData);
    }

    // 加载业务数据的字段列
    const loadColumns = async () => {
        setLoading(true);
        if (data.id) {
            // 调用接口 查询业务数据的字段
            const response = await bizDataFieldList({ dataId: data.id });
            if (response.success && response.data) {
                // 查询返回的字段列表
                const bizDataFields = response.data;

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
                                // onConfirm={() => this.handleDeleteBizData(record)}
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
            />
        </ModalForm>
    </>
};

export default BizData;