import { pipelineLogList } from "@/services/zhiwei/pipelineLog";
import { CheckOutlined, ClockCircleOutlined, LoadingOutlined, StopOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { useLocation } from "@umijs/max";
import { Card, Col, Row, Splitter, theme, Typography } from "antd";
import { useEffect, useState } from "react";
import { DownwardArrowLine } from "./components/task_components/DownwardArrowLine";

const PipelineHistoryLog: React.FC = () => {

    // 从请求参数中 获取historyId
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const historyId = params.get("historyId");

    // 任务日志列表
    const [logs, setLogs] = useState<API.PipelineLogVO[]>([]);
    // 当前选中的日志卡片
    const [log, setLog] = useState<API.PipelineLogVO>();

    // 查询log列表
    const loadHistoryLogs = async () => {
        if (historyId) {
            const response = await pipelineLogList({ historyId: historyId as unknown as number });
            if (response.success) {
                const logs = response.data || [];
                setLogs(logs);

                checkIsRefresh(logs);
            }
        }
    };

    const checkIsRefresh = (logs: API.PipelineLogVO[]) => {
        var hasRunningPipeline = false;
        if (logs.length > 0) {
            // 若有运行中的流水线，则自动刷新
            for (const log of logs) {
                if (log.executionStatus === 0 || log.executionStatus === 1) {
                    hasRunningPipeline = true;
                    break;
                }
            }
        }
        setIsRefreshing(hasRunningPipeline);
    };

    useEffect(() => {
        loadHistoryLogs();
    }, []);

    const { useToken } = theme;
    const { token } = useToken();
    // 日志状态图标
    const statusIcons = [
        <ClockCircleOutlined style={{ color: token.colorBorder }} title="未开始" />
        , <LoadingOutlined style={{ color: token.blue }} title="执行中" />
        , <StopOutlined style={{ color: token.colorWarning }} title="手动停止" />
        , <CheckOutlined style={{ color: token.colorSuccess }} title="执行成功" />
        , <StopOutlined style={{ color: token.colorError }} title="执行失败" />
    ];

    // 是否自动刷新
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const timeout = 2000;

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
                <Splitter.Panel defaultSize={300}>
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
                                    <Typography.Title level={5}>{statusIcons[l.executionStatus || 0]} {index + 1}. {l.taskName}</Typography.Title>
                                </ProCard>
                                {/* 向下箭头连线 */}
                                {index != (logs.length - 1) && DownwardArrowLine}
                            </>
                        })}
                    </Card>
                </Splitter.Panel>
                <Splitter.Panel defaultSize={"70%"}>

                </Splitter.Panel>
            </Splitter>
        </>
    );
};

export default PipelineHistoryLog;