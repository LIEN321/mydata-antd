/**
 * 获取二级域名前缀
 */
export function getSubdomain() {
    var url = window.location.hostname;
    var subdomain = url.match(/^([a-z0-9]+)\.[a-z0-9]+\.[a-z]+$/i);

    if (subdomain && subdomain.length > 1) {
        return subdomain[1];
    } else {
        return null;
    }
}