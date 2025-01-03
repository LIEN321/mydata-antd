// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 业务实体属性列表 GET /dev_entity_property/list */
export async function devEntityPropertyList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.devEntityPropertyListParams,
  options?: { [key: string]: any },
) {
  return request<API.RListDevEntityPropertyVO>(`/api/dev_entity_property/list`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
