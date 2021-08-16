import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  }, {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: () => import('../views/Welcome')
    }, {
      path: '/users',
      component: () => import('../views/user/Users')
    }, {
      path: '/roles',
      component: () => import('../views/right/Roles')
    }, {
      path: '/rights',
      component: () => import('../views/right/Rights')
    }, {
      path: '/categories',
      component: () => import('../views/goods/Category.vue')
    }, {
      path: '/params',
      component: () => import('../views/goods/CategoryInfo.vue')
    }, {
      path: '/goods',
      component: () => import('../views/goods/GoodsList.vue')
    }, {
      path: '/goods/add',
      component: () => import('../views/goods/Add.vue')
    }]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
  }
})

export default router
