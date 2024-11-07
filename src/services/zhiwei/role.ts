// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新角色 POST /role */
export async function saveRole(body: API.RoleDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除角色 DELETE /role */
export async function deleteRoles(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/role`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 角色详情 GET /role/${param0} */
export async function roleDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.roleDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RRoleVO>(`/api/role/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除角色 DELETE /role/${param0} */
export async function deleteRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRoleParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/role/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 授权角色权限 PUT /role/grant */
export async function grantRole(body: API.RoleGrantDTO, options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/role/grant`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询所有角色 GET /role/list */
export async function roleList(options?: { [key: string]: any }) {
  return request<API.RListRoleVO>(`/api/role/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询角色 GET /role/page */
export async function rolePage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.rolePageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListRoleVO>(`/api/role/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询所有角色 GET /role/select */
export async function roleSelect(options?: { [key: string]: any }) {
  return request<API.RoleSelectVO[]>(`/api/role/select`, {
    method: 'GET',
    ...(options || {}),
  });
}
