// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取头像图片 GET /me/avatar/${param0} */
export async function getAvatar(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAvatarParams,
  options?: { [key: string]: any },
) {
  const { fileName: param0, ...queryParams } = params;
  return request<string>(`/api/me/avatar/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 修改密码 POST /me/changePassword */
export async function changePassword(
  body: API.ChangePasswordDTO,
  options?: { [key: string]: any },
) {
  return request<API.RObject>(`/api/me/changePassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询个人基本信息 GET /me/info */
export async function userInfo(options?: { [key: string]: any }) {
  return request<API.RAuthUser>(`/api/me/info`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新个人基本信息 POST /me/update */
export async function updateUserInfo(body: API.UserInfoDTO, options?: { [key: string]: any }) {
  return request<API.RObject>(`/api/me/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 上传头像图片 POST /me/uploadAvatar */
export async function uploadAvatar(body: {}, options?: { [key: string]: any }) {
  return request<API.RString>(`/api/me/uploadAvatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
