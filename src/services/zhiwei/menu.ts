// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新菜单 POST /menu */
export async function saveMenu(body: API.MenuDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/menu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除菜单 DELETE /menu */
export async function deleteMenus(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/menu`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 菜单详情 GET /menu/${param0} */
export async function menuDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.menuDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RMenuVO>(`/api/menu/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除菜单 DELETE /menu/${param0} */
export async function deleteMenu(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMenuParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/menu/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询菜单 GET /menu/list */
export async function menuList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.menuListParams,
  options?: { [key: string]: any },
) {
  return request<API.RListMenuVO>(`/api/menu/list`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询角色关联的菜单 GET /menu/listByRole/${param0} */
export async function menuListByRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.menuListByRoleParams,
  options?: { [key: string]: any },
) {
  const { roleId: param0, ...queryParams } = params;
  return request<string[]>(`/api/menu/listByRole/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 菜单目录树 GET /menu/tree */
export async function menuTree(options?: { [key: string]: any }) {
  return request<API.MenuTreeVO[]>(`/api/menu/tree`, {
    method: 'GET',
    ...(options || {}),
  });
}
