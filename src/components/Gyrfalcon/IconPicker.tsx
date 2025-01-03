import { getIcon } from "@/util/FixMenuItemIcon";
import { Button, Card, Col, Flex, Modal, Row, Space, Tabs, TabsProps } from "antd";
import { useState } from "react";

export type IconPickerProps = {

    /**
     * 图标名称
     */
    value?: string;

    /**
     * 点击图标 触发的选择事件
     */
    onChoose: (name: string) => boolean | void;
}

const IconPicker: React.FC<IconPickerProps> = (props) => {
    const [visible, setVisible] = useState<boolean>(false);

    /** 方向性图标 */
    const directionIcons = ["StepBackward", "StepForward", "FastBackward", "FastForward", "Shrink", "ArrowsAlt", "Down", "Up", "Left", "Right", "CaretUp", "CaretDown", "CaretLeft", "CaretRight", "UpCircle", "DownCircle", "LeftCircle", "RightCircle", "DoubleRight", "DoubleLeft", "VerticalLeft", "VerticalRight", "VerticalAlignTop", "VerticalAlignMiddle", "VerticalAlignBottom", "Forward", "Backward", "Rollback", "Enter", "Retweet", "Swap", "SwapLeft", "SwapRight", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PlayCircle", "UpSquare", "DownSquare", "LeftSquare", "RightSquare", "Login", "Logout", "MenuFold", "MenuUnfold", "BorderBottom", "BorderHorizontal", "BorderInner", "BorderOuter", "BorderLeft", "BorderRight", "BorderTop", "BorderVerticle", "PicCenter", "PicLeft", "PicRight", "RadiusBottomleft", "RadiusBottomright", "RadiusUpleft", "RadiusUpright", "Fullscreen", "FullscreenExit"];
    /** 提示建议性图标 */
    const suggestionIcons = ["Question", "QuestionCircle", "Plus", "PlusCircle", "Pause", "PauseCircle", "Minus", "MinusCircle", "PlusSquare", "MinusSquare", "Info", "InfoCircle", "Exclamation", "ExclamationCircle", "Close", "CloseCircle", "CloseSquare", "Check", "CheckCircle", "CheckSquare", "ClockCircle", "Warning", "IssuesClose", "Stop"];
    /** 编辑类图标 */
    const editionIcons = ["Edit", "Form", "Copy", "Scissor", "Delete", "Snippets", "Diff", "Highlight", "AlignCenter", "AlignLeft", "AlignRight", "BgColors", "Bold", "Italic", "Underline", "Strikethrough", "Redo", "Undo", "ZoomIn", "ZoomOut", "FontColors", "FontSize", "LineHeight", "Dash", "SmallDash", "SortAscending", "SortDescending", "Drag", "OrderedList", "UnorderedList", "RadiusSetting", "ColumnWidth", "ColumnHeight"];
    /** 数据类图标 */
    const dataIcons = ["AreaChart", "PieChart", "BarChart", "DotChart", "LineChart", "RadarChart", "HeatMap", "Fall", "Rise", "Stock", "BoxPlot", "Fund", "Sliders"]
    /** 品牌和标识 */
    const brandIcons = ["Android", "Apple", "Windows", "Ie", "Chrome", "Github", "Aliwangwang", "Dingding", "WeiboSquare", "WeiboCircle", "TaobaoCircle", "Html5", "Weibo", "Twitter", "Wechat", "WhatsApp", "Youtube", "AlipayCircle", "Taobao", "Dingtalk", "Skype", "Qq", "MediumWorkmark", "Gitlab", "Medium", "Linkedin", "GooglePlus", "Dropbox", "Facebook", "Codepen", "CodeSandbox", "Amazon", "Google", "CodepenCircle", "Alipay", "AntDesign", "AntCloud", "Aliyun", "Zhihu", "Slack", "SlackSquare", "Behance", "BehanceSquare", "Dribbble", "DribbbleSquare", "Instagram", "Yuque", "Alibaba", "Yahoo", "Reddit", "Sketch", "WechatWork", "OpenAI", "Discord", "X", "Bilibili", "Pinterest", "TikTok", "Spotify", "Twitch", "Linux", "Java", "JavaScript", "Python", "Ruby", "DotNet", "Kubernetes", "Docker", "Baidu", "HarmonyOS"];
    /** 网站通用图标 */
    const commonIcons = ["AccountBook", "Aim", "Alert", "Apartment", "Api", "AppstoreAdd", "Appstore", "Audio", "AudioMuted", "Audit", "Bank", "Barcode", "Bars", "Bell", "Block", "Book", "Border", "BorderlessTable", "Branches", "Bug", "Build", "Bulb", "Calculator", "Calendar", "Camera", "Car", "CarryOut", "CiCircle", "Ci", "Clear", "CloudDownload", "Cloud", "CloudServer", "CloudSync", "CloudUpload", "Cluster", "Code", "Coffee", "Comment", "Compass", "Compress", "ConsoleSql", "Contacts", "Container", "Control", "Copyright", "CreditCard", "Crown", "CustomerService", "Dashboard", "Database", "DeleteColumn", "DeleteRow", "DeliveredProcedure", "DeploymentUnit", "Desktop", "Disconnect", "Dislike", "Dollar", "Download", "Ellipsis", "Environment", "EuroCircle", "Euro", "Exception", "ExpandAlt", "Expand", "Experiment", "Export", "Eye", "EyeInvisible", "FieldBinary", "FieldNumber", "FieldString", "FieldTime", "FileAdd", "FileDone", "FileExcel", "FileExclamation", "File", "FileGif", "FileImage", "FileJpg", "FileMarkdown", "FilePdf", "FilePpt", "FileProtect", "FileSearch", "FileSync", "FileText", "FileUnknown", "FileWord", "FileZip", "Filter", "Fire", "Flag", "FolderAdd", "Folder", "FolderOpen", "FolderView", "Fork", "FormatPainter", "Frown", "Function", "FundProjectionScreen", "FundView", "FunnelPlot", "Gateway", "Gif", "Gift", "Global", "Gold", "Group", "Hdd", "Heart", "History", "Holder", "Home", "Hourglass", "Idcard", "Import", "Inbox", "InsertRowAbove", "InsertRowBelow", "InsertRowLeft", "InsertRowRight", "Insurance", "Interaction", "Key", "Laptop", "Layout", "Like", "Line", "Link", "Loading3Quarters", "Loading", "Lock", "MacCommand", "Mail", "Man", "MedicineBox", "Meh", "Menu", "MergeCells", "Merge", "Message", "Mobile", "MoneyCollect", "Monitor", "Moon", "More", "Muted", "NodeCollapse", "NodeExpand", "NodeIndex", "Notification", "Number", "OneToOne", "PaperClip", "Partition", "PayCircle", "Percentage", "Phone", "Picture", "PlaySquare", "PoundCircle", "Pound", "Poweroff", "Printer", "Product", "Profile", "Project", "PropertySafety", "PullRequest", "Pushpin", "Qrcode", "Read", "Reconciliation", "RedEnvelope", "Reload", "Rest", "Robot", "Rocket", "RotateLeft", "RotateRight", "SafetyCertificate", "Safety", "Save", "Scan", "Schedule", "Search", "SecurityScan", "Select", "Send", "Setting", "Shake", "ShareAlt", "Shop", "ShoppingCart", "Shopping", "Signature", "Sisternode", "Skin", "Smile", "Solution", "Sound", "SplitCells", "Star", "Subnode", "Sun", "Switcher", "Sync", "Table", "Tablet", "Tag", "Tags", "Team", "Thunderbolt", "ToTop", "Tool", "TrademarkCircle", "Trademark", "Transaction", "Translation", "Trophy", "Truck", "Ungroup", "Unlock", "Upload", "Usb", "UserAdd", "UserDelete", "User", "UserSwitch", "UsergroupAdd", "UsergroupDelete", "Verified", "VideoCameraAdd", "VideoCamera", "Wallet", "Wifi", "Woman"];

    const iconCard = (name: string) => {
        return <Card bordered={false} hoverable={true} onClick={() => {
            const result = props.onChoose(name);
            if (result === false) {
                // do nothing
            } else {
                setVisible(false);
            }
        }}>
            <Flex vertical>
                <Flex justify="center">
                    {getIcon(name)}
                </Flex>
                <Flex justify="center" wrap>
                    {name}
                </Flex>
            </Flex>
        </Card>
    }

    const gutterX = 6;
    const gutterY = 6;
    const colSpan = 2;

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '方向性图标',
            children:
                <>
                    <Row gutter={[gutterX, gutterY]}>
                        {directionIcons.map(icon => { return <Col key={icon} span={colSpan}>{iconCard(icon)}</Col> })}
                    </Row>
                </>,
        },
        {
            key: '2',
            label: '提示建议性图标',
            children:
                <>
                    <Row gutter={[gutterX, gutterY]}>
                        {suggestionIcons.map(icon => { return <Col key={icon} span={colSpan}>{iconCard(icon)}</Col> })}
                    </Row>
                </>,
        },
        {
            key: '3',
            label: '编辑类图标',
            children:
                <>
                    <Row gutter={[gutterX, gutterY]}>
                        {editionIcons.map(icon => { return <Col key={icon} span={colSpan}>{iconCard(icon)}</Col> })}
                    </Row>
                </>,
        },
        {
            key: '4',
            label: '数据类图标',
            children:
                <>
                    <Row gutter={[gutterX, gutterY]}>
                        {dataIcons.map(icon => { return <Col key={icon} span={colSpan}>{iconCard(icon)}</Col> })}
                    </Row>
                </>,
        },
        {
            key: '5',
            label: '品牌和标识',
            children:
                <>
                    <Row gutter={[gutterX, gutterY]}>
                        {brandIcons.map(icon => { return <Col key={icon} span={colSpan}>{iconCard(icon)}</Col> })}
                    </Row>
                </>,
        },
        {
            key: '6',
            label: '网站通用图标',
            children:
                <>
                    <Row gutter={[gutterX, gutterY]}>
                        {commonIcons.map(icon => { return <Col key={icon} span={colSpan}>{iconCard(icon)}</Col> })}
                    </Row>
                </>,
        },
    ];

    return (
        // <Tabs defaultActiveKey="1" items={items} />
        <>
            <Space >
                {props.value ? getIcon(props.value) : <></>}
                <Button type="primary" onClick={() => { setVisible(true); }}>选择</Button>
            </Space>
            <Modal
                title="选择图标"
                width={'90%'}
                open={visible}
                onCancel={() => { setVisible(false); }}
            >
                <div style={{ height: 700, overflowX: "hidden", overflowY: "auto" }}>
                    <Tabs items={items} />
                </div>
            </Modal>
        </>
    );
}

export default IconPicker;