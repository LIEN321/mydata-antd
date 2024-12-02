export const API_GET_JSON = "API_GET_JSON";
export const API_SEND_DATA = "API_SEND_DATA";
export const WEBHOOK_GET_JSON = "WEBHOOK_GET_JSON";
export const API_GET_VAR = "API_GET_VAR";
export const SAVE_DATA = "SAVE_DATA";
export const QUERY_DATA = "QUERY_DATA";
export const JSON_TO_DATA = "JSON_TO_DATA";
export const FILTER_DATA = "FILTER_DATA";
export const OPERATE_DATA = "OPERATE_DATA";
export const WRITE_EXCEL = "WRITE_EXCEL";
export const SEND_EMAIL = "SEND_EMAIL";

export const TASK_TEMPLATE = {
    API_GET_JSON: {
        taskType: API_GET_JSON,
        taskName: "从API获取JSON",
        taskConfig: {
            INPUT: {},
            OUTPUT: { ORIGIN_JSON: "ORIGIN_JSON", DATA_JSON: "DATA_JSON" },
            BATCH: { ENABLE: false, INTERVAL: 5, END_TYPE: 0, PARAMS: [] },
        },
    },
    API_SEND_DATA: { taskType: API_SEND_DATA, taskName: "向API发送数据", taskConfig: { INPUT: {}, OUTPUT: {} }, },
    WEBHOOK_GET_JSON: { taskType: WEBHOOK_GET_JSON, taskName: "从Webhook接收JSON", taskConfig: { INPUT: { WEBHOOK_JSON: "WEBHOOK_JSON" }, OUTPUT: { ORIGIN_JSON: "ORIGIN_JSON", DATA_JSON: "DATA_JSON" } }, },
    API_GET_VAR: { taskType: API_GET_VAR, taskName: "从API获取参数", taskConfig: { INPUT: {}, OUTPUT: {} }, },

    JSON_TO_DATA: { taskType: JSON_TO_DATA, taskName: "JSON转数据", taskConfig: { INPUT: { DATA_JSON: "DATA_JSON" }, OUTPUT: { BIZ_DATA: "BIZ_DATA", DATA_CODE: "DATA_CODE" } } },
    FILTER_DATA: { taskType: FILTER_DATA, taskName: "过滤数据", taskConfig: { INPUT: {}, OUTPUT: {} }, },
    OPERATE_DATA: { taskType: OPERATE_DATA, taskName: "处理数据", taskConfig: { INPUT: {}, OUTPUT: {} }, },
    WRITE_EXCEL: { taskType: WRITE_EXCEL, taskName: "写入Excel文件", taskConfig: { INPUT: {}, OUTPUT: {} }, },

    SAVE_DATA: { taskType: SAVE_DATA, taskName: "保存数据到数仓", taskConfig: { INPUT: { BIZ_DATA: "BIZ_DATA" }, OUTPUT: { SAVED_DATA: "SAVED_DATA" } }, },
    QUERY_DATA: { taskType: QUERY_DATA, taskName: "从数仓查询数据", taskConfig: { INPUT: {}, OUTPUT: {} }, },

    SEND_EMAIL: { taskType: SEND_EMAIL, taskName: "发送邮件", taskConfig: { INPUT: {}, OUTPUT: {} }, },
}

export type TaskKey = keyof typeof TASK_TEMPLATE;