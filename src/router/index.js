import Vue from 'vue'
import VueRouter from 'vue-router'
import NoJurisdiction from "@/views/Home/NoJurisdiction"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            auth: false
        },
        component: () => import("@/views/Login")
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            auth: true
        },
        component: () => import('../views/Home'),
        children: [
            {
                path: '',
                name: 'welcome',
                component: () => import('../views/Home/welcome/Welcome'),
            },

            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('../views/Home/Dashboard'),
            },
            {
                path: '/open/panorama/package',
                name: '/open/panorama/package',
                component: () => import('../views/Home/CommodityPackage/PanoramaPackage'),
            },
            {
                path: '/open/package',
                name: '/open/package',
                component: () => import('../views/Home/CommodityPackage/OpenPackage'),
            },
            {
                path: '/agent/account',
                name: '/agent/account',
                mate: {title: '账户管理'},
                component: () => import('../views/Home/Agent/Account'),
            },
            {
                path: '/agent/staff',
                name: '/agent/staff',
                mate: {title: '员工管理'},
                component: () => import('../views/Home/Agent/Staff'),
            },
            {
                path: '/agent/custom',
                name: '/agent/custom',
                mate: {title: '客户管理'},
                component: () => import('../views/Home/Agent/Custom'),
            },
            // 订单管理
            {
                path: '/agent/order/panorama',
                name: '/agent/order/panorama',
                mate: {title: 'VR订单列表'},
                component: () => import('../views/Home/Agent/Order/Panorama'),
            },
            {
                path: '/agent/order/api/panorama',
                name: '/agent/order/api/panorama',
                mate: {title: 'VR订单列表API'},
                component: () => import('../views/Home/Agent/Order/PanoramaApi'),
            },
            {
                path: '/agent/order/ar/product',
                name: '/agent/order/ar/product',
                mate: {title: 'AR订单列表'},
                component: () => import('../views/Home/Agent/Order/ProductAr'),
            },
            {
                path: '/agent/order/ar/sku',
                name: '/agent/order/ar/sku',
                mate: {title: 'AR订单SKU列表'},
                component: () => import('../views/Home/Agent/Order/ArSku'),
            },
            // 代理商平台系统设置
            {
                path: '/agent/system/config',
                name: '/agent/system/config',
                mate: {title: '基础设置'},
                component: () => import('../views/Home/Agent/Config'),
            },
            {
                path: '/agent/notice',
                name: '/agent/notice',
                mate: {title: '系统通知'},
                component: () => import('../views/Home/Agent/Notice'),
            },
            {
                path: '/agent/statistics',
                name: '/agent/statistics',
                mate: {title: '业绩管理'},
                component: () => import('../views/Home/Agent/Statistics'),
            },
            // 系统设置
            {
                path: '/system/attributes/area',
                name: '/system/attributes/area',
                mate: {title: '区域配置'},
                component: () => import('../views/Home/System/Attributes/Area'),
            },
            {
                path: '/system/attributes/category',
                name: '/system/attributes/category',
                mate: {title: '全景分类'},
                component: () => import('../views/Home/System/Attributes/Category'),
            },
            {
                path: '/system/attributes/place',
                name: '/system/attributes/place',
                mate: {title: '位置配置'},
                component: () => import('../views/Home/System/Attributes/Place'),
            },
            {
                path: '/system/config',
                name: '/system/config',
                mate: {title: '站点设置'},
                component: () => import('../views/Home/System/Config'),
            },
            {
                path: '/system/menu',
                name: '/system/menu',
                mate: {title: '菜单管理'},
                component: () => import('../views/Home/System/Menu'),
            },
            {
                path: '/admin/user',
                name: '/admin/user',
                mate: {title: '管理员管理'},
                component: () => import('../views/Home/admin/User'),
            },
            {
                path: '/admin/role',
                name: '/admin/role',
                mate: {title: '权限组管理'},
                component: () => import('../views/Home/admin/Role'),
            },
            {
                path: '/admin/log',
                name: '/admin/log',
                mate: {title: '操作日志'},
                component: () => import('../views/Home/admin/Log'),
            },
            // 添加全景分类
            {
                path: '/profile',
                name: '/profile',
                mate: {title: '个人资料'},
                component: () => import('../views/Home/User/Profile'),
            },
            {
                path: '/quote/account',
                name: '/quote/account',
                mate: {title: '账户管理'},
                component: () => import('../views/Home/Quote/Account'),
            },
            {
                path: '/quote/Service/Category',
                name: '/quote/Service/Category',
                mate: {title: '服务管理分类'},
                component: () => import('../views/Home/Quote/Service/Category'),
            },
            {
                path: '/quote/service/items',
                name: '/quote/service/items',
                mate: {title: '服务项目管理'},
                component: () => import('../views/Home/Quote/Service/Items'),
            },
            {
                path: '/quote/activity',
                name: '/quote/activity',
                mate: {title: '优惠活动管理'},
                component: () => import('../views/Home/Quote/Activity'),
            },
            {
                path: '/quote/order',
                name: '/quote/order',
                mate: {title: '报价单管理'},
                component: () => import('../views/Home/Quote/Order'),
            },
        ]
    },
    {
        path: '*',
        name: 'NoJurisdiction',
        component: NoJurisdiction
    },
]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem('token')
    if (to.name !== 'Login' && !token) next({name: 'Login'})
    else next()
})

export default router
