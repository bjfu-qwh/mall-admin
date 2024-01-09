import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import UserComponent from "../components/User/UserComponent.vue";
import StoreComponent from "../components/Store/StoreComponent.vue";

const HomeComponent = () => import('../components/Home/HomeComponent.vue');

/**
 * vue-router的路由配置菜单。如果要添加组件：
 * 在Home的children中，按照如下规则添加JavaScript对象
 * {
 *     name:组件的名称，最好和components子目录名称一致
 *     component：仿照上面的import引入目标组件
 *     path：以/开头写路径，router.push参数为此
 * }
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/home",
    }, {
        name: "Home",
        component: HomeComponent,
        path: "/home",
        children: [
            {
                name: "User",
                component: UserComponent,
                path: "/user"
            }, {
                name: "Store",
                component: StoreComponent,
                path: "/store"
            }
        ]
    },
];

const router = createRouter({
    routes: routes,
    history: createWebHashHistory()
});

export default router;