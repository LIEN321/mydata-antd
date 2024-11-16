import { DownCircleFilled, PlusCircleFilled, PlusCircleTwoTone, PlusOutlined, UpCircleFilled } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Card, Col, Dropdown, MenuProps, Row, Space, Splitter, Typography, theme } from "antd";
import { useState } from "react";

export type PipelineTasksProp = {
    tasks: API.PipelineTaskVO[],
    setTasks: (tasks: API.PipelineTaskVO[]) => void,
};

const { useToken } = theme;

const DownwardArrowLine = (
    <div style={{ paddingLeft: 20, left: 50, top: 40 }}>
        {/* 总高度稍微高于线条高度以容纳箭头 */}
        <svg width="20" height="40" style={{ left: 50, color: "#bfbfbf" }} >
            {/* 竖直线，高度50 */}
            <line x1="10" y1="10" x2="10" y2="30" stroke="gray" strokeWidth="2" />
            {/* 朝下的箭头 */}
            <polygon points="5,30 15,30 10,38" fill="gray" />
        </svg>
    </div>
);

const TASK_TEMPLATE = {
    "API_GET_DATA": { taskType: "API_GET_DATA", taskName: "获取数据", },
    "API_SEND_DATA": { taskType: "API_SEND_DATA", taskName: "发送数据", },
    "WEBHOOK_GET_DATA": { taskType: "WEBHOOK_GET_DATA", taskName: "解析webhook数据", },
    "API_GET_VAR": { taskType: "API_GET_VAR", taskName: "设置参数", },
    "SAVE_DATA": { taskType: "SAVE_DATA", taskName: "保存数据", },
    "QUERY_DATA": { taskType: "QUERY_DATA", taskName: "查询数据", },
    "FILTER_DATA": { taskType: "FILTER_DATA", taskName: "过滤数据", },
    "OPERATE_DATA": { taskType: "OPERATE_DATA", taskName: "处理数据", },
    "WRITE_EXCEL": { taskType: "WRITE_EXCEL", taskName: "写入Excel文件", },
    "SEND_EMAIL": { taskType: "SEND_EMAIL", taskName: "发送邮件", },
}

type TaskKey = keyof typeof TASK_TEMPLATE;

