// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新系统租户 POST /tenant */
export async function saveTenant(body: API.TenantDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/tenant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除系统租户 DELETE /tenant */
export async function deleteTenants(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/tenant`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 系统租户详情 GET /tenant/${param0} */
export async function tenantDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.tenantDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RTenantVO>(`/api/tenant/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除系统租户 DELETE /tenant/${param0} */
export async function deleteTenant(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTenantParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/tenant/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有系统租户 GET /tenant/list */
export async function tenantList(options?: { [key: string]: any }) {
  return request<API.RListTenantVO>(`/api/tenant/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询系统租户 GET /tenant/page */
export async function tenantPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.tenantPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListTenantVO>(`/api/tenant/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
