// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新系统参数 POST /parameter */
export async function saveParameter(body: API.ParameterDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/parameter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除系统参数 DELETE /parameter */
export async function deleteParameters(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/parameter`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 系统参数详情 GET /parameter/${param0} */
export async function parameterDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.parameterDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RParameterVO>(`/api/parameter/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除系统参数 DELETE /parameter/${param0} */
export async function deleteParameter(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteParameterParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/parameter/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有系统参数 GET /parameter/list */
export async function parameterList(options?: { [key: string]: any }) {
  return request<API.RListParameterVO>(`/api/parameter/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询系统参数 GET /parameter/page */
export async function parameterPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.parameterPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListParameterVO>(`/api/parameter/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
