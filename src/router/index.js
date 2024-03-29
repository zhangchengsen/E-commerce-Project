import Vue from 'vue'
import Router from 'vue-router'
// const Foo = () => import(/* webpackChunkName:"group-foo" */ './Foo.vue')
// import login from '../components/login.vue'
const login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/login.vue')
// import home from '../components/home.vue'
const home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/home.vue')
// import welcome from '../components/welcome.vue'
const welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/welcome.vue')

// import user from '../components/user/user.vue'
const user = () => import(/* webpackChunkName:"user_role_rights" */ '../components/user/user.vue')
// import role from '../components/user/role.vue'
const role = () => import(/* webpackChunkName:"user_role_rights" */ '../components/user/role.vue')
// import rights from '../components/rights/rights.vue'
const rights = () => import(/* webpackChunkName:"user_role_rights" */ '../components/rights/rights.vue')


// import goods from '../components/goods/good_cart.vue'
const goods = () => import(/* webpackChunkName:"good_params" */ '../components/goods/good_cart.vue')
// import params from '../components/goods/params.vue'
const params = () => import(/* webpackChunkName:"good_params" */ '../components/goods/params.vue')
// import goods_list from '../components/goods/goods_list.vue'
const goods_list = () => import(/* webpackChunkName:"goods_list_goods_add" */ '../components/goods/goods_list.vue')
// import goods_add from '../components/goods/goods_add.vue'
const goods_add = () => import(/* webpackChunkName:"goods_list_goods_add" */ '../components/goods/goods_add.vue')
// import orders from '../components/orders/orders.vue'
const orders = () => import(/* webpackChunkName:"orders_report" */ '../components/orders/orders.vue')
// import report from '../components/report/report.vue'
const report = () => import(/* webpackChunkName:"orders_report" */ '../components/report/report.vue')
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home', component: home,
      redirect: '/welcome'
      ,
      children:
        [
          { path: '/welcome', component: welcome },
          { path: '/users', component: user },
          { path: '/roles', component: role },
          { path: '/rights', component: rights },
          { path: '/goods', component: goods },
          { path: '/params', component: params },
          { path: '/categories', component: goods_list },
          { path: '/goods/add', component: goods_add },
          { path: '/orders', component: orders },
          { path: '/reports', component: report },
        ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router