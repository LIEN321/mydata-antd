// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新用户 POST /user */
export async function saveUser(body: API.UserDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除用户 DELETE /user */
export async function deleteUsers(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/user`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户详情 GET /user/${param0} */
export async function userDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RUserVO>(`/api/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除用户 DELETE /user/${param0} */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页查询用户 GET /user/page */
export async function userPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.userPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListUserVO>(`/api/user/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/resetPassword/${param0} */
export async function resetPassword(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.resetPasswordParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RString>(`/api/user/resetPassword/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}