const PipelineTasks: React.FC<PipelineTasksProp> = (props) => {

    // 任务列表
    const [tasks, setTasks] = useState<API.PipelineTaskVO[]>(props.tasks);
    // 鼠标悬停的任务卡片
    const [hoveredCard, setHoveredCard] = useState<any>(null);
    // 当前选中的任务卡片
    const [task, setTask] = useState<API.PipelineTaskVO>();

    // 下拉菜单选项
    const dropDownItems: MenuProps['items'] = [
        {
            key: 'group_api',
            type: 'group',
            label: 'API',
            children: [
                {
                    key: 'API_GET_DATA',
                    label: '获取数据',
                },
                {
                    key: 'API_SEND_DATA',
                    label: '发送数据',
                },
                {
                    key: 'WEBHOOK_GET_DATA',
                    label: '解析webhook数据',
                },
                {
                    key: 'API_GET_VAR',
                    label: '设置参数',
                },
            ],
        },
        {
            key: 'group_warehouse',
            type: 'group',
            label: '数据仓库',
            children: [
                {
                    key: 'SAVE_DATA',
                    label: '保存数据',
                },
                {
                    key: 'QUERY_DATA',
                    label: '查询数据',
                }
            ],
        },
        {
            key: 'group_data',
            type: 'group',
            label: '数据处理',
            children: [
                {
                    key: 'FILTER_DATA',
                    label: '过滤数据',
                },
                {
                    key: 'OPERATE_DATA',
                    label: '处理数据',
                },
                {
                    key: 'WRITE_EXCEL',
                    label: '写入Excel文件',
                },
            ],
        },
        {
            key: 'group_email',
            type: 'group',
            label: '邮件',
            children: [
                {
                    key: 'SEND_EMAIL',
                    label: '发送邮件',
                }
            ],
        },
    ];

    // 下拉菜单点击事件
    // const handleDropdownClick: MenuProps['onClick'] = (info) => {
    const handleDropdownClick = (index: number, type: string) => {
        const newTasks = [...tasks];
        const newTask = TASK_TEMPLATE[type as TaskKey];
        newTasks.splice(index, 0, newTask);
        setTask(newTask)
        setTasks(newTasks);
        props.setTasks(newTasks);
    }

    // 移动任务的位置
    const moveTask = (fromIndex: number, toIndex: number) => {
        const newTasks = [...tasks];
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= newTasks.length || toIndex >= newTasks.length) {
            throw new Error("位置无效，操作失败！");
        }
        const [element] = newTasks.splice(fromIndex, 1); // 删除元素并返回
        newTasks.splice(toIndex, 0, element);           // 插入到目标位置
        setTasks(newTasks);
        props.setTasks(newTasks);
    }

    const { token } = useToken();

    return (
        <>
            <Splitter>
                <Splitter.Panel defaultSize={"40%"} min={"30%"} max={"60%"}>
                    {/* 左侧任务列表外层Card */}
                    <Card bordered={false} style={{ maxHeight: "70vh" }}>
                        {
                            tasks.length == 0 &&
                            <Dropdown menu={{
                                items: dropDownItems, onClick: ({ key }) => {
                                    handleDropdownClick(0, key);
                                }
                            }} trigger={["click"]}>
                                <Button icon={<PlusOutlined />} type="dashed" block>添加步骤</Button>
                            </Dropdown>
                        }
                        {
                            // 任务列表
                            tasks.length > 0 && tasks.map((t, index) => {
                                return <>
                                    <ProCard
                                        size="small"
                                        hoverable
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        onClick={() => setTask(t)}
                                        boxShadow={t === task}
                                    >
                                        {
                                            hoveredCard === index &&
                                            <div style={{ position: "absolute", right: 0, top: -18, width: 100, height: 50, paddingTop: 10, paddingLeft: 10 }}>
                                                <Dropdown menu={{
                                                    items: dropDownItems, onClick: ({ key }) => {
                                                        handleDropdownClick(index, key);
                                                    }
                                                }} trigger={["click"]}>
                                                    {/* 上方添加图标 */}
                                                    <PlusCircleFilled style={{ fontSize: 20, color: token.blue }} />
                                                </Dropdown>
                                                {/* 上移位置图标 */}
                                                {index != 0 && <UpCircleFilled style={{ fontSize: 20, color: token.blue, marginLeft: 20 }} onClick={() => { moveTask(index, index - 1) }} />}
                                            </div>
                                        }

                                        {/* 任务卡片内容 */}
                                        <Typography.Title level={5}>{index + 1}. {t.taskName}</Typography.Title>

                                        {/* 卡片下方添加图标 */}
                                        {
                                            hoveredCard === index && <div style={{ position: "absolute", right: 0, bottom: -18, width: 100, height: 50, paddingTop: 20, paddingLeft: 10 }}>
                                                <Dropdown menu={{
                                                    items: dropDownItems, onClick: ({ key }) => {
                                                        handleDropdownClick(index + 1, key);
                                                    }
                                                }} trigger={["click"]}>
                                                    {/* 下方添加图标 */}
                                                    <PlusCircleFilled style={{ fontSize: 20, color: token.blue }} />
                                                </Dropdown>
                                                {/* 下移位置图标 */}
                                                {index != (tasks.length - 1) && <DownCircleFilled style={{ fontSize: 20, color: token.blue, marginLeft: 20 }} onClick={(e) => { moveTask(index, index + 1); }} />}
                                            </div>
                                        }
                                    </ProCard >
                                    {/* 向下箭头连线 */}
                                    {index != (tasks.length - 1) && DownwardArrowLine}
                                </>
                            })
                        }
                    </Card>
                </Splitter.Panel>
                <Splitter.Panel defaultSize={"60%"} min={"40%"} max={"70%"}>
                    {task && task.taskName}
                </Splitter.Panel>
            </Splitter >
        </>
    );
};

export default PipelineTasks;