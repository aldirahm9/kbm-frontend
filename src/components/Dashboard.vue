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
            <a v-if="loaded" class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-user"></i>
              {{ nama }}
            </a>
            <a v-else class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-user"></i>
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
            <ul v-if="loaded"
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
              <li v-show="!isAdmin" class="nav-item">
                <router-link :to="{name:'daftar-kelas'}" class="nav-link">
                  <i class="nav-icon fas fa-th"></i>
                  <p>
                    Daftar Kelas
                  </p>
                </router-link>
              </li>
              <li v-show="!isDosen && !isAdmin" class="nav-item">
                <router-link :to="{name:'rekap-presensi'}" class="nav-link">
                  <i class="nav-icon fas fa-th"></i>
                  <p>
                    Rekap Presensi
                  </p>
                </router-link>
              </li>
              <li v-show="isTpjm" class="nav-item">
                <router-link :to="{name:'monitoring'}" class="nav-link">
                  <i class="nav-icon fas fa-th"></i>
                  <p>
                    Monitoring
                  </p>
                </router-link>
              </li>
              <li v-show="isAdmin" class="nav-item">
                <router-link :to="{name:'dosen'}" class="nav-link">
                  <i class="nav-icon fas fa-th"></i>
                  <p>
                    Dosen
                  </p>
                </router-link>
              </li>

              <!-- <div v-if="$route.path.substr(0,6) == '/kelas'">
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
              </div> -->
            </ul>
            <div v-else class="d-flex justify-content-center overflow-hidden">
                  <div class="spinner-border text-primary" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
               </div>
          </nav>
          <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar -->
      </aside>

      <keep-alive :include="['DaftarKelas','Home','Monitoring']" :max="4">
      <router-view></router-view>
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
      dataNama: "",
      username: "",
      isTpjm: false,
      isDosen: false,
      isAdmin: false,
      loaded: false,
    };
  },
  props: [
    'nama_info',
    'username_info'
  ],
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push({name: 'login'});
    },
  },
  computed: {
    nama() {
      return this.nama_info == null ? this.dataNama : this.nama_info;
    }
  },
  created() {
    console.log('dashboard created');
    if(!this.nama_info) {
      console.log('hit api, gaada props');
       const token = localStorage.getItem("token");
    axios
      .get(process.env.VUE_APP_BASEURL + "auth/me?token=" + token, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
      .then((response) => {
        this.dataNama = response.data.nama;
        this.username = response.data.username;
        localStorage.setItem('username',this.username);
        if(response.data.role == 2){
          localStorage.setItem('isDosen',true);
          localStorage.setItem('isTpjm',false);
          localStorage.setItem('isAdmin',false);
          this.isDosen = true;
        }else if(response.data.role ==3) {
          localStorage.setItem('isDosen',true);
          localStorage.setItem('isTpjm',true);
          localStorage.setItem('isAdmin',false);
          this.isTpjm = true;
          this.isDosen = true;
        }else if(response.data.role ==4) {
          localStorage.setItem('isAdmin',true);
          localStorage.setItem('isDosen',false);
          localStorage.setItem('isTpjm',false);
          this.isAdmin = true;
        }else{
          localStorage.setItem('isDosen',false);
          localStorage.setItem('isTpjm',false);
          localStorage.setItem('isAdmin',false);
          this.isTpjm = false;
        }
        this.loaded=true;
      })
      .catch((err) => {
        console.log(err)
        this.logout()
      });
    }else{
      console.log('ada user_name');
      this.dataNama = this.nama_info;
      this.username = this.username_info;
      localStorage.setItem('username', this.username);
      this.isDosen = JSON.parse(localStorage.getItem('isDosen')) 
      this.isTpjm = JSON.parse(localStorage.getItem('isTpjm'))
      this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'))
      this.loaded=true;
    }
    
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

.spinner-border {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    border: .25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    -webkit-animation: spinner-border .75s linear infinite !important;
    animation: spinner-border .75s linear infinite !important;
}

</style>
