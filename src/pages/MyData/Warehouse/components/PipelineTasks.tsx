import { PlusCircleFilled, PlusCircleOutlined, PlusCircleTwoTone, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Dropdown, MenuProps, Row, Space, Splitter, theme } from "antd";
import { useState } from "react";

export type PipelineTasksProp = {

};

const { useToken } = theme;

const DownwardArrowLine = (
    <div style={{ paddingLeft: 20, left: 50, top: 40 }}>
        {/* 总高度稍微高于线条高度以容纳箭头 */}
        <svg width="20" height="60" style={{ left: 50, color: "#bfbfbf" }} >
            {/* 竖直线，高度50 */}
            <line x1="10" y1="10" x2="10" y2="50" stroke="gray" strokeWidth="2" />
            {/* 朝下的箭头 */}
            <polygon points="5,50 15,50 10,58" fill="gray" />
        </svg>
    </div>
);

const PipelineTasks: React.FC<PipelineTasksProp> = (props) => {

    const [tasks, setTasks] = useState<any>([]);

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
                    label: '发送数据',
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
    const handleDropdownClick = (index: number, name: string) => {
        const newTasks = [...tasks];
        newTasks.splice(index, 0, { name: name });
        setTasks(newTasks);
    }

    const { token } = useToken();

    return (
        <>
            <Splitter>
                <Splitter.Panel defaultSize={"40%"} min={"20%"} max={"60%"}>
                    <Card bordered={false}>
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
                            tasks.length > 0 && tasks.map((task: any, index: number) => {
                                return <>
                                    <Card
                                        size="small"
                                    >
                                        <div style={{ position: "absolute", left: 50, top: -15 }}>
                                            <Dropdown menu={{
                                                items: dropDownItems, onClick: ({ key }) => {
                                                    handleDropdownClick(index, key);
                                                }
                                            }} trigger={["click"]}>
                                                <PlusCircleTwoTone style={{ fontSize: 20 }} />
                                            </Dropdown>
                                        </div>
                                        {task.name}
                                        <div style={{ position: "absolute", left: 50, top: 40 }}>
                                            <Dropdown menu={{
                                                items: dropDownItems, onClick: ({ key }) => {
                                                    handleDropdownClick(index + 1, key);
                                                }
                                            }} trigger={["click"]}>
                                                <PlusCircleTwoTone style={{ fontSize: 20 }} />
                                            </Dropdown>
                                        </div>
                                    </Card>
                                    {index != tasks.length - 1 && DownwardArrowLine}
                                </>
                            })
                        }
                    </Card>
                </Splitter.Panel>
                <Splitter.Panel defaultSize={"60%"} min={"40%"} max={"80%"}>
                    Right
                </Splitter.Panel>
            </Splitter>
        </>
    );
};

export default PipelineTasks;