/**
 * 执行状态：待执行
*/
export const STATUS_READY = 0;
/**
 * 执行状态：运行中
*/
export const STATUS_RUNNING = 1;
/**
 * 执行状态：中止
*/
export const STATUS_STOPPED = 2;
/**
 * 执行状态：成功
*/
export const STATUS_SUCCESS = 3;
/**
 * 执行状态：失败
*/
export const STATUS_FAILED = 4;


/**
 * 操作类型：数据提供者
 */
export const OP_TYPE_PROVIDER = 1;

/**
 * 任务类型
 */
export const API_GET_JSON = "API_GET_JSON";
export const API_SEND_DATA = "API_SEND_DATA";
export const WEBHOOK_GET_JSON = "WEBHOOK_GET_JSON";
export const WEBHOOK_CALL_PIPELINE = "WEBHOOK_CALL_PIPELINE";
export const API_GET_VAR = "API_GET_VAR";
export const SAVE_DATA = "SAVE_DATA";
export const QUERY_DATA = "QUERY_DATA";
export const JSON_TO_DATA = "JSON_TO_DATA";
export const DATA_TO_JSON = "DATA_TO_JSON";
export const FILTER_DATA = "FILTER_DATA";
export const PROCESS_DATA = "PROCESS_DATA";
export const WRITE_EXCEL = "WRITE_EXCEL";
export const SEND_EMAIL = "SEND_EMAIL";

/**
 * 任务类型对应的配置模板
 */
export const TASK_TEMPLATE = {
    // 从API获取JSON
    API_GET_JSON: {
        "taskType": API_GET_JSON,
        "taskName": "从API获取JSON",
        "taskConfig": {
            "INPUT": {},
            "OUTPUT": { "ORIGIN_JSON": "ORIGIN_JSON", "DATA_JSON": "DATA_JSON" },
            "BATCH": { "ENABLE": false, "INTERVAL": 5, "PARAMS": [] },
        },
    },

    // 向API发送数据
    API_SEND_DATA: {
        "taskType": API_SEND_DATA,
        "taskName": "向API发送数据",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": {},
            "BATCH": { "ENABLE": false, "INTERVAL": 5, "PARAMS": [], "COUNT": 100 },
        },
    },

    // 从Webhook接收JSON
    WEBHOOK_GET_JSON: {
        "taskType": WEBHOOK_GET_JSON,
        "taskName": "从Webhook接收JSON",
        "taskConfig": {
            "INPUT": { "WEBHOOK_JSON": "WEBHOOK_JSON" },
            "OUTPUT": { "ORIGIN_JSON": "ORIGIN_JSON", "DATA_JSON": "DATA_JSON" },
        },
    },

    // 用Webhook触发流水线
    WEBHOOK_CALL_PIPELINE: {
        "taskType": WEBHOOK_CALL_PIPELINE,
        "taskName": "用Webhook触发流水线",
        "taskConfig": {
            "INPUT": { "DATA_JSON": "DATA_JSON" },
            "OUTPUT": { "ORIGIN_JSON": "ORIGIN_JSON", "DATA_JSON": "DATA_JSON" },
            "PIPELINE_ID": null,
        },
    },

    // 从API获取参数
    API_GET_VAR: {
        "taskType": API_GET_VAR,
        "taskName": "从API获取参数",
        "taskConfig": {
            "INPUT": {},
            "OUTPUT": {},
        },
    },

    // JSON转数据
    JSON_TO_DATA: {
        "taskType": JSON_TO_DATA,
        "taskName": "JSON转数据",
        "taskConfig": {
            "INPUT": { "ORIGIN_JSON": "ORIGIN_JSON", "DATA_JSON": "DATA_JSON" },
            "OUTPUT": { "BIZ_DATA": "BIZ_DATA" },
            "FIELD_MAPPING": [],
        }
    },

    // 数据转JSON
    DATA_TO_JSON: {
        "taskType": DATA_TO_JSON,
        "taskName": "数据转JSON",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": { "DATA_JSON": "DATA_JSON" },
            "JSON_TEMPLATE": "${DATA_JSON}",
            "FIELD_MAPPING": [],
        }
    },

    // 过滤数据
    FILTER_DATA: {
        "taskType": FILTER_DATA,
        "taskName": "过滤数据",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": { "BIZ_DATA": "BIZ_DATA", "FILTER_BLOCKED_DATA": "FILTER_BLOCKED_DATA" },
            "DATA_FILTER": [],
        },
    },

    // 处理数据
    PROCESS_DATA: {
        "taskType": PROCESS_DATA,
        "taskName": "处理数据",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": { "BIZ_DATA": "BIZ_DATA" },
            "DATA_PROCESS": [],
        },
    },

    // 数据写入Excel
    WRITE_EXCEL: {
        "taskType": WRITE_EXCEL,
        "taskName": "数据写入Excel",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": { "EXCEL_FILE": "EXCEL_FILE" },
        },
    },

    // 保存数据到数仓
    SAVE_DATA: {
        "taskType": SAVE_DATA,
        "taskName": "保存数据到数仓",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": { "SAVED_DATA": "SAVED_DATA" },
        },
    },

    // 从数仓查询数据
    QUERY_DATA: {
        "taskType": QUERY_DATA,
        "taskName": "从数仓查询数据",
        "taskConfig": {
            "INPUT": {},
            "OUTPUT": { "BIZ_DATA": "BIZ_DATA" },
            "DATA_FILTER": [],
        },
    },

    // 发送邮件
    SEND_EMAIL: {
        "taskType": SEND_EMAIL,
        "taskName": "发送邮件",
        "taskConfig": {
            "INPUT": {},
            "OUTPUT": {},
            "EMAIL": {
                "ADDRESS": "",
                "SUBJECT": "",
                "CONTENT": "",
                "FILE": "",
            }
        },
    },
}

export type TaskKey = keyof typeof TASK_TEMPLATE;

export const openLogWindow = (historyId: string) => {
    // url参数
    const query = new URLSearchParams({ historyId }).toString();
    window.open(`/mydata/pipeline/history/log?${query}`, '_blank');
}

/** 任务过滤条件值类型 - 值类型    */
export const TASK_FILTER_TYPE_VALUE = 1;
/** 任务过滤条件值类型 - 字段名*/
export const TASK_FILTER_TYPE_FIELD = 2;