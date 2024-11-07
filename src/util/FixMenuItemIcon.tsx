import { MenuDataItem } from "@ant-design/pro-layout";
import React from "react";
import * as allIcons from '@ant-design/icons';

const fixMenuItemIcon = (menus: MenuDataItem[], iconType: string = 'Outlined'): MenuDataItem[] => {
    menus.forEach((item: MenuDataItem) => {
        const { icon, children } = item;
        if (typeof icon === 'string') {
            item.icon = getIcon(icon);
        }

        children && children.length > 0 ? (item.children = fixMenuItemIcon(children)) : null;
    });
    return menus;
};
export default fixMenuItemIcon;

/**
 * 根据名称 获取图标组件
 * @param name 图标名称
 * @param iconType 图标类型
 * @returns 图标组件
 */
export function getIcon(name: string, iconType: string = 'Outlined') {
    if (!name) {
        return <></>
    }
    const fixIconName = name + iconType;
    return React.createElement(allIcons[fixIconName] || allIcons[name]);
}