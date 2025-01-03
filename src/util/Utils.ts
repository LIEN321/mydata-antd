/**
 * 获取二级域名前缀
 */
export function getSubdomain() {
    let url = window.location.hostname;
    let subdomain = url.match(/^([a-z0-9]+)\.[a-z0-9]+\.[a-z]+$/i);

    if (subdomain && subdomain.length > 1) {
        return subdomain[1];
    } else {
        return null;
    }
}