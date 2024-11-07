import { Tree } from "antd";
import { Key, useEffect, useState } from "react";

export type FixSelectedTreeProps = {
    /** 树的数据 */
    treeData?: any[];
    /** 点击树节点触发的事件 */
    onSelect?: (selectedKeys: Key[], info: {
        selected: boolean;
    }) => void;
    /** 是否添加默认根节点“全部” */
    appendRoot?: boolean;
};

const FixSelectedTree: React.FC<FixSelectedTreeProps> = (props) => {
    const [selectedKeys, setSelectedKeys] = useState<any>(['']);// 初始选中根节点

    // 数据
    var treeData: any = [];
    const { appendRoot } = props;
    if (appendRoot === true) {
        treeData = [{ title: '全部', key: '', value: '', children: props.treeData }];
    } else {
        treeData = props.treeData;
    }

    useEffect(() => {
        if (treeData && treeData.length > 0) {
            // 默认选中根节点
            setSelectedKeys([treeData[0].key]);
        }
    }, []);

    return (
        <Tree
            expandAction="doubleClick"
            blockNode
            checkable={false}
            selectable
            treeData={treeData}
            selectedKeys={selectedKeys}
            onSelect={(keys, { selected }) => {
                if (selected) {
                    setSelectedKeys(keys);
                    if (props.onSelect) {
                        props.onSelect(keys, { selected });
                    }
                } else {
                    setSelectedKeys((prevSelectedKeys: any) => prevSelectedKeys);
                }
            }}
        />
    );
}

export default FixSelectedTree;