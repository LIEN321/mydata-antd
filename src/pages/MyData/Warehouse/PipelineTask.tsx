import { DeleteOutlined, DownCircleFilled, PlusCircleFilled, PlusOutlined, UpCircleFilled } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Card, Dropdown, MenuProps, Popconfirm, Space, Splitter, Switch, Typography, theme } from "antd";
import { useEffect, useState } from "react";
import PipelineTaskForm from "./PipelineTaskForm";
import { API_SEND_DATA, DATA_TO_JSON, FILTER_DATA, PROCESS_DATA, TASK_TEMPLATE, TaskKey } from "../mydata";
import { DownwardArrowLine } from "../Icons";

export type PipelineTaskProp = {
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
    /** 类型名称 */
    typeName: string;
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
    /** 启禁用状态 */
    status: number;
    /** 是否继续执行 */
    preCondition: number;
};

const PipelineTask: React.FC<PipelineTaskProp> = (props) => {

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
            ],
        },
        {
            key: 'group_webhook',
            type: 'group',
            label: 'Webhook',
            children: [
                {
                    key: TASK_TEMPLATE.WEBHOOK_GET_JSON.taskType,
                    label: TASK_TEMPLATE.WEBHOOK_GET_JSON.taskName,
                },
            ]
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
                    key: TASK_TEMPLATE.DATA_TO_JSON.taskType,
                    label: TASK_TEMPLATE.DATA_TO_JSON.taskName,
                },
                {
                    key: TASK_TEMPLATE.FILTER_DATA.taskType,
                    label: TASK_TEMPLATE.FILTER_DATA.taskName,
                },
                {
                    key: TASK_TEMPLATE.PROCESS_DATA.taskType,
                    label: TASK_TEMPLATE.PROCESS_DATA.taskName,
                },
                {
                    key: TASK_TEMPLATE.WRITE_EXCEL.taskType,
                    label: TASK_TEMPLATE.WRITE_EXCEL.taskName,
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
                }
            ],
        },
        {
            key: 'group_pipeline',
            type: 'group',
            label: '流水线',
            children: [
                {
                    key: TASK_TEMPLATE.TRIGGER_PIPELINE.taskType,
                    label: TASK_TEMPLATE.TRIGGER_PIPELINE.taskName,
                },
                {
                    key: TASK_TEMPLATE.STOP_PIPELINE.taskType,
                    label: TASK_TEMPLATE.STOP_PIPELINE.taskName,
                },
            ],
        },
        {
            key: 'group_var',
            type: 'group',
            label: '参数变量',
            children: [
                {
                    key: TASK_TEMPLATE.JSON_TO_VAR.taskType,
                    label: TASK_TEMPLATE.JSON_TO_VAR.taskName,
                },
            ],
        },
    ];

    useEffect(() => {
        let index = 0;
        if (tasks.length > 0) {
            // 默认选中第一个任务
            setTask(tasks[0]);
            // 使用任务模板 补全旧版任务的配置
            tasks.map(task => {
                task.key = index;
                index++;

                const taskTemplate = structuredClone(TASK_TEMPLATE[task.taskType as TaskKey]);
                if (!taskTemplate)
                    return;
                task.typeName = taskTemplate.taskName;
                const taskTemplateConfig = structuredClone(taskTemplate.taskConfig);

                if (!task.taskConfig) {
                    task.taskConfig = structuredClone(taskTemplateConfig);
                } else {
                    // 补全taskConfig下的第一层属性
                    const { taskConfig } = task;
                    for (const key in taskTemplateConfig) {
                        if (!taskConfig.hasOwnProperty(key)) {
                            taskConfig[key] = structuredClone(taskTemplateConfig[key as keyof typeof taskTemplateConfig]);
                        }
                    }
                    // 同步 taskConfig 和 tempate的 Input 的属性
                    if (taskTemplateConfig["INPUT"] && task.taskConfig["INPUT"]) {
                        const templateInput = structuredClone(taskTemplateConfig["INPUT"]);
                        const taskInput = structuredClone(task.taskConfig["INPUT"]);
                        // 删除task Input无效属性
                        for (const key in taskInput) {
                            if (!templateInput.hasOwnProperty(key)) {
                                delete taskInput[key];
                            }
                        }
                        // 补全task Input缺少属性
                        for (const key in templateInput) {
                            if (!taskInput.hasOwnProperty(key)) {
                                taskInput[key] = templateInput[key as keyof typeof templateInput];
                            }
                        }
                        task.taskConfig["INPUT"] = taskInput;
                    }
                    // 同步 taskConfig 和 tempate的 Output 的属性
                    if (taskTemplateConfig["OUTPUT"] && task.taskConfig["OUTPUT"]) {
                        const templateOutput = structuredClone(taskTemplateConfig["OUTPUT"]);
                        const taskOutput = structuredClone(task.taskConfig["OUTPUT"]);
                        // 删除task Output无效属性
                        for (const key in taskOutput) {
                            if (!templateOutput.hasOwnProperty(key)) {
                                delete taskOutput[key];
                            }
                        }
                        // 补全task Output缺少属性
                        for (const key in templateOutput) {
                            if (!taskOutput.hasOwnProperty(key)) {
                                taskOutput[key] = templateOutput[key as keyof typeof templateOutput];
                            }
                        }
                        task.taskConfig["OUTPUT"] = taskOutput;
                    }
                }
            });
        }
    }, []);

    // 下拉菜单点击事件
    const handleAddTask = (index: number, type: string) => {
        const newTasks = [...tasks];
        const newTask = structuredClone(TASK_TEMPLATE[type as TaskKey] as unknown as TaskItem);
        newTasks.splice(index, 0, newTask as TaskItem);
        newTask.projectId = props.projectId;
        newTask.status = 1;

        // 重新更新 任务的key
        newTasks.map((t, index) => {
            t.key = index;
        });

        // 若新任务是 发送数据、过滤数据 或 处理数据，则从当前新任务前面最近的任务 复制数据id
        if (type === API_SEND_DATA || type === FILTER_DATA || type === PROCESS_DATA || type === DATA_TO_JSON) {
            for (let i = index - 1; i >= 0; i--) {
                const tmpTask = newTasks[i];
                if (tmpTask.dataId) {
                    newTask.dataId = tmpTask.dataId;
                    break;
                }
            }
        }

        setTask(newTask)
        setTasks(newTasks);
        props.setTasks(newTasks);
    }

    // 移动任务的位置
    const handleMoveTask = (fromIndex: number, toIndex: number) => {
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
            <Splitter style={{ height: "calc(100vh - 216px)" }}>
                <Splitter.Panel defaultSize={"30%"} min={"20%"} max={"50%"}>
                    {/* 左侧任务列表外层Card */}
                    <Card bordered={false} style={{ height: "100%", overflow: "auto" }}>
                        {
                            tasks.length === 0 &&
                            <Dropdown menu={{
                                items: dropDownItems, onClick: ({ key }) => {
                                    handleAddTask(0, key);
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
                                        onClick={() => setTask(() => t)}
                                        boxShadow={t.key === task?.key}
                                        style={t.status === 0 ? { backgroundColor: "#DDD", color: "#999" } : {}}
                                    >
                                        {
                                            hoveredCard === index &&
                                            <div style={{ position: "absolute", right: 0, top: -18, width: 80, height: 50, paddingTop: 10, paddingLeft: 10, zIndex: 999 }}>
                                                <Dropdown
                                                    menu={{
                                                        items: dropDownItems, onClick: ({ key }) => {
                                                            handleAddTask(index, key);
                                                        }
                                                    }}
                                                    placement="bottomCenter"
                                                    trigger={["click"]}>
                                                    {/* 上方添加图标 */}
                                                    <PlusCircleFilled style={{ fontSize: 20, color: token.blue }} />
                                                </Dropdown>
                                                {/* 上移位置图标 */}
                                                {index !== 0 && <UpCircleFilled style={{ fontSize: 20, color: token.blue, marginLeft: 20 }} onClick={() => { handleMoveTask(index, index - 1) }} />}
                                            </div>
                                        }

                                        {/* 任务卡片内容 */}
                                        <Typography.Title level={5} style={t.status === 0 ? { color: "#999" } : {}}>{index + 1}. {t.taskName}</Typography.Title>
                                        {/* 任务操作 */}
                                        {hoveredCard === index &&
                                            <div style={{ position: "absolute", right: -20, top: 0, width: 120, height: 50, paddingTop: 22, paddingLeft: 10, display: "flex", alignItems: "center" }}>
                                                <Space>
                                                    <Switch value={t.status === 1} onChange={value => {
                                                        t.status = value ? 1 : 0;
                                                        updateTask(t);
                                                    }}
                                                    />
                                                    <Popconfirm placement="topRight" title="确认删除吗？" onConfirm={() => {
                                                        deleteTask(index);
                                                    }}>
                                                        <Button type="text" icon={<DeleteOutlined />} />
                                                    </Popconfirm>
                                                </Space>
                                            </div>
                                        }
                                        {
                                            <>
                                                输入：
                                                {Object.keys(t.taskConfig.INPUT).length > 0
                                                    ?
                                                    <Space>
                                                        {Object.keys(t.taskConfig.INPUT).map((key) => {
                                                            return <>{t.taskConfig.INPUT[key]}</>
                                                        })}
                                                    </Space>
                                                    : '--'
                                                }
                                                <br />
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
                                                <Dropdown
                                                    menu={{
                                                        items: dropDownItems, onClick: ({ key }) => {
                                                            handleAddTask(index + 1, key);
                                                        }
                                                    }}
                                                    placement="bottomCenter"
                                                    trigger={["click"]}>
                                                    {/* 下方添加图标 */}
                                                    <PlusCircleFilled style={{ fontSize: 20, color: token.blue }} />
                                                </Dropdown>
                                                {/* 下移位置图标 */}
                                                {index !== (tasks.length - 1) && <DownCircleFilled style={{ fontSize: 20, color: token.blue, marginLeft: 20 }} onClick={() => { handleMoveTask(index, index + 1); }} />}
                                            </div>
                                        }
                                    </ProCard >
                                    {/* 向下箭头连线 */}
                                    {index !== (tasks.length - 1) && DownwardArrowLine}
                                </>
                            })
                        }
                    </Card>
                </Splitter.Panel>
                <Splitter.Panel defaultSize={"70%"} style={{ overflowY: "auto" }}>
                    {task && <PipelineTaskForm key={task.key} task={task} updateTask={updateTask} projectId={props.projectId} />}
                </Splitter.Panel>
            </Splitter >
        </>
    );
};

export default PipelineTask;