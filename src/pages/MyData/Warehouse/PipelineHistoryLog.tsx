import { pipelineLogList } from "@/services/zhiwei/pipelineLog";
import { CheckOutlined, ClockCircleOutlined, CloseOutlined, LoadingOutlined, StopOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { useLocation } from "@umijs/max";
import { Card, Col, Input, Row, Splitter, theme, Typography } from "antd";
import { useEffect, useState } from "react";
import { DownwardArrowLine } from "../Icons";
import { STATUS_FAILED, STATUS_READY, STATUS_RUNNING, STATUS_STOPPED } from "../mydata";

const PipelineHistoryLog: React.FC = () => {

    // 从请求参数中 获取historyId
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const historyId = params.get("historyId");

    // 任务日志列表
    const [logs, setLogs] = useState<API.PipelineLogVO[]>([]);
    // 当前选中的日志卡片
    const [log, setLog] = useState<API.PipelineLogVO>();

    // 是否自动刷新
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const timeout = 5000;

    const checkIsRefresh = (logs: API.PipelineLogVO[]) => {
        let hasRunningPipeline = false;
        if (logs.length > 0) {
            // 若有运行中的流水线，则自动刷新
            for (const log of logs) {
                // 任务中止或失败，则不自动刷新
                if (log.executionStatus === STATUS_STOPPED || log.executionStatus === STATUS_FAILED) {
                    hasRunningPipeline = false;
                    break;
                }

                // 任务还有待执行或执行中，则自动刷新
                if (log.executionStatus === STATUS_READY || log.executionStatus === STATUS_RUNNING) {
                    hasRunningPipeline = true;
                    break;
                }
            }
        }
        setIsRefreshing(hasRunningPipeline);
    };

    // 查询log列表
    const loadHistoryLogs = async () => {
        if (historyId) {
            const response = await pipelineLogList({ historyId: historyId as unknown as number });
            if (response.success) {
                const logs = response.data || [];
                setLogs(logs);
                if (logs.length > 0) {
                    setLog(logs[0]);
                    for (const l of logs) {
                        if (l.executionStatus === STATUS_RUNNING) {
                            setLog(l);
                            break;
                        }
                    }
                }

                checkIsRefresh(logs);
            }
        }
    };

    useEffect(() => {
        loadHistoryLogs();
    }, []);

    const { useToken } = theme;
    const { token } = useToken();
    // 日志状态图标
    const statusIcons = [
        <ClockCircleOutlined key="ready" style={{ color: token.colorBorder }} title="未开始" />
        , <LoadingOutlined key="running" style={{ color: token.blue }} title="执行中" />
        , <StopOutlined key="stop" style={{ color: token.colorWarning }} title="手动停止" />
        , <CheckOutlined key="success" style={{ color: token.colorSuccess }} title="执行成功" />
        , <CloseOutlined key="error" style={{ color: token.colorError }} title="执行失败" />
    ];

    useEffect(() => {
        if (!isRefreshing)
            return;

        const interval = setInterval(() => {
            loadHistoryLogs();
        }, timeout);

        return () => clearInterval(interval);
    }, [isRefreshing]);

    return (
        <>
            <Splitter>
                <Splitter.Panel defaultSize={350}>
                    <Card bordered={false}>
                        {logs.map((l, index) => {
                            return <>
                                <ProCard
                                    size="small"
                                    hoverable
                                    onClick={() => setLog(l)}
                                    boxShadow={l === log}
                                    type="inner"
                                >
                                    <Row>
                                        <Col span={18}>
                                            <Typography.Title level={5}>{statusIcons[l.executionStatus || 0]} {index + 1}. {l.taskName}</Typography.Title>
                                        </Col>
                                        <Col span={6} style={{ textAlign: "right" }}>
                                            {l.executionTime ? l.executionTime + 's' : '--'}
                                        </Col>
                                    </Row>
                                </ProCard>
                                {/* 向下箭头连线 */}
                                {index !== (logs.length - 1) && DownwardArrowLine}
                            </>
                        })}
                    </Card>
                </Splitter.Panel>
                <Splitter.Panel defaultSize={"70%"}>
                    <Input.TextArea
                        title="流水线日志"
                        variant="borderless"
                        style={{
                            backgroundColor: 'black',
                            color: '#808080',
                            height: '100vh',
                            overflow: 'auto',
                            paddingTop: 24,
                            paddingLeft: 24,
                            fontSize: 14,
                        }}
                        readOnly
                        value={log?.taskLog}
                    />
                </Splitter.Panel>
            </Splitter>
        </>
    );
};

export default PipelineHistoryLog;