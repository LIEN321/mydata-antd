// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新系统接口 POST /sys_api */
export async function saveSysApi(body: API.SysApiDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/sys_api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除系统接口 DELETE /sys_api */
export async function deleteSysApis(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/sys_api`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 系统接口详情 GET /sys_api/${param0} */
export async function sysApiDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sysApiDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RSysApiVO>(`/api/sys_api/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除系统接口 DELETE /sys_api/${param0} */
export async function deleteSysApi(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteSysApiParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/sys_api/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有系统接口 GET /sys_api/list */
export async function sysApiList(options?: { [key: string]: any }) {
  return request<API.RListSysApiVO>(`/api/sys_api/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询系统接口 GET /sys_api/page */
export async function sysApiPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sysApiPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListSysApiVO>(`/api/sys_api/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
