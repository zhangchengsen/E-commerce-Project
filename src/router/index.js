import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import user from '../components/user/user.vue'
import role from '../components/user/role.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/home', component: home ,
      redirect:'/welcome'
    ,
    children:
    [
      {path:'/welcome',component:welcome},
      {path:'/users',component:user},
      {path:'/roles',component:role},

    ]},
  ]
})
router.beforeEach((to,from,next)=>{
  if(to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router