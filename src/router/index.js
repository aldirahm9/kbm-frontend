import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Dashboard from '../components/Dashboard.vue'
import DaftarKelas from '../components/DaftarKelas.vue'
import Monitoring from '../components/Monitoring.vue'
import Form05 from '../components/Form05.vue'
import Form06 from '../components/Form06.vue'
import Kelas from '../components/Kelas.vue'
import Nilai from '../components/Nilai.vue'
import Login from '../components/Login.vue'
import Tugas from '../components/Tugas.vue'
import RekapPresensi from '../components/RekapPresensi.vue'
import Dosen from '../components/Dosen.vue'



Vue.use(VueRouter)

const routes = 
[
  {
    path: '/',
    name: 'dashboard',
    redirect: 'login',
    component: Dashboard,
    props:true,
    meta: {
      requiresAuth: true
    },
    children: 
    [
      {
        path: '/home',
        name: 'home',
        component: Home,
        props:true
      },
      {
        path: '/daftar-kelas',
        name: 'daftar-kelas',
        component: DaftarKelas
      },
      {
        path: '/monitoring',
        name: 'monitoring',
        component: Monitoring
      },
      {
        path: '/rekap-presensi',
        name: 'rekap-presensi',
        component: RekapPresensi
      },
      {
        path: '/dosen',
        name: 'dosen',
        component: Dosen
      },
      {
        path: '/kelas/:kelas_id',
        name: 'kelas',
        component: Kelas,
        redirect: '/kelas/:kelas_id/form-05',
        props:true,
        children:
        [
          {
            path: '/kelas/:kelas_id/form-05',
            name: 'form05',
            component: Form05,
            props:true
          },
          {
            path: '/kelas/:kelas_id/form-06/presensi',
            name: 'form06',
            component: Form06,
            props:true
          },
          {
            path: '/kelas/:kelas_id/form-06/nilai',
            name: 'form06-nilai',
            component: Nilai,
            props:true
          },
          {
            path: '/kelas/:kelas_id/tugas',
            name: 'tugas',
            component: Tugas,
            props:true
          },
        ]
      },
      {
        path: '/monitoring/kelas/:kelas_id',
        name: 'monitoring-kelas',
        component: Kelas,
        redirect: '/monitoring/kelas/:kelas_id/form-05',
        props:true,
        children:
        [
          {
            path: '/monitoring/kelas/:kelas_id/form-05',
            name: 'monitoring-form05',
            component: Form05,
            props:true
          },
          {
            path: '/monitoring/kelas/:kelas_id/form-06/presensi',
            name: 'monitoring-form06',
            component: Form06,
            props:true
          },
          {
            path: '/monitoring/kelas/:kelas_id/form-06/nilai',
            name: 'monitoring-form06-nilai',
            component: Nilai,
            props:true
          },
          {
            path: '/monitoring/kelas/:kelas_id/tugas',
            name: 'monitoring-tugas',
            component: Tugas,
            props:true
          },
        ]
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