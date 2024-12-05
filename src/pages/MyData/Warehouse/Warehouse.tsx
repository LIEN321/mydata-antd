import CRUD from "@/components/Gyrfalcon/CRUD";
import { dataDetail, dataPage, deleteData, deleteDatas, saveData } from "@/services/zhiwei/data";
import { projectList } from "@/services/zhiwei/project";
import { ActionType, DrawerForm, ProColumns } from "@ant-design/pro-components";
import { Button, Divider, Drawer, Skeleton, Tabs, TabsProps } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import AddProject from "./components/AddProject";
import { LoadingOutlined } from "@ant-design/icons";
import { DataFieldDataType } from "../Data/DataFieldTable";
import DataForm from "../Data/components/DataForm";
import Pipeline from "./Pipeline";
import BizData from "../Data/BizData";

const Warehouse: React.FC = () => {

    const tableRef = useRef<ActionType>();

    // -------------------- 项目Tab相关 --------------------
    // tab 相关
    const [tabItems, setTabItems] = useState<TabsProps['items']>([]);
    const [activeKey, setActiveKey] = useState("");
    const [tabLoading, setTabLoading] = useState(false);
    // 项目列表
    const [projects, setProjects] = useState<API.ProjectVO[]>([]);
    // 当前项目
    const [currentProject, setCurrentProject] = useState<API.ProjectVO>();

    /**
     * 加载项目列表，作为Tab项
     * @param isLast 是否定位到最后一个
     */
    const loadProjects = async (isLast: boolean) => {
        setTabLoading(true);
        const response = await projectList();
        if (response && response.success) {
            const projects = response.data;
            if (projects && projects.length > 0) {
                const items: TabsProps['items'] = [];
                projects.map((p, i) => {
                    items.push({
                        key: i.toString(),
                        label: p.projectName,
                        closable: false,
                    });
                });
                setTabItems(() => items);
                setProjects(() => projects);

                if (isLast) {
                    setActiveKey((projects.length - 1).toString());
                    setCurrentProject(projects[projects.length - 1]);
                } else {
                    setActiveKey("0");
                    setCurrentProject(projects[0]);
                }
                tableRef.current?.reload();
            }
        }
        setTabLoading(false);
    }

    // 初始时，加载项目
    useEffect(() => {
        loadProjects(false);
    }, []);

    // 新建项目 窗口显示状态
    const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false);
    // tab 编辑操作
    const onEditTab = (targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',) => {
        if (action === 'add') {
            setAddProjectOpen(true);
        }
    };
    // 项目 Tab
    const projectTabs = (
        <>
            {tabLoading && <Skeleton.Button active block />}
            {
                !tabLoading && <Tabs
                    defaultActiveKey="1"
                    activeKey={activeKey}
                    items={tabItems}
                    type="editable-card"
                    onChange={(key) => {
                        setActiveKey(key);
                        setCurrentProject(projects[Number.parseInt(key)]);
                        tableRef.current?.reload();
                    }}
                    onEdit={onEditTab}
                />
            }
        </>
    );

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
        {
            title: '来源应用',
            dataIndex: '',
            search: false,
        },
        {
            title: '消费应用',
            dataIndex: '',
            search: false,
        },
        {
            title: '最近一次同步',
            dataIndex: '',
            search: false,
        },
        {
            title: '相关流水线',
            dataIndex: '',
            search: false,
        },
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
                    setDataFields(prevFields => {
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

    // -------------------- 流水线相关 --------------------
    const toolBarButton = [
        <Pipeline
            project={currentProject || {}}
        />
    ];

    // -------------------- return --------------------
    return (
        <>
            <CRUD
                tableRef={tableRef}
                title="数据标准"
                columns={columns}

                formWidth={1300}

                upContent={projectTabs}

                createForm={dataForm}
                updateForm={dataForm}

                handlePage={handleDataPage}
                handleCreate={handleSaveOrUpdate}
                handleUpdate={handleSaveOrUpdate}
                handleDelete={deleteData}
                handleBatchDelete={deleteDatas}

                onClickCreateBtn={handleOnClickCreateBtn}
                onClickEditBtn={handleOnClickEditBtn}

                toolBarButton={toolBarButton}
            />

            {
                // 新建项目 Modal
                addProjectOpen && <AddProject
                    open={addProjectOpen}
                    onOpenChange={setAddProjectOpen}
                    onSuccess={() => {
                        loadProjects(true);
                    }}
                />
            }

            {
                bizDataModalOpen && <BizData data={data} open={bizDataModalOpen} onOpenChange={setBizDataModalOpen} />
            }
        </>
    );
};

export default Warehouse;