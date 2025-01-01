import { dataDetail, dataPage, deleteData, deleteDatas, saveData } from "@/services/zhiwei/data";
import { projectSelect } from "@/services/zhiwei/project";
import { ActionType, ProColumns, ProFormSelect } from "@ant-design/pro-components";
import { Card, Col, Row, Space, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import AddProject from "./components/AddProject";
import { ReloadOutlined } from "@ant-design/icons";
import { DataFieldDataType } from "../Data/DataFieldTable";
import DataForm from "../Data/components/DataForm";
import Pipeline from "./Pipeline";
import BizData from "../Data/BizData";
import CRUD_Simple from "@/components/Gyrfalcon/CRUD_Simple";
import { latestProject, saveUserConfig } from "@/services/zhiwei/userConfig";

const Warehouse: React.FC = () => {

    const tableRef = useRef<ActionType>();

    // -------------------- 项目Tab相关 --------------------
    // 项目列表
    const [projects, setProjects] = useState<API.SelectVO[]>([]);
    // 当前项目
    const [currentProject, setCurrentProject] = useState<API.SelectVO>();
    // 流水线tab的key
    const [pipelineKey, setPipelineKey] = useState(Date.now());
    // 刷新 Pipeline 组件
    const refreshPipelineKey = () => {
        setPipelineKey(Date.now()); // 更新 key 值
    };

    /**
     * 加载项目列表，作为Tab项
     */
    const loadProjects = async () => {
        const userConfigResponse = await latestProject();
        const projectId = userConfigResponse.data;

        const projects = await projectSelect();
        if (projects && projects.length > 0) {
            setProjects(() => projects);

            if (projectId) {
                const project = projects.find(project => project.value === projectId.toString());
                if (project) {
                    setCurrentProject(() => project);
                } else {
                    setCurrentProject(() => projects[0]);
                }
            } else {
                setCurrentProject(() => projects[0]);
            }
            // if (isLast) {
            //     setCurrentProject(projects[projects.length - 1]);
            // } else {
            //     setCurrentProject(projects[0]);
            // }
            tableRef.current?.reload();
            refreshPipelineKey();
        }
    }

    // 初始时，加载项目
    useEffect(() => {
        loadProjects();
    }, []);

    // -------------------- 数据Table相关 --------------------
    const [data, setData] = useState<API.DataVO>({});
    const [bizDataModalOpen, setBizDataModalOpen] = useState<boolean>(false);

    // 表格列
    const columns: ProColumns<API.DataVO>[] = [
        {
            title: '数据编号',
            dataIndex: 'dataCode',
            search: true,
        },
        {
            title: '数据名称',
            dataIndex: 'dataName',
            search: true,
        },
        {
            title: '业务数据',
            dataIndex: 'dataCount',
            search: false,
            render(_, entity) {
                return <><a onClick={() => {
                    setData(() => entity);
                    setBizDataModalOpen(true);
                }}>{entity.dataCount}</a></>;
            },
        },
        // {
        //     title: '来源应用',
        //     dataIndex: '',
        //     search: false,
        // },
        // {
        //     title: '消费应用',
        //     dataIndex: '',
        //     search: false,
        // },
        // {
        //     title: '最近一次同步',
        //     dataIndex: '',
        //     search: false,
        // },
        // {
        //     title: '相关流水线',
        //     dataIndex: '',
        //     search: false,
        // },
    ];

    // 根据项目查询数据标准列表
    const handleDataPage = async (
        params: API.dataPageParams,
        options?: { [key: string]: any },) => {
        if (currentProject) {
            params.projectId = currentProject.id;
            return await dataPage(params, options);
        }
        return [];
    };

    // 用户自定义字段列表
    const [dataFields, setDataFields] = useState<DataFieldDataType[]>([]);
    const [loading, setLoading] = useState(false);
    const dataForm = <DataForm
        loading={loading}
        dataFields={dataFields}
        setDataFields={setDataFields}
        projectId={currentProject?.id}
    />;

    const handleOnClickCreateBtn = () => {
        setDataFields([]);
    }

    const handleOnClickEditBtn = async (record: any) => {
        setLoading(true);
        try {
            const response = await dataDetail({ id: record.id });
            if (response.success) {
                const dataFields = await response.data?.dataFields;
                if (dataFields) {
                    setDataFields(() => {
                        return dataFields as DataFieldDataType[]
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSaveOrUpdate = async (formData: any) => {
        const body = { ...formData, dataFields: dataFields };
        await saveData(body);
    }

    // -------------------- return --------------------
    return (
        <>
            <Card>
                <Row>
                    <Col span={12}>
                        <ProFormSelect
                            options={projects}
                            label="当前项目"
                            allowClear={false}
                            fieldProps={{
                                value: currentProject?.value,
                                onChange: (projectId) => {
                                    const selectedProject = projects.find(project => project.value === projectId);
                                    if (selectedProject) {
                                        setCurrentProject(selectedProject);
                                        tableRef.current?.reload();
                                        refreshPipelineKey();

                                        // 记录用户所选项目，下次自动打开所选项目
                                        saveUserConfig(projectId);
                                    }
                                },
                            }}
                            addonWarpStyle={{ width: "100%" }}
                            addonAfter={<AddProject
                                // open={addProjectOpen}
                                // onOpenChange={setAddProjectOpen}
                                onSuccess={() => {
                                    loadProjects();
                                }}
                            />}
                            style={{ width: 200 }}
                        />

                    </Col>
                </Row>
                <Tabs
                    defaultActiveKey="dataManage"
                    type="card"
                    items={[
                        {
                            label: "数据管理",
                            key: "dataManage",
                            children: <>
                                <CRUD_Simple
                                    tableRef={tableRef}
                                    title={"数据"}
                                    columns={columns}

                                    formWidth={1300}

                                    createForm={dataForm}
                                    updateForm={dataForm}

                                    handlePage={handleDataPage}
                                    handleCreate={handleSaveOrUpdate}
                                    handleUpdate={handleSaveOrUpdate}
                                    handleDelete={deleteData}
                                    handleBatchDelete={deleteDatas}

                                    onClickCreateBtn={handleOnClickCreateBtn}
                                    onClickEditBtn={handleOnClickEditBtn}
                                />
                            </>
                        },
                        {
                            label: <Space>
                                流水线管理
                                <ReloadOutlined onClick={(e) => {
                                    e.stopPropagation();
                                    refreshPipelineKey();
                                }} />
                            </Space>,
                            key: "pipelineManage",
                            children: <>
                                {currentProject && <Pipeline key={pipelineKey}
                                    projectId={currentProject.id || 0}
                                />}
                            </>,
                            // destroyInactiveTabPane: true,
                        },
                    ]}
                />
            </Card>

            {
                bizDataModalOpen && <BizData data={data} open={bizDataModalOpen} onOpenChange={setBizDataModalOpen} />
            }
        </>
    );
};

export default Warehouse;