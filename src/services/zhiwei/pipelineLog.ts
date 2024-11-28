// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新流水线执行日志 POST /pipelineLog */
export async function savePipelineLog(body: API.PipelineLogDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/pipelineLog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除流水线执行日志 DELETE /pipelineLog */
export async function deletePipelineLogs(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/pipelineLog`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 流水线执行日志详情 GET /pipelineLog/${param0} */
export async function pipelineLogDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineLogDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RPipelineLogVO>(`/api/pipelineLog/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除流水线执行日志 DELETE /pipelineLog/${param0} */
export async function deletePipelineLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePipelineLogParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/pipelineLog/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有流水线执行日志 GET /pipelineLog/list */
export async function pipelineLogList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineLogListParams,
  options?: { [key: string]: any },
) {
  return request<API.RListPipelineLogVO>(`/api/pipelineLog/list`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询流水线执行日志 GET /pipelineLog/page */
export async function pipelineLogPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineLogPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListPipelineLogVO>(`/api/pipelineLog/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
