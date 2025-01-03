// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新流水线分组 POST /pipelineGroup */
export async function savePipelineGroup(
  body: API.PipelineGroupDTO,
  options?: { [key: string]: any },
) {
  return request<API.RLong>(`/api/pipelineGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除流水线分组 DELETE /pipelineGroup */
export async function deletePipelineGroups(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/pipelineGroup`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 流水线分组详情 GET /pipelineGroup/${param0} */
export async function pipelineGroupDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineGroupDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RPipelineGroupVO>(`/api/pipelineGroup/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除流水线分组 DELETE /pipelineGroup/${param0} */
export async function deletePipelineGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePipelineGroupParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/pipelineGroup/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询项目中的流水线分组 GET /pipelineGroup/list */
export async function pipelineGroupList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineGroupListParams,
  options?: { [key: string]: any },
) {
  return request<API.RListPipelineGroupVO>(`/api/pipelineGroup/list`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询流水线分组 GET /pipelineGroup/page */
export async function pipelineGroupPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineGroupPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListPipelineGroupVO>(`/api/pipelineGroup/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
