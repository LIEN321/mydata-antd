// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新标准数据 POST /data */
export async function saveData(body: API.DataDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除标准数据 DELETE /data */
export async function deleteDatas(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/data`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 标准数据详情 GET /data/${param0} */
export async function dataDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RDataVO>(`/api/data/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除标准数据 DELETE /data/${param0} */
export async function deleteData(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDataParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/data/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有标准数据 GET /data/list */
export async function dataList(options?: { [key: string]: any }) {
  return request<API.RListDataVO>(`/api/data/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询标准数据 GET /data/page */
export async function dataPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListDataVO>(`/api/data/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询标准数据 GET /data/select */
export async function dataSelect(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataSelectParams,
  options?: { [key: string]: any },
) {
  return request<API.SelectVO[]>(`/api/data/select`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
