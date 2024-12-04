import { DeleteOutlined, DownCircleFilled, PlusCircleFilled, PlusOutlined, UpCircleFilled } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Card, Col, Dropdown, MenuProps, Popconfirm, Row, Space, Splitter, Typography, theme } from "antd";
import { useEffect, useState } from "react";
import PipelineTaskForm from "./PipelineTaskForm";
import { TASK_TEMPLATE, TaskKey } from "../../mydata";
import { DownwardArrowLine } from "../../Icons";

export type PipelineTasksProp = {
    tasks: API.PipelineTaskVO[],
    setTasks: (tasks: API.PipelineTaskVO[]) => void,
    /** 所属项目id */
    projectId: any;
};

const { useToken } = theme;

export type TaskItem = {
    key: any;
    /** id */
    id?: number;
    /** 所属项目 */
    projectId: number;
    /** 所属流水线 */
    pipelineId: number;
    /** 任务类型 */
    taskType: string;
    /** 任务名称 */
    taskName: string;
    /** 关联应用 */
    appId?: number;
    /** 关联API */
    apiId?: number;
    /** 关联数据 */
    dataId?: number;
    /** 任务配置 */
    taskConfig: Record<string, any>;
    /** 数据仓库名称 */
    warehouse?: string;
};

const PipelineTasks: React.FC<PipelineTasksProp> = (props) => {

    // 任务列表
    const [tasks, setTasks] = useState<TaskItem[]>(props.tasks as TaskItem[]);
    // 鼠标悬停的任务卡片
    const [hoveredCard, setHoveredCard] = useState<any>(null);
    // 当前选中的任务卡片
    const [task, setTask] = useState<TaskItem>();

    // 下拉菜单选项
    const dropDownItems: MenuProps['items'] = [
        {
            key: 'group_api',
            type: 'group',
            label: 'API',
            children: [
                {
                    key: TASK_TEMPLATE.API_GET_JSON.taskType,
                    label: TASK_TEMPLATE.API_GET_JSON.taskName,
                },
                {
                    key: TASK_TEMPLATE.API_SEND_DATA.taskType,
                    label: TASK_TEMPLATE.API_SEND_DATA.taskName,
                },
                {
                    key: TASK_TEMPLATE.WEBHOOK_GET_JSON.taskType,
                    label: TASK_TEMPLATE.WEBHOOK_GET_JSON.taskName,
                },
                {
                    key: TASK_TEMPLATE.API_GET_VAR.taskType,
                    label: TASK_TEMPLATE.API_GET_VAR.taskName,
                    disabled: true,
                },
            ],
        },
        {
            key: 'group_data',
            type: 'group',
            label: '数据处理',
            children: [
                {
                    key: TASK_TEMPLATE.JSON_TO_DATA.taskType,
                    label: TASK_TEMPLATE.JSON_TO_DATA.taskName,
                },
                {
                    key: TASK_TEMPLATE.FILTER_DATA.taskType,
                    label: TASK_TEMPLATE.FILTER_DATA.taskName,
                    disabled: true,
                },
                {
                    key: TASK_TEMPLATE.OPERATE_DATA.taskType,
                    label: TASK_TEMPLATE.OPERATE_DATA.taskName,
                    disabled: true,
                },
                {
                    key: TASK_TEMPLATE.WRITE_EXCEL.taskType,
                    label: TASK_TEMPLATE.WRITE_EXCEL.taskName,
                    disabled: true,
                },
            ],
        },
        {
            key: 'group_warehouse',
            type: 'group',
            label: '数据仓库',
            children: [
                {
                    key: TASK_TEMPLATE.SAVE_DATA.taskType,
                    label: TASK_TEMPLATE.SAVE_DATA.taskName,
                },
                {
                    key: TASK_TEMPLATE.QUERY_DATA.taskType,
                    label: TASK_TEMPLATE.QUERY_DATA.taskName,
                    disabled: true,
                }
            ],
        },
        {
            key: 'group_email',
            type: 'group',
            label: '邮件',
            children: [
                {
                    key: TASK_TEMPLATE.SEND_EMAIL.taskType,
                    label: TASK_TEMPLATE.SEND_EMAIL.taskName,
                    disabled: true,
                }
            ],
        },
    ];

    useEffect(() => {
        var index = 0;
        if (tasks.length > 0) {
            // 默认选中第一个任务
            setTask(tasks[0]);
            // 使用任务模板 补全旧版任务的配置
            tasks.map(task => {
                task.key = index;
                index++;

                const taskTemplate = { ...TASK_TEMPLATE[task.taskType as TaskKey] };
                const taskTemplateConfig = taskTemplate.taskConfig;

                if (!task.taskConfig) {
                    task.taskConfig = { ...taskTemplateConfig };
                } else {
                    for (const key in taskTemplateConfig) {
                        const { taskConfig } = task;
                        if (!taskConfig.hasOwnProperty(key)) {
                            taskConfig[key] = taskTemplateConfig[key as keyof typeof taskTemplateConfig];
                        }
                    }
                }
            });
        }
    }, []);

    // 下拉菜单点击事件
    // const handleDropdownClick: MenuProps['onClick'] = (info) => {
    const handleDropdownClick = (index: number, type: string) => {
        const newTasks = [...tasks];
        const newTask = { ...TASK_TEMPLATE[type as TaskKey] as unknown as TaskItem };
        newTasks.splice(index, 0, newTask as TaskItem);
        newTask.projectId = props.projectId;

        // 重新更新 任务的key
        newTasks.map((t, index) => {
            t.key = index;
        });

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

    const updateTask = (task: TaskItem) => {
        const newTasks = [...tasks];
        const index = tasks.findIndex(({ key }) => key === task.key);
        newTasks[index] = task;
        setTask(task);
        props.setTasks(newTasks);
        console.info('PipelineTasks.task', task);
    }

    const deleteTask = (index: number) => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
        props.setTasks(newTasks);

        if (task && task.key === index) {
            setTask(() => newTasks.length > 0 ? newTasks[0] : undefined);
        }
    }

    const { token } = useToken();

    return (
        <>
            <Splitter style={{ height: "100%" }}>
                <Splitter.Panel defaultSize={"30%"} min={"20%"} max={"50%"}>
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
                                        boxShadow={t.key === task?.key}
                                    >
                                        {
                                            hoveredCard === index &&
                                            <div style={{ position: "absolute", right: 0, top: -18, width: 80, height: 50, paddingTop: 10, paddingLeft: 10, zIndex: 999 }}>
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
                                        {/* 删除任务 */}
                                        {hoveredCard === index &&
                                            <div style={{ position: "absolute", right: -20, top: 0, width: 60, height: 50, paddingTop: 22, paddingLeft: 10 }}>
                                                <Popconfirm placement="topRight" title="确认删除吗？" onConfirm={() => {
                                                    deleteTask(index);
                                                }}>
                                                    <Button type="text" icon={<DeleteOutlined />} />
                                                </Popconfirm>
                                            </div>
                                        }
                                        {
                                            <>
                                                输出：
                                                {Object.keys(t.taskConfig.OUTPUT).length > 0
                                                    ?
                                                    <Space>
                                                        {Object.keys(t.taskConfig.OUTPUT).map((key) => {
                                                            return <>{t.taskConfig.OUTPUT[key]}</>
                                                        })}
                                                    </Space>
                                                    : '--'
                                                }
                                            </>
                                        }

                                        {/* 卡片下方添加图标 */}
                                        {
                                            hoveredCard === index &&
                                            <div style={{ position: "absolute", right: 0, bottom: -18, width: 80, height: 50, paddingTop: 20, paddingLeft: 10 }}>
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
                <Splitter.Panel defaultSize={"70%"} style={{ overflowY: "auto" }}>
                    {task && <PipelineTaskForm task={task} updateTask={updateTask} projectId={props.projectId} />}
                </Splitter.Panel>
            </Splitter >
        </>
    );
};

export default PipelineTasks;