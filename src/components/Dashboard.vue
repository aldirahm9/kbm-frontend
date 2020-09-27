<template>
<div class="hold-transition sidebar-mini layout-navbar-fixed">
  <div id="app">
    <!-- Site wrapper -->
    <div class="wrapper">
      <!-- Navbar -->
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"
              ><i class="fas fa-bars"></i
            ></a>
          </li>
        </ul>

        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">
          <!-- Messages Dropdown Menu -->

          <!-- Notifications Dropdown Menu -->
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-user" v-show="userName"></i>
              {{ userName }}
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <a @click="logout" href="#" class="dropdown-item">
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      <!-- /.navbar -->

      <!-- Main Sidebar Container -->
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <a href="../../index3.html" class="brand-link elevation-4">
          <img
            src="../assets/dist/img/logo-unj.png"
            alt="AdminLTE Logo"
            class="brand-image img-circle elevation-3"
            style="opacity: .8"
          />
          <span class="brand-text font-weight-light">SIM KBM</span>
        </a>

        <!-- Sidebar -->
        <div class="sidebar">
          <!-- Sidebar Menu -->
          <nav class="mt-2">
            <ul
              class="nav nav-pills nav-sidebar flex-column nav-child-indent"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
              <li class="nav-item has-treeview">
                <router-link :to="{name:'home'}" class="nav-link">
                  <i class="nav-icon fas fa-tachometer-alt"></i>
                  <p>
                    Home
                  </p>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name:'daftar-kelas'}" class="nav-link">
                  <i class="nav-icon fas fa-th"></i>
                  <p>
                    Daftar Kelas
                  </p>
                </router-link>
              </li>
              <div v-if="$route.path.substr(0,6) == '/kelas'">
              <li style="white-space:normal;" class="nav-header header-if">{{nama_kelas}}</li>
              <li class="nav-item">
                <router-link :to="{name:'form05','params':{nama_kelas:$route.params.nama_kelas,kelas_id:$route.params.kelas_id}}" class="nav-link">
                  <i class="nav-icon fas fa-th list-item-if"></i>
                  <p>
                    Form 05
                  </p>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name:'form06','params':{nama_kelas:$route.params.nama_kelas,kelas_id:$route.params.kelas_id}}" class="nav-link">
                  <i class="nav-icon fas fa-th list-item-if"></i>
                  <p>
                    Form 06 - Presensi
                  </p>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name:'form06-nilai','params':{nama_kelas:$route.params.nama_kelas,kelas_id:$route.params.kelas_id}}" class="nav-link">
                  <i class="nav-icon fas fa-th list-item-if"></i>
                  <p>
                    Form 06 - Nilai
                  </p>
                </router-link>
              </li>
              </div>
            </ul>
          </nav>
          <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar -->
      </aside>

      <keep-alive :include="['DaftarKelas','Home']" :max="4">
      <router-view @nama_kelas="set_nama_kelas"></router-view>
      </keep-alive>


      <footer class="main-footer">
        <div class="float-right d-none d-sm-block"><b>Version</b> 3.0.5</div>
        <strong
          >Copyright &copy; 2014-2019
          <a href="http://adminlte.io">AdminLTE.io</a>.</strong
        >
        All rights reserved.
      </footer>
    </div>
    <!-- ./wrapper -->
  </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      userName: "",
      nama_kelas: '',
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push({name: 'login'});
    },
    set_nama_kelas(nama) {
      this.nama_kelas = nama
    }
  },
  created() {
    const token = localStorage.getItem("token");
    axios
      .post(process.env.VUE_APP_BASEURL + "auth/me?token=" + token, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
      .then((response) => {
        console.log(response.data.nama);
        this.userName = response.data.nama;
        if(response.data.dosen == 1) 
          localStorage.setItem('isDosen',true)
        else 
          localStorage.setItem('isDosen',false)
      })
      .catch((err) => {
        console.log(err)
        this.logout()
      });
  },
  watch: {
    '$route'() { 
      const el = document.body;
      if(el.classList.contains('sidebar-open')) {
        el.classList.remove('sidebar-open')
        el.classList.add('sidebar-closed')
        el.classList.add('sidebar-collapse')
      }
    }
  }
};
</script>

<style scoped>
.header-if {
  padding: 1.7rem 1rem .5rem;
}

.list-item-if {
  margin-left: .05rem;
  margin-right: .2rem;
  text-align:center;
  width: 1.6rem;
}
</style>
