import Vue from 'vue';
import Router from 'vue-router';
import PremiseListDetail from '../components/employee/PremiseListDetail.vue'
import NewsDetail from '../components/employee/NewsDetail.vue'
import HouseDetail from '../components/house/HouseDetail.vue'
import AddHouse from '../components/house/AddHouse.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },

                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/PremiseList',
                    component: resolve => require(['../components/employee/PremiseList.vue'], resolve),
                    meta: { title: '房屋管理' }
                },
                {
                    path: '/NewsList',
                    component: resolve => require(['../components/employee/NewsList.vue'], resolve),
                    meta: { title: '房东的故事' }
                },
                {
                    path: '/AddNews',
                    component: resolve => require(['../components/employee/AddNews.vue'], resolve),
                    meta: { title: '增加故事' }
                },
                {
                    path: '/PremiseListDetail/:id',
                    name: 'PremiseListDetail',
                    component: PremiseListDetail,
                    meta: { title: '房屋详情' }
                },
                {
                    path: '/NewsDetail/:id',
                    name: 'NewsDetail',
                    component: NewsDetail,
                    meta: { title: '故事详情' }
                },
                {
                    path: '/AddPremise',
                    component: resolve => require(['../components/employee/AddPremise.vue'], resolve),
                    meta: { title: '增加房屋' }
                },
                {
                    path: '/DynamicList',
                    component: resolve => require(['../components/employee/DynamicList.vue'], resolve),
                    meta: { title: '动态管理' }
                },
                {
                    path: '/HouseList',
                    component: resolve => require(['../components/house/HouseList.vue'], resolve),
                    meta: { title: '房屋内部' }
                },
                {
                    path: '/HouseDetail/:id',
                    name: 'HouseDetail',
                    component: HouseDetail,
                    meta: { title: '房屋详情' }
                },
                {
                    path: '/AddHouse/:id',
                    name: 'AddHouse',
                    component: AddHouse,
                    meta: { title: '增加房屋' }
                },
                {
                    path: '/BeforeList',
                    component: resolve => require(['../components/user/BeforeList.vue'], resolve),
                    meta: { title: '租客信息管理' }
                },
                {
                    path: '/AppointList',
                    component: resolve => require(['../components/appoint/AppointList.vue'], resolve),
                    meta: { title: '预约管理' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
