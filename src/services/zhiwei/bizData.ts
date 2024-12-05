// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页查询业务数据 GET /bizData/bizDataPage */
export async function bizDataPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.bizDataPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListMapStringObject>(`/api/bizData/bizDataPage`, {
    method: 'GET',
    params: {
      ...params,
      params: undefined,
      ...params['params'],
    },
    ...(options || {}),
  });
}

/** 查询标准数据的可见字段列表 GET /bizData/fieldList */
export async function bizDataFieldList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.bizDataFieldListParams,
  options?: { [key: string]: any },
) {
  return request<API.RListDataFieldVO>(`/api/bizData/fieldList`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
