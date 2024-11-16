// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新流水线任务 POST /pipelineTask */
export async function savePipelineTask(
  body: API.PipelineTaskDTO,
  options?: { [key: string]: any },
) {
  return request<API.RLong>(`/api/pipelineTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除流水线任务 DELETE /pipelineTask */
export async function deletePipelineTasks(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/pipelineTask`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 流水线任务详情 GET /pipelineTask/${param0} */
export async function pipelineTaskDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineTaskDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RPipelineTaskVO>(`/api/pipelineTask/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除流水线任务 DELETE /pipelineTask/${param0} */
export async function deletePipelineTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePipelineTaskParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/pipelineTask/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有流水线任务 GET /pipelineTask/list */
export async function pipelineTaskList(options?: { [key: string]: any }) {
  return request<API.RListPipelineTaskVO>(`/api/pipelineTask/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询流水线任务 GET /pipelineTask/page */
export async function pipelineTaskPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pipelineTaskPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListPipelineTaskVO>(`/api/pipelineTask/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
