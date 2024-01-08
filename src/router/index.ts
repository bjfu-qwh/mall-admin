import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import UserComponent from "../components/User/UserComponent.vue";
import StoreComponent from "../components/Store/StoreComponent.vue";

const HomeComponent = () => import('../components/Home/HomeComponent.vue');

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