/**
 * 格式化时间差为人性化的描述
 * @param inputTime 输入时间
 * @returns 相对时间描述
 */
export const timeAgo = (inputTime: Date | string | number): string => {
    if (!inputTime || inputTime === '') {
        return '';
    }

    const now = new Date();
    const time = new Date(inputTime);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // 时间差，单位：秒

    if (diff < 60)
        return "刚刚";
    if (diff < 3600)
        return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400)
        return `${Math.floor(diff / 3600)}小时前`;
    if (diff < 2592000)
        return `${Math.floor(diff / 86400)}天前`;
    if (diff < 31536000)
        return `${Math.floor(diff / 2592000)}个月前`;
    return `${Math.floor(diff / 31536000)}年前`;
};