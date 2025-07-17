import { pipelineHistoryPage } from "@/services/zhiwei/pipelineHistory";
import { CheckOutlined, CloseOutlined, HistoryOutlined, LoadingOutlined, StopOutlined } from "@ant-design/icons";
import { ActionType, DrawerForm, ProColumns, ProTable } from "@ant-design/pro-components";
import { Badge, Button, DatePicker, Form, theme } from "antd";
import { useEffect, useRef, useState } from "react";
import { openLogWindow, STATUS_RUNNING } from "../mydata";

export type PipelineHistoryProp = {
    /** 流水线 */
    pipeline: API.PipelineVO,

};

const PipelineHistory: React.FC<PipelineHistoryProp> = (props) => {
    const { useToken } = theme;
    const { token } = useToken();

    // 是否自动刷新
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const timeout = 5000;

    const tableRef = useRef<ActionType>();

    useEffect(() => {
        if (!isRefreshing)
            return;

        const interval = setInterval(() => {
            tableRef.current?.reload();
        }, timeout);

        return () => clearInterval(interval);
    }, [isRefreshing]);

    // 流水线状态徽标
    const statusBadges = [
        <></>
        , <Badge key="running" color={token.blue} text="执行中" title="执行中" />
        , <Badge key="stop" color={token.colorWarning} text="停止" title="已停止" />
        , <Badge key="success" color={token.colorSuccess} text="成功" title="执行成功" />
        , <Badge key="error" color={token.colorError} text="失败" title="执行失败" />
    ];
    // 流水线状态图标
    const statusIcons = [
        <></>
        , <LoadingOutlined key="running" style={{ color: token.blue }} title="执行中" />
        , <StopOutlined key="stop" style={{ color: token.colorWarning }} title="已停止" />
        , <CheckOutlined key="success" style={{ color: token.colorSuccess }} title="执行成功" />
        , <CloseOutlined key="error" style={{ color: token.colorError }} title="执行失败" />
    ];

    // 流水线触发类型图标
    const triggerType = [
        <></>
        , "手动执行"
        , "定时任务"
        , "Webhook"
    ];

    const { pipeline } = props;

    const columns: ProColumns<API.PipelineHistoryVO>[] = [
        {
            title: '执行时间',
            dataIndex: 'startTime',
            search: true,
            align: 'center',
            renderFormItem() {
                return <Form.Item name="startTime" style={{ marginBottom: 0 }}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                </Form.Item>

            },

        },
        {
            title: '执行时长',
            dataIndex: 'executionTime',
            search: false,
            align: 'center',
            render(_, entity) {
                return entity.executionTime ? (entity.executionTime + "s") : "--";
            },
        },
        {
            title: '状态',
            dataIndex: 'executionStatus',
            search: false,
            align: 'center',
            render(_, entity) {
                return statusBadges[entity.executionStatus || 0];
            }
        },
        {
            title: '触发方式',
            dataIndex: 'triggerType',
            search: false,
            align: 'center',
            render(_, entity) {
                return triggerType[entity.triggerType || 0];
            }
        },
        {
            title: '查看详情',
            dataIndex: 'projectCode',
            search: false,
            align: 'center',
            render(_, entity) {
                return <Button type="text" onClick={() => {
                    if (entity.id) {
                        // 流水线执行记录id
                        const historyId = entity.id.toString();
                        openLogWindow(historyId);
                    }
                }}>
                    {statusIcons[entity.executionStatus || 0]}
                </Button>;
            }
        },
    ];

    return (
        <>
            <DrawerForm
                title={`执行历史 - ${pipeline.pipelineName}`}
                trigger={<HistoryOutlined />}
                submitter={false}
                width={'800'}
                onOpenChange={(visible) => {
                    if (visible && tableRef.current) {
                        tableRef.current.reload();
                    }
                }}
                layout="horizontal"
            >
                <ProTable
                    actionRef={tableRef}
                    columns={columns}
                    request={async (params: API.pipelineHistoryPageParams) => {
                        params.pipelineId = pipeline.id || 0;
                        const response = await pipelineHistoryPage(params);

                        let hasRunningPipeline = false;
                        if (response.success && response.data) {
                            for (const history of response.data) {
                                if (history.executionStatus === STATUS_RUNNING) {
                                    hasRunningPipeline = true;
                                    break;
                                }
                            }
                        }

                        setIsRefreshing(hasRunningPipeline);
                        return response;
                    }}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    options={false}
                    search={{ span: 12 }}
                    size="small"
                />
            </DrawerForm>
        </>
    );
};

export default PipelineHistory;