import { pipelineHistoryPage } from "@/services/zhiwei/pipelineHistory";
import { CheckOutlined, HistoryOutlined, LoadingOutlined, StopOutlined } from "@ant-design/icons";
import { DrawerForm, ProColumns, ProTable } from "@ant-design/pro-components";
import { Badge, DatePicker, Form, theme } from "antd";

export type PipelineHistoryProp = {
    /** 流水线 */
    pipeline: API.PipelineVO,

};

const PipelineHistory: React.FC<PipelineHistoryProp> = (props) => {
    const { useToken } = theme;
    const { token } = useToken();

    // 流水线状态徽标
    const statusBadges = [
        <></>
        , <Badge color={token.blue} text="执行中" title="执行中" />
        , <Badge color={token.colorWarning} text="停止" title="手动停止" />
        , <Badge color={token.colorSuccess} text="成功" title="执行成功" />
        , <Badge color={token.colorError} text="失败" title="执行失败" />
    ];
    // 流水线状态图标
    const statusIcons = [
        <></>
        , <LoadingOutlined style={{ color: token.blue }} title="执行中" />
        , <StopOutlined style={{ color: token.colorWarning }} title="手动停止" />
        , <CheckOutlined style={{ color: token.colorSuccess }} title="执行成功" />
        , <StopOutlined style={{ color: token.colorError }} title="执行失败" />
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
            search: false,
            align: 'center',
            renderFormItem() {
                return <Form.Item style={{ marginBottom: 0 }}>
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
                return statusIcons[entity.executionStatus || 0];
            }
        },

    ];

    return (
        <>
            <DrawerForm
                title={`执行历史 - ${pipeline.pipelineName}`}
                trigger={<HistoryOutlined title="历史记录" />}
                submitter={false}
                width={'800'}
            >
                <ProTable
                    columns={columns}
                    request={(params: API.pipelineHistoryPageParams) => {
                        params.pipelineId = pipeline.id || 0;
                        return pipelineHistoryPage(params);
                    }}
                    pagination={{ pageSize: 10 }}
                    options={false}
                    // 因搜索框样式问题 暂不显示
                    // search={{ layout: "horizontal", labelWidth: 'auto' }}
                    search={false}
                />
            </DrawerForm>
        </>
    );
};

export default PipelineHistory;