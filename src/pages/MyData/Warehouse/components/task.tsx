export const API_GET_DATA = "API_GET_DATA";
export const API_SEND_DATA = "API_SEND_DATA";
export const WEBHOOK_GET_DATA = "WEBHOOK_GET_DATA";
export const API_GET_VAR = "API_GET_VAR";
export const SAVE_DATA = "SAVE_DATA";
export const QUERY_DATA = "QUERY_DATA";
export const FILTER_DATA = "FILTER_DATA";
export const OPERATE_DATA = "OPERATE_DATA";
export const WRITE_EXCEL = "WRITE_EXCEL";
export const SEND_EMAIL = "SEND_EMAIL";

export const TASK_TEMPLATE = {
    API_GET_DATA: { taskType: API_GET_DATA, taskName: "从API获取数据", },
    API_SEND_DATA: { taskType: API_SEND_DATA, taskName: "向API发送数据", },
    WEBHOOK_GET_DATA: { taskType: WEBHOOK_GET_DATA, taskName: "解析webhook数据", },
    API_GET_VAR: { taskType: API_GET_VAR, taskName: "从API获取参数", },
    SAVE_DATA: { taskType: SAVE_DATA, taskName: "保存数据到数仓", },
    QUERY_DATA: { taskType: QUERY_DATA, taskName: "从数仓查询数据", },
    FILTER_DATA: { taskType: FILTER_DATA, taskName: "过滤数据", },
    OPERATE_DATA: { taskType: OPERATE_DATA, taskName: "处理数据", },
    WRITE_EXCEL: { taskType: WRITE_EXCEL, taskName: "写入Excel文件", },
    SEND_EMAIL: { taskType: SEND_EMAIL, taskName: "发送邮件", },
}

export type TaskKey = keyof typeof TASK_TEMPLATE;