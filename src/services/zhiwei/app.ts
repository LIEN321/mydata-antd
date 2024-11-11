// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新应用 POST /app */
export async function saveApp(body: API.AppDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/app`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除应用 DELETE /app */
export async function deleteApps(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/app`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 应用详情 GET /app/${param0} */
export async function appDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.appDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RAppVO>(`/api/app/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除应用 DELETE /app/${param0} */
export async function deleteApp(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAppParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/app/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有应用 GET /app/list */
export async function appList(options?: { [key: string]: any }) {
  return request<API.RListAppVO>(`/api/app/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询应用 GET /app/page */
export async function appPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.appPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListAppVO>(`/api/app/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询所有应用 GET /app/select */
export async function appSelect(options?: { [key: string]: any }) {
  return request<API.SelectVO[]>(`/api/app/select`, {
    method: 'GET',
    ...(options || {}),
  });
}
