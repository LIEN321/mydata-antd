// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新用户的集成配置 POST /userConfig */
export async function saveUserConfig(body: string, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/userConfig`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 最后管理的项目 GET /userConfig/latestProject */
export async function latestProject(options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/userConfig/latestProject`, {
    method: 'GET',
    ...(options || {}),
  });
}
