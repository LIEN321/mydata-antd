// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新流水线 POST /pipeline */
export async function savePipeline(body: API.PipelineDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/pipeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除流水线 DELETE /pipeline */
export async function deletePipelines(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/pipeline`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 流水线详情 GET /pipeline/${param0} */
export async function pipelineDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RPipelineVO>(`/api/pipeline/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除流水线 DELETE /pipeline/${param0} */
export async function deletePipeline(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePipelineParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/pipeline/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有流水线 GET /pipeline/list */
export async function pipelineList(options?: { [key: string]: any }) {
  return request<API.RListPipelineVO>(`/api/pipeline/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询流水线 GET /pipeline/page */
export async function pipelinePage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelinePageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListPipelineVO>(`/api/pipeline/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
