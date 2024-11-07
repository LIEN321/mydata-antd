/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // -------------------- 组织管理 --------------------
  {
    path: '/organization',
    name: '组织管理',
    icon: 'ClusterOutlined',
    routes: [
      {
        path: '/organization/department',
        name: '组织结构',
        component: './Organization/Department/Department',
      },
      {
        path: '/organization/role',
        name: '角色管理',
        component: './Organization/Role/Role',
      },
      {
        path: '/organization/user',
        name: '用户管理',
        component: './Organization/User/User',
      },
      {
        path: '/organization/account',
        name: '个人设置',
        component: './Organization/Account/Account',
      },
    ],
  },
  // -------------------- 系统管理 --------------------
  {
    path: '/system',
    name: '系统管理',
    icon: 'SettingOutlined',
    routes: [
      {
        path: '/system/tenant',
        name: '租户管理',
        component: './System/Tenant/Tenant',
      },
      {
        path: '/system/menu',
        name: '菜单管理',
        component: './System/Menu/Menu',
      },
      {
        path: '/system/api',
        name: '接口管理',
        component: './System/Api/Api',
      },
      {
        path: '/system/parameter',
        name: '参数管理',
        component: './System/Parameter/Parameter',
      },
    ],
  },
  // -------------------- 开发工具 --------------------
  {
    path: '/dev',
    name: '开发工具',
    icon: 'ToolOutlined',
    routes: [
      {
        path: '/dev/dev_entity',
        name: '生成代码',
        component: './Dev/DevEntity',
      },
    ],
  },
  // -------------------- 示例模块 --------------------
  {
    path: '/demo',
    name: '',
    icon: 'Smile',
    routes: [
      {
        path: '/demo/demo',
        name: '生成代码示例',
        component: './Demo/Demo',
      },
    ],
  },
  // -------------------- 默认地址 --------------------
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
