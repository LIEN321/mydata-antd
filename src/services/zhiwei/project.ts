// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新项目 POST /project */
export async function saveProject(body: API.ProjectDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除项目 DELETE /project */
export async function deleteProjects(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/project`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 项目详情 GET /project/${param0} */
export async function projectDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.projectDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RProjectVO>(`/api/project/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除项目 DELETE /project/${param0} */
export async function deleteProject(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteProjectParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/project/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有项目 GET /project/list */
export async function projectList(options?: { [key: string]: any }) {
  return request<API.RListProjectVO>(`/api/project/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询项目 GET /project/page */
export async function projectPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.projectPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListProjectVO>(`/api/project/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询所有项目 GET /project/select */
export async function projectSelect(options?: { [key: string]: any }) {
  return request<API.SelectVO[]>(`/api/project/select`, {
    method: 'GET',
    ...(options || {}),
  });
}
