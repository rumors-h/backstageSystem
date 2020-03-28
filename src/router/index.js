import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childcomps/Welcome')
const User = () => import('components/user/User')
const Rights = () => import('components/power/Rights')
const Roles = () => import('components/power/Roles')
const Categories = () => import('components/goods/Categories')
const GoodsList = () => import('components/goods/GoodsList')
const Params = () => import('components/goods/Params')
const AddGoods = () => import('components/goods/AddGoods')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/params',
        component: Params
      },
      // {
      //   path: '/goods/add',
      //   component: AddGoods
      // }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//导航首位
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')    //getItem获取值，setItem设置值
  if (!tokenStr) return next('/login')
  next()
})

export default router
