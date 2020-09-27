import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Dashboard from '../components/Dashboard.vue'
import DaftarKelas from '../components/DaftarKelas.vue'
import Form05 from '../components/Form05.vue'
import Form06 from '../components/Form06.vue'
import Form06Nilai from '../components/Form06Nilai.vue'
import Login from '../components/Login.vue'



Vue.use(VueRouter)

const routes = 
[
  {
    path: '/',
    name: '',
    redirect: 'login',
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
    children: 
    [
      {
        path: '/home',
        name: 'home',
        component: Home,
        
      },
      {
        path: '/daftar-kelas',
        name: 'daftar-kelas',
        component: DaftarKelas
      },
      {
        path: '/kelas/:kelas_id/form-05',
        name: 'form05',
        component: Form05
      },
      {
        path: '/kelas/:kelas_id/form-06/presensi',
        name: 'form06',
        component: Form06
      },
      {
        path: '/kelas/:kelas_id/form-06/nilai',
        name: 'form06-nilai',
        component: Form06Nilai
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      hideForAuth: true
    }
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // linkActiveClass: "active",
  linkExactActiveClass: "active",
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (localStorage.getItem('token') == null) {
      next({ name: 'login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
  if (to.matched.some(record => record.meta.hideForAuth)) {
    if (localStorage.getItem('token') != null) {
        next({ name: 'home' });
    } else {
        next();
    }
} else {
    next();
}
})

export default router