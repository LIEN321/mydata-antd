// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 批量删除流水线执行记录 DELETE /pipelineHistory */
export async function deletePipelineHistorys(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/pipelineHistory`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 流水线执行记录详情 GET /pipelineHistory/${param0} */
export async function pipelineHistoryDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineHistoryDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RPipelineHistoryVO>(`/api/pipelineHistory/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除流水线执行记录 DELETE /pipelineHistory/${param0} */
export async function deletePipelineHistory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePipelineHistoryParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/pipelineHistory/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有流水线执行记录 GET /pipelineHistory/list */
export async function pipelineHistoryList(options?: { [key: string]: any }) {
  return request<API.RListPipelineHistoryVO>(`/api/pipelineHistory/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询流水线执行记录 GET /pipelineHistory/page */
export async function pipelineHistoryPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineHistoryPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListPipelineHistoryVO>(`/api/pipelineHistory/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
