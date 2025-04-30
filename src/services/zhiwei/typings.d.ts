declare namespace API {
  type apiSelectParams = {
    appId?: number;
  };

  type appApiDetailParams = {
    /** 记录id */
    id: number;
  };

  type AppApiDTO = {
    id?: number;
    /** 所属应用 */
    appId?: number;
    /** 接口名称 */
    apiName?: string;
    /** 操作类型 */
    opType?: number;
    /** 请求方法 */
    apiMethod?: string;
    /** 接口路径 */
    apiUri?: string;
    /** 数据类型 */
    dataType?: string;
    /** 数据层级 */
    fieldPrefix?: string;
    /** 请求Header */
    reqHeaders?: Record<string, any>[];
    /** 请求参数 */
    reqParams?: Record<string, any>[];
    /** 请求体类型 */
    reqBodyType?: string;
    /** 请求体，form格式 */
    reqBodyForm?: Record<string, any>[];
    /** 请求体，raw格式 */
    reqBodyRaw?: string;
    /** 响应示例 */
    respExample?: string;
    /** 数据结构模式，1-对象、2-集合 */
    dataMode?: number;
  };

  type appApiPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    appId?: string;
    apiName?: string;
  };

  type AppApiVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属应用 */
    appId?: number;
    /** 所属应用名称 */
    appName?: string;
    /** 接口名称 */
    apiName?: string;
    /** 操作类型 */
    opType?: number;
    /** 请求方法 */
    apiMethod?: string;
    /** 接口路径 */
    apiUri?: string;
    /** 数据类型 */
    dataType?: string;
    /** 数据层级 */
    fieldPrefix?: string;
    /** 请求Header */
    reqHeaders?: Record<string, any>[];
    /** 请求参数 */
    reqParams?: Record<string, any>[];
    /** 请求体类型 */
    reqBodyType?: string;
    /** 请求体，form格式 */
    reqBodyForm?: Record<string, any>[];
    /** 请求体，raw格式 */
    reqBodyRaw?: string;
    /** 响应示例 */
    respExample?: string;
    /** 数据结构模式，1-对象、2-集合 */
    dataMode?: number;
  };

  type appDetailParams = {
    /** 记录id */
    id: number;
  };

  type AppDTO = {
    id?: number;
    /** 应用编号 */
    appCode?: string;
    /** 应用名称 */
    appName?: string;
    /** 访问地址 */
    appUrl?: string;
    /** 接口前缀地址 */
    apiPrefix?: string;
    /** 应用描述 */
    appDesc?: string;
    /** 接口数量 */
    apiCount?: number;
    /** 请求Header */
    reqHeaders?: Record<string, any>[];
  };

  type appPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    appCode?: string;
    appName?: string;
    appUrl?: string;
  };

  type AppVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 应用编号 */
    appCode?: string;
    /** 应用名称 */
    appName?: string;
    /** 访问地址 */
    appUrl?: string;
    /** 接口前缀地址 */
    apiPrefix?: string;
    /** 应用描述 */
    appDesc?: string;
    /** 接口数量 */
    apiCount?: number;
    /** 请求Header */
    reqHeaders?: Record<string, any>[];
  };

  type AuthUser = {
    /** 所属租户 */
    tenantId?: string;
    /** 用户id */
    id?: number;
    /** 用户编号 */
    code?: string;
    /** 登录名 */
    loginName?: string;
    /** 用户名 */
    name?: string;
    /** 头像 */
    avatar?: string;
    /** 所属部门id */
    departmentId?: number;
    /** 手机 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 密码复杂度 */
    passwordStrength?: number;
    /** 角色id */
    roleId?: number;
  };

  type bizDataFieldListParams = {
    dataId: number;
  };

  type bizDataPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    dataId: number;
    params: Record<string, any>;
  };

  type ChangePasswordDTO = {
    /** 原密码 */
    oldPassword?: string;
    /** 新密码 */
    newPassword?: string;
    /** 确认密码 */
    confirmPassword?: string;
  };

  type dataDetailParams = {
    /** 记录id */
    id: number;
  };

  type DataDTO = {
    id?: number;
    /** 所属项目 */
    projectId?: number;
    /** 数据编号 */
    dataCode?: string;
    /** 数据名称 */
    dataName?: string;
    /** 字段列表 */
    dataFields?: DataFieldDTO[];
  };

  type DataFieldDTO = {
    id?: number;
    /** 所属数据 */
    dataId?: number;
    /** 字段编号 */
    fieldCode?: string;
    /** 字段名称 */
    fieldName?: string;
    /** 字段类型 */
    fieldType?: string;
    /** 字段默认值 */
    defaultValue?: string;
    /** 是否标识 */
    isId?: boolean;
    /** 显示模式 */
    displayMode?: boolean;
  };

  type DataFieldVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属数据 */
    dataId?: number;
    /** 字段编号 */
    fieldCode?: string;
    /** 字段名称 */
    fieldName?: string;
    /** 字段类型 */
    fieldType?: string;
    /** 字段默认值 */
    defaultValue?: string;
    /** 是否标识 */
    isId?: number;
    /** 显示模式 */
    displayMode?: number;
  };

  type dataPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    dataCode?: string;
    dataName?: string;
    projectId?: number;
  };

  type dataSelectParams = {
    projectId: number;
  };

  type DataVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属项目id */
    projectId?: number;
    /** 所属项目名称 */
    projectName?: string;
    /** 数据编号 */
    dataCode?: string;
    /** 数据名称 */
    dataName?: string;
    /** 业务数据 */
    dataCount?: number;
    /** 字段列表 */
    dataFields?: DataFieldVO[];
  };

  type deleteAppApiParams = {
    /** 记录id */
    id: number;
  };

  type deleteAppParams = {
    /** 记录id */
    id: number;
  };

  type deleteBizDataParams = {
    dataId: number;
    bizDataId: string;
  };

  type deleteDataParams = {
    /** 记录id */
    id: number;
  };

  type deleteDepartmentParams = {
    /** 记录id */
    id: number;
  };

  type deleteDevEntityParams = {
    /** 记录id */
    id: number;
  };

  type deleteMenuParams = {
    /** 记录id */
    id: number;
  };

  type deleteParameterParams = {
    id: number;
  };

  type deletePipelineGroupParams = {
    /** 记录id */
    id: number;
  };

  type deletePipelineHistoryParams = {
    /** 记录id */
    id: number;
  };

  type deletePipelineLogParams = {
    /** 记录id */
    id: number;
  };

  type deletePipelineParams = {
    /** 记录id */
    id: number;
  };

  type deletePipelineTaskParams = {
    /** 记录id */
    id: number;
  };

  type deleteProjectParams = {
    /** 记录id */
    id: number;
  };

  type deleteRoleParams = {
    /** 记录id */
    id: number;
  };

  type deleteSysApiParams = {
    id: number;
  };

  type deleteTenantParams = {
    /** 记录id */
    id: number;
  };

  type deleteUserParams = {
    /** 记录id */
    id: number;
  };

  type departmentDetailParams = {
    /** 记录id */
    id: number;
  };

  type DepartmentDTO = {
    id?: number;
    parentId?: number;
    /** 机构名称 */
    name?: string;
    /** 机构类型 */
    type?: number;
    /** 机构排序 */
    sort?: number;
    /** 机构备注 */
    remark?: string;
  };

  type departmentListParams = {
    name?: string;
  };

  type DepartmentTreeVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 父菜单id */
    parentId?: number;
    value?: number;
    key?: number;
    title?: string;
    children?: DepartmentTreeVO[];
  };

  type DepartmentVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 父菜单id */
    parentId?: number;
    /** 机构名称 */
    name?: string;
    /** 机构类型 */
    type?: number;
    /** 机构排序 */
    sort?: number;
    /** 机构备注 */
    remark?: string;
    /** 子层级机构 */
    children?: DepartmentVO[];
  };

  type devEntityDetailParams = {
    /** 记录id */
    id: number;
  };

  type DevEntityDTO = {
    id?: number;
    /** 实体编号 */
    code?: string;
    /** 实体名称 */
    name?: string;
    /** 后端包名 */
    packageName?: string;
    /** 数据库表名 */
    tableName?: string;
    /** 实体备注 */
    remark?: string;
  };

  type devEntityPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    code?: string;
    name?: string;
    tableName?: string;
  };

  type DevEntityPropertyDTO = {
    id?: number;
    /** 属性编号 */
    code?: string;
    /** 属性名称 */
    name?: string;
    /** 属性类型 */
    type?: string;
    /** 是否显示在列表 */
    isList?: boolean;
    /** 是否作为查询条件 */
    isSearch?: boolean;
    /** 查询类型 */
    searchType?: string;
    /** 是否显示在表单 */
    isForm?: boolean;
    /** 表单组件 */
    formComponent?: string;
    /** 是否必填 */
    isRequired?: boolean;
  };

  type devEntityPropertyListParams = {
    /** 业务实体id */
    id: number;
  };

  type DevEntityPropertyVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 属性编号 */
    code?: string;
    /** 属性名称 */
    name?: string;
    /** 属性类型 */
    type?: string;
    /** 是否显示在列表 */
    isList?: boolean;
    /** 是否作为查询条件 */
    isSearch?: boolean;
    /** 查询类型 */
    searchType?: string;
    /** 是否显示在表单 */
    isForm?: boolean;
    /** 表单组件 */
    formComponent?: string;
    /** 是否必填 */
    isRequired?: boolean;
  };

  type DevEntityVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 实体编号 */
    code?: string;
    /** 实体姓名 */
    name?: string;
    /** 后端包名 */
    packageName?: string;
    /** 数据库表名 */
    tableName?: string;
    /** 实体备注 */
    remark?: string;
    /** 继承父类的模式 */
    extendMode?: string;
    /** 最后一次生成的作者名 */
    authName?: string;
    /** 最后一次生成java代码的路径 */
    javaCodePath?: string;
    /** 最后一次生成ui代码的路径 */
    uiCodePath?: string;
  };

  type executePipelineParams = {
    id: number;
  };

  type fieldListParams = {
    dataId: number;
  };

  type GenerateCodeDTO = {
    /** 所选实体id数组 */
    ids?: number[];
    /** 最后一次生成的作者名 */
    authName?: string;
    /** 最后一次生成java代码的路径 */
    javaCodePath?: string;
    /** 最后一次生成ui代码的路径 */
    uiCodePath?: string;
  };

  type getAvatarParams = {
    fileName: string;
  };

  type getBizDataParams = {
    dataId: number;
    bizDataId: string;
  };

  type LoginDTO = {
    /** 租户编号 */
    code?: string;
    /** 登录账号 */
    username: string;
    /** 登录密码 */
    password: string;
    /** 自动登录 */
    autoLogin?: boolean;
  };

  type MenuDataItem = {
    /** 菜单id */
    key?: string;
    /** 菜单名称 */
    name?: string;
    /** 菜单图标 */
    icon?: string;
    /** 菜单路径 */
    path?: string;
    /** 菜单排序 */
    sort?: number;
    /** 菜单类型 */
    type?: number;
    /** 子菜单 */
    children?: MenuDataItem[];
  };

  type menuDetailParams = {
    /** 记录id */
    id: number;
  };

  type MenuDTO = {
    id?: number;
    parentId?: number;
    /** 菜单编号 */
    code?: string;
    /** 菜单名称 */
    name?: string;
    /** 菜单图标 */
    icon?: string;
    /** 路由地址 */
    path?: string;
    /** 菜单排序 */
    sort?: number;
    /** 菜单类型 */
    type?: number;
    /** 菜单备注 */
    remark?: string;
  };

  type menuListByRoleParams = {
    roleId: number;
  };

  type menuListParams = {
    code?: string;
    name?: string;
  };

  type MenuTreeVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 父菜单id */
    parentId?: number;
    value?: number;
    key?: number;
    title?: string;
    children?: MenuTreeVO[];
  };

  type MenuVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 父菜单id */
    parentId?: number;
    /** 菜单编号 */
    code?: string;
    /** 菜单名称 */
    name?: string;
    /** 菜单图标 */
    icon?: string;
    /** 路由地址 */
    path?: string;
    /** 菜单排序 */
    sort?: number;
    /** 菜单类型 */
    type?: number;
    /** 菜单备注 */
    remark?: string;
    /** 子层级菜单 */
    children?: MenuVO[];
  };

  type parameterDetailParams = {
    id: number;
  };

  type ParameterDTO = {
    id?: number;
    /** 参数编号 */
    code?: string;
    /** 参数名称 */
    name?: string;
    /** 参数值 */
    value?: string;
    /** 参数备注 */
    remark?: string;
  };

  type parameterPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    code?: string;
    name?: string;
  };

  type ParameterVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 系统参数编号 */
    code?: string;
    /** 系统参数名称 */
    name?: string;
    /** 系统参数值 */
    value?: string;
    /** 系统参数备注 */
    remark?: string;
  };

  type pipelineDetailParams = {
    /** 记录id */
    id: number;
  };

  type PipelineDTO = {
    id?: number;
    /** 所属项目 */
    projectId?: number;
    /** 所属分组 */
    groupId?: number;
    /** 流水线名称 */
    pipelineName?: string;
    /** 流水线描述 */
    pipelineDesc?: string;
    /** 是否启用定时 */
    isSchedule?: boolean;
    /** 执行日 */
    dayOfWeek?: number[];
    /** 开始时间，HH:mm */
    startTime?: string;
    /** 结束时间，HH:mm */
    endTime?: string;
    /** 时间间隔，HH:mm:ss */
    intervalTime?: string;
    /** 时区 */
    timeZone?: string;
    /** 是否启用webhook */
    isWebhook?: boolean;
    /** webhook认证方式 */
    webhookAuthType?: number;
    /** webhook认证参数 */
    webhookAuthParams?: Record<string, any>;
    /** 是否启用邮件 */
    isEmail?: number;
    /** 邮件通知策略 */
    emailStrategy?: number[];
    /** 接收人 */
    emailReceiver?: string;
    /** 任务编排列表 */
    tasks?: PipelineTaskDTO[];
  };

  type pipelineGroupDetailParams = {
    /** 记录id */
    id: number;
  };

  type PipelineGroupDTO = {
    id?: number;
    /** 所属项目 */
    projectId?: number;
    /** 分组名称 */
    groupName?: string;
    /** 分组描述 */
    groupDesc?: string;
  };

  type pipelineGroupListParams = {
    projectId: number;
  };

  type pipelineGroupPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PipelineGroupVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属项目 */
    projectId?: number;
    /** 分组名称 */
    groupName?: string;
    /** 分组描述 */
    groupDesc?: string;
    /** 分组里的流水线列表 */
    pipelines?: PipelineVO[];
  };

  type pipelineHistoryDetailParams = {
    /** 记录id */
    id: number;
  };

  type pipelineHistoryPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    pipelineId: number;
    startTime?: string[];
  };

  type PipelineHistoryVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属流水线 */
    pipelineId?: number;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 耗时秒数 */
    executionTime?: number;
    /** 触发方式 */
    triggerType?: number;
    /** 流水线参数 */
    pipelineVars?: string;
    /** 执行状态 */
    executionStatus?: number;
  };

  type pipelineLogDetailParams = {
    /** 记录id */
    id: number;
  };

  type PipelineLogDTO = {
    id?: number;
    /** 所属流水线 */
    pipelineId?: number;
    /** 所属执行记录 */
    historyId?: number;
    /** 任务类型 */
    taskType?: string;
    /** 任务名称 */
    taskName?: string;
    /** 日志内容 */
    taskLog?: string;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 耗时 */
    executionTime?: number;
    /** 执行状态 */
    executionStatus?: number;
  };

  type pipelineLogListParams = {
    historyId: number;
  };

  type pipelineLogPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    historyId: number;
  };

  type PipelineLogVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属流水线 */
    pipelineId?: number;
    /** 所属执行记录 */
    historyId?: number;
    /** 任务类型 */
    taskType?: string;
    /** 任务名称 */
    taskName?: string;
    /** 日志内容 */
    taskLog?: string;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 耗时 */
    executionTime?: number;
    /** 执行状态 */
    executionStatus?: number;
  };

  type pipelinePageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type pipelineSelectParams = {
    projectId: number;
  };

  type pipelineTaskDetailParams = {
    /** 记录id */
    id: number;
  };

  type PipelineTaskDTO = {
    /** 所属项目 */
    projectId?: number;
    /** 所属流水线 */
    pipelineId?: number;
    /** 任务类型 */
    taskType?: string;
    /** 任务名称 */
    taskName?: string;
    /** 关联应用 */
    appId?: number;
    /** 关联API */
    apiId?: number;
    /** 关联数据 */
    dataId?: number;
    /** 任务配置 */
    taskConfig?: Record<string, any>;
  };

  type pipelineTaskPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    pipelineId?: string;
  };

  type PipelineTaskVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属项目 */
    projectId?: number;
    /** 所属流水线 */
    pipelineId?: number;
    /** 任务类型 */
    taskType?: string;
    /** 任务名称 */
    taskName?: string;
    /** 关联应用 */
    appId?: number;
    /** 关联API */
    apiId?: number;
    /** 关联数据 */
    dataId?: number;
    /** 任务配置 */
    taskConfig?: Record<string, any>;
  };

  type PipelineVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属项目 */
    projectId?: number;
    /** 所属分组 */
    groupId?: number;
    /** 流水线名称 */
    pipelineName?: string;
    /** 流水线描述 */
    pipelineDesc?: string;
    /** 是否启用定时 */
    isSchedule?: boolean;
    /** 执行日 */
    dayOfWeek?: number[];
    /** 开始时间，HH:mm */
    startTime?: string;
    /** 结束时间，HH:mm */
    endTime?: string;
    /** 时间间隔，HH:mm:ss */
    intervalTime?: string;
    /** 时区 */
    timeZone?: string;
    /** 是否启用webhook */
    isWebhook?: boolean;
    /** webhook认证方式 */
    webhookAuthType?: number;
    /** webhook认证参数 */
    webhookAuthParams?: Record<string, any>;
    /** 是否启用邮件 */
    isEmail?: number;
    /** 邮件通知策略 */
    emailStrategy?: number[];
    /** 接收人 */
    emailReceiver?: string;
    /** 流水线任务列表 */
    tasks?: PipelineTaskVO[];
    /** 下次执行时间 */
    nextFireTime?: string;
    latestHistory?: PipelineHistoryVO;
    /** webhook标识编号 */
    webhookCode?: string;
  };

  type PListAppApiVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: AppApiVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListAppVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: AppVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListDataVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: DataVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListDevEntityVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: DevEntityVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListMapStringObject = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: Record<string, any>[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListParameterVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: ParameterVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListPipelineGroupVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineGroupVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListPipelineHistoryVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineHistoryVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListPipelineLogVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineLogVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListPipelineTaskVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineTaskVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListPipelineVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListProjectVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: ProjectVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListRoleVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: RoleVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListSysApiVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: SysApiVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListTenantVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: TenantVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type PListUserVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: UserVO[];
    /** 当前页数 */
    current?: number;
    /** 每页记录数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
  };

  type projectDetailParams = {
    /** 记录id */
    id: number;
  };

  type ProjectDTO = {
    id?: number;
    /** 项目编号 */
    projectCode?: string;
    /** 项目名称 */
    projectName?: string;
    /** 项目描述 */
    projectDesc?: string;
  };

  type projectPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    projectCode?: string;
    projectName?: string;
  };

  type ProjectVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 项目编号 */
    projectCode?: string;
    /** 项目名称 */
    projectName?: string;
    /** 项目描述 */
    projectDesc?: string;
  };

  type RAppApiVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: AppApiVO;
  };

  type RAppVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: AppVO;
  };

  type RAuthUser = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: AuthUser;
  };

  type RBoolean = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: boolean;
  };

  type RDataVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: DataVO;
  };

  type RDepartmentVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: DepartmentVO;
  };

  type RDevEntityVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: DevEntityVO;
  };

  type resetPasswordParams = {
    id: number;
  };

  type RListAppApiVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: AppApiVO[];
  };

  type RListAppVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: AppVO[];
  };

  type RListDataFieldVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: DataFieldVO[];
  };

  type RListDataVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: DataVO[];
  };

  type RListDepartmentVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: DepartmentVO[];
  };

  type RListDevEntityPropertyVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: DevEntityPropertyVO[];
  };

  type RListDevEntityVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: DevEntityVO[];
  };

  type RListMenuDataItem = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: MenuDataItem[];
  };

  type RListMenuVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: MenuVO[];
  };

  type RListParameterVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: ParameterVO[];
  };

  type RListPipelineGroupVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineGroupVO[];
  };

  type RListPipelineHistoryVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineHistoryVO[];
  };

  type RListPipelineLogVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineLogVO[];
  };

  type RListPipelineTaskVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineTaskVO[];
  };

  type RListPipelineVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: PipelineVO[];
  };

  type RListProjectVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: ProjectVO[];
  };

  type RListRoleVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: RoleVO[];
  };

  type RListSysApiVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: SysApiVO[];
  };

  type RListTenantVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: TenantVO[];
  };

  type RLong = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: number;
  };

  type RMapStringObject = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: Record<string, any>;
  };

  type RMenuVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: MenuVO;
  };

  type RObject = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: Record<string, any>;
  };

  type roleDetailParams = {
    /** 记录id */
    id: number;
  };

  type RoleDTO = {
    id?: number;
    /** 角色编号 */
    code?: string;
    /** 角色名称 */
    name?: string;
    /** 角色备注 */
    remark?: string;
  };

  type RoleGrantDTO = {
    /** 角色id集合 */
    roleIds?: number[];
    /** 菜单id集合 */
    menuIds?: number[];
  };

  type rolePageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    code?: string;
    name?: string;
  };

  type RoleSelectVO = {
    /** 角色名称 */
    label?: string;
    /** 角色id */
    value?: number;
  };

  type RoleVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 角色编号 */
    code?: string;
    /** 角色姓名 */
    name?: string;
    /** 角色备注 */
    remark?: string;
  };

  type RParameterVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: ParameterVO;
  };

  type RPipelineGroupVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: PipelineGroupVO;
  };

  type RPipelineHistoryVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: PipelineHistoryVO;
  };

  type RPipelineLogVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: PipelineLogVO;
  };

  type RPipelineTaskVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: PipelineTaskVO;
  };

  type RPipelineVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: PipelineVO;
  };

  type RProjectVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: ProjectVO;
  };

  type RRoleVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: RoleVO;
  };

  type RString = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    /** 响应数据 */
    data?: string;
  };

  type RSysApiVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: SysApiVO;
  };

  type RTenantVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: TenantVO;
  };

  type RUserVO = {
    /** 响应状态码 */
    code?: number;
    /** true-成功，false-失败 */
    success?: boolean;
    /** 响应提示消息 */
    message?: string;
    data?: UserVO;
  };

  type saveBizDataParams = {
    dataId: number;
    bizDataId: string;
  };

  type SaveDevEntityPropertiesDTO = {
    /** 业务实体id */
    id?: number;
    /** 继承父类的模式 */
    extendMode?: string;
    /** 属性列表 */
    properties?: DevEntityPropertyDTO[];
  };

  type SelectVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 选项名称 */
    label?: string;
    /** 选项值 */
    value?: string;
  };

  type stopPipelineParams = {
    id: number;
  };

  type sysApiDetailParams = {
    id: number;
  };

  type SysApiDTO = {
    id?: number;
    /** 所属菜单id */
    menuId?: number;
    /** 接口编号 */
    code?: string;
    /** 接口名称 */
    name?: string;
    /** 接口地址 */
    path?: string;
    /** 请求方式 */
    method?: string;
    /** 备注 */
    remark?: string;
  };

  type sysApiPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    menuId?: number;
    code?: string;
    name?: string;
  };

  type SysApiVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 所属菜单id */
    menuId?: number;
    /** 所属菜单名称 */
    menuName?: string;
    /** 接口编号 */
    code?: string;
    /** 接口名称 */
    name?: string;
    /** 接口地址 */
    path?: string;
    /** 请求方式 */
    method?: string;
    /** 备注 */
    remark?: string;
  };

  type tenantDetailParams = {
    /** 记录id */
    id: number;
  };

  type TenantDTO = {
    id?: number;
    /** 租户id */
    tenantId?: string;
    /** 租户编号 */
    tenantCode?: string;
    /** 租户名称 */
    tenantName?: string;
    /** 到期时间 */
    expireTime?: string;
    /** 联系人姓名 */
    contactsName?: string;
    /** 联系人电话 */
    contactsPhone?: string;
    /** 联系人地址 */
    contactsAddress?: string;
  };

  type tenantPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    tenantCode?: string;
    tenantName?: string;
  };

  type TenantVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 租户id */
    tenantId?: string;
    /** 租户编号 */
    tenantCode?: string;
    /** 租户名称 */
    tenantName?: string;
    /** 到期时间 */
    expireTime?: string;
    /** 联系人姓名 */
    contactsName?: string;
    /** 联系人电话 */
    contactsPhone?: string;
    /** 联系人地址 */
    contactsAddress?: string;
  };

  type userDetailParams = {
    id: number;
  };

  type UserDTO = {
    id?: number;
    /** 编号 */
    code?: string;
    /** 姓名 */
    name?: string;
    /** 手机 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 所属部门id */
    departmentId?: number;
    /** 角色id */
    roleId?: number;
    /** 登录账号 */
    loginName?: string;
    /** 登录密码 */
    loginPassword?: string;
    /** 头像 */
    avatar?: string;
  };

  type UserInfoDTO = {
    /** 用户id */
    id?: number;
    /** 用户姓名 */
    name?: string;
    /** 手机号 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 头像 */
    avatar?: string;
  };

  type userPageParams = {
    /** 当前页数 */
    current?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 记录总数 */
    total?: number;
    departmentId?: number;
    code?: string;
    name?: string;
  };

  type UserVO = {
    /** id */
    id?: number;
    /** 业务状态 */
    status?: number;
    /** 编号 */
    code?: string;
    /** 用户姓名 */
    name?: string;
    /** 手机 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 所属部门id */
    departmentId?: number;
    /** 所属部门名称 */
    departmentName?: string;
    /** 所属角色id */
    roleId?: number;
    /** 所属角色名称 */
    roleName?: string;
    /** 登录账号 */
    loginName?: string;
    /** 头像 */
    avatar?: string;
  };
}
