// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新应用接口 POST /appApi */
export async function saveAppApi(body: API.AppApiDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/appApi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除应用接口 DELETE /appApi */
export async function deleteAppApis(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/appApi`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 应用接口详情 GET /appApi/${param0} */
export async function appApiDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.appApiDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RAppApiVO>(`/api/appApi/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除应用接口 DELETE /appApi/${param0} */
export async function deleteAppApi(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAppApiParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/appApi/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有应用接口 GET /appApi/list */
export async function appApiList(options?: { [key: string]: any }) {
  return request<API.RListAppApiVO>(`/api/appApi/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询应用接口 GET /appApi/page */
export async function appApiPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.appApiPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListAppApiVO>(`/api/appApi/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询接口 GET /appApi/select */
export async function apiSelect(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.apiSelectParams,
  options?: { [key: string]: any },
) {
  return request<API.SelectVO[]>(`/api/appApi/select`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询认证接口 GET /appApi/select_auth */
export async function authApiSelect(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.authApiSelectParams,
  options?: { [key: string]: any },
) {
  return request<API.SelectVO[]>(`/api/appApi/select_auth`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
