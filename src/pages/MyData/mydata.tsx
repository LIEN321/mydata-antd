import { values } from "lodash";

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
 * 定时刷新的间隔
 */
export const timeout = 2000;

/**
 * 任务类型
 */
export const API_GET_JSON = "API_GET_JSON";
export const API_SEND_DATA = "API_SEND_DATA";
export const WEBHOOK_GET_JSON = "WEBHOOK_GET_JSON";
export const TRIGGER_PIPELINE = "TRIGGER_PIPELINE";
export const SAVE_DATA = "SAVE_DATA";
export const QUERY_DATA = "QUERY_DATA";
export const TRUNCATE_DATA = "TRUNCATE_DATA";
export const JSON_TO_DATA = "JSON_TO_DATA";
export const DATA_TO_JSON = "DATA_TO_JSON";
export const FILTER_DATA = "FILTER_DATA";
export const PROCESS_DATA = "PROCESS_DATA";
export const WRITE_EXCEL = "WRITE_EXCEL";
export const SEND_EMAIL = "SEND_EMAIL";
export const JSON_TO_VAR = "JSON_TO_VAR";
export const STOP_PIPELINE = "STOP_PIPELINE";

/**
 * 任务类型对应的配置模板
 */
export const TASK_TEMPLATE = {
    // 从API获取JSON
    API_GET_JSON: {
        "taskType": API_GET_JSON,
        "typeName": "从API获取JSON",
        "taskName": "从API获取JSON",
        "taskConfig": {
            "INPUT": { "PARAM_DATA": "" },
            "OUTPUT": { "PIPELINE_JSON": "PIPELINE_JSON" },
            "BATCH": { "ENABLE": false, "INTERVAL": 5, "PARAMS": [] },
            "FIELD_MAPPING": {},
        },
    },

    // 向API发送数据
    API_SEND_DATA: {
        "taskType": API_SEND_DATA,
        "typeName": "向API发送数据",
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
        "typeName": "从Webhook接收JSON",
        "taskName": "从Webhook接收JSON",
        "taskConfig": {
            "INPUT": { "WEBHOOK_JSON": "WEBHOOK_JSON" },
            "OUTPUT": { "PIPELINE_JSON": "PIPELINE_JSON" },
        },
    },

    // 用Webhook触发流水线
    TRIGGER_PIPELINE: {
        "taskType": TRIGGER_PIPELINE,
        "typeName": "触发流水线",
        "taskName": "触发流水线",
        "taskConfig": {
            "INPUT": { "PIPELINE_JSON": "PIPELINE_JSON" },
            "OUTPUT": {},
            "PIPELINE_ID": null,
            "SYNC": true,
        },
    },

    // 根据配置的条件 停止流水线
    STOP_PIPELINE: {
        "taskType": STOP_PIPELINE,
        "typeName": "停止流水线",
        "taskName": "停止流水线",
        "taskConfig": {
            "INPUT": {},
            "OUTPUT": {},
            "STOP_CONDITION": [],
        },
    },

    // JSON转数据
    JSON_TO_DATA: {
        "taskType": JSON_TO_DATA,
        "typeName": "JSON转数据",
        "taskName": "JSON转数据",
        "taskConfig": {
            "INPUT": { "PIPELINE_JSON": "PIPELINE_JSON" },
            "OUTPUT": { "BIZ_DATA": "BIZ_DATA" },
            "FIELD_MAPPING": {},
        }
    },

    // 数据转JSON
    DATA_TO_JSON: {
        "taskType": DATA_TO_JSON,
        "typeName": "数据转JSON",
        "taskName": "数据转JSON",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": { "PIPELINE_JSON": "PIPELINE_JSON" },
            "JSON_TEMPLATE": "${DATA_JSON}",
            "FIELD_MAPPING": {},
            "ID_FIELD": [],
        }
    },

    // 过滤数据
    FILTER_DATA: {
        "taskType": FILTER_DATA,
        "typeName": "过滤数据",
        "taskName": "过滤数据",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA", "PARAM_DATA": "" },
            "OUTPUT": { "BIZ_DATA": "BIZ_DATA", "FILTER_BLOCKED_DATA": "FILTER_BLOCKED_DATA" },
            "DATA_FILTER": [],
        },
    },

    // 处理数据
    PROCESS_DATA: {
        "taskType": PROCESS_DATA,
        "typeName": "处理数据",
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
        "typeName": "数据写入Excel",
        "taskName": "数据写入Excel",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": { "EXCEL_FILE": "EXCEL_FILE" },
        },
    },

    // 保存数据到数仓
    SAVE_DATA: {
        "taskType": SAVE_DATA,
        "typeName": "保存数据到数仓",
        "taskName": "保存数据到数仓",
        "taskConfig": {
            "INPUT": { "BIZ_DATA": "BIZ_DATA" },
            "OUTPUT": { "SAVED_DATA": "SAVED_DATA" },
        },
    },

    // 从数仓查询数据
    QUERY_DATA: {
        "taskType": QUERY_DATA,
        "typeName": "从数仓查询数据",
        "taskName": "从数仓查询数据",
        "taskConfig": {
            "INPUT": { "PARAM_DATA": "" },
            "OUTPUT": { "BIZ_DATA": "BIZ_DATA" },
            "DATA_FILTER": [],
            "CONDITION": "",
        },
    },

    // 从数仓清空指定数据集合
    TRUNCATE_DATA: {
        "taskType": TRUNCATE_DATA,
        "typeName": "清空数据",
        "taskName": "清空数据",
        "taskConfig": {
            "INPUT": {},
            "OUTPUT": {},
        },
    },

    // 发送邮件
    SEND_EMAIL: {
        "taskType": SEND_EMAIL,
        "typeName": "发送邮件",
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

    // JSON值存入变量
    JSON_TO_VAR: {
        "taskType": JSON_TO_VAR,
        "typeName": "JSON值存入变量",
        "taskName": "JSON值存入变量",
        "taskConfig": {
            "INPUT": { "PIPELINE_JSON": "PIPELINE_JSON" },
            "OUTPUT": {},
            "VAR_MAPPING": [],
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

/** 数据处理 */
export const dataOp = [
    {
        label: "无", value: ""
    },
    {
        label: "数字", title: "数字", options: [
            { label: "+", value: "+" },
            { label: "-", value: "-" },
            { label: "*", value: "*" },
            { label: "÷", value: "/" },
            { label: "无效时置0", value: "zeroIfNull" },
        ]
    },
    {
        label: "字符串", title: "字符串", options: [
            { label: "md5", value: "md5" },
            { label: "base64", value: "base64" },
            { label: "前置添加", value: "prepend" },
            { label: "后置追加", value: "append" },
            { label: "置空(empty)", value: "empty" },
            { label: "无效时置空(emptyIfNull)", value: "emptyIfNull" },
        ]
    },
    {
        label: "日期时间", title: "日期时间", options: [
            { label: "增加秒数", value: "addSecond" },
        ]
    },
    {
        label: "通用", title: "通用", options: [
            { label: "置空(null)", value: "null" },
        ]
    },
]

/** 变量处理 */
export const varOp = [
    {
        label: "无", value: ""
    },
    {
        label: "数字", title: "数字", options: [
            { label: "无效时置0", value: "zeroIfNull" },
        ]
    },
    {
        label: "字符串", title: "字符串", options: [
            { label: "md5", value: "md5" },
            { label: "base64", value: "base64" },
            { label: "前置添加", value: "prepend" },
            { label: "后置追加", value: "append" },
            { label: "置空(empty)", value: "empty" },
            { label: "无效时置空(emptyIfNull)", value: "emptyIfNull" },
        ]
    },
]