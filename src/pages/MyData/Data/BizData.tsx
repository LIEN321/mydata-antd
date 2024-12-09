import { bizDataFieldList, bizDataPage } from "@/services/zhiwei/bizData";
import Icon from "@ant-design/icons";
import { ModalForm, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Divider, Grid, Popconfirm } from "antd";
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

    const loadColumns = async () => {
        setLoading(true);
        if (data.id) {
            const response = await bizDataFieldList({ dataId: data.id });
            if (response.success && response.data) {
                const bizDataFields = response.data;

                const columnsUpdate: ProColumns<API.DataFieldVO>[] = [];

                for (const field of bizDataFields) {
                    columnsUpdate.push({
                        title: field.fieldName,
                        dataIndex: field.fieldCode,
                        search: field.isId === 1,
                        renderText(text) {
                            return text.toString();
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
                        render: (text, record) => {
                            return <>
                                <Popconfirm
                                    title="确认删除该数据吗？"
                                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                    placement="topRight"
                                // onConfirm={() => this.handleDeleteBizData(record)}
                                >
                                    <a title="删除">删除</a>
                                </Popconfirm>
                                {<>
                                    <Divider type="vertical" />
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
                render: (props, dom) => {
                    return [
                        <Button>刷新</Button>
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
                // search={{
                //     labelWidth: "auto",
                //     span: 8,
                // }}
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