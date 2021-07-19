<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Kelas {{ kelas.nama }}</h1>
            <h5>{{kelas.hari}}, {{kelas.jam}}</h5>
            <button v-if="isDosen" type="button" @click="uploadRPS()" class="btn btn-primary">Upload RPS</button>
            <button type="button" @click="downloadRPS()" class="btn btn-success">Download RPS</button>
          </div>
          <!-- <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item"><a href="#">Kelas</a></li>
              <li class="breadcrumb-item active">Kelas {{ kelas.nama }}</li>
            </ol>
          </div> -->
        </div>
      </div>
      <!-- /.container-fluid -->
    </section>
    

    <!-- Main content -->
    <section class="content">
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
                <ul class="nav nav-tabs" id="custom-content-below-tab" role="tablist">
              <li class="nav-item">
                  <router-link v-if="kelas" :to="{name:'form05','params':{kelas_id:kelas.id,kelas_info:kelas}}" class="nav-link" id="custom-content-below-home-tab" data-toggle="pill" href="#custom-content-below-home" role="tab" aria-controls="custom-content-below-home" aria-selected="true">Pertemuan</router-link>
              </li>
              <li class="nav-item">
                  <router-link v-if="kelas" :to="{name:'form06','params':{kelas_id:kelas.id,kelas_info:kelas}}" class="nav-link" id="custom-content-below-profile-tab" data-toggle="pill" href="#custom-content-below-profile" role="tab" aria-controls="custom-content-below-profile" aria-selected="false">Presensi</router-link>
              </li>
              <li class="nav-item">
                  <router-link v-if="kelas" :to="{name:'tugas','params':{kelas_id:kelas.id,kelas:kelas}}" class="nav-link" id="custom-content-below-settings-tab" data-toggle="pill" href="#custom-content-below-settings" role="tab" aria-controls="custom-content-below-settings" aria-selected="false">Tugas</router-link>
              </li>
              <li class="nav-item">
                  <router-link v-if="isDosen" :to="{name:'form06-nilai','params':{kelas_id:kelas.id}}" class="nav-link" id="custom-content-below-settings-tab" data-toggle="pill" href="#custom-content-below-settings" role="tab" aria-controls="custom-content-below-settings" aria-selected="false">Nilai</router-link>
              </li>
            </ul>
            <div class="tab-content" id="custom-content-below-tabContent">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
            </div>
            </div>
</div>
</section>
    <!-- /.content -->
    <!-- <div v-if="show_modal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog modal-lg">
              <form>
                <div class="modal-content">
                  <div class="modal-header">
                    <h4 class="modal-title">Pertemuan Baru</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div class="modal-body">
                    <div class="form-group">
                      <label for="materi">Pokok Bahasan</label>
                      <input type="text" class="form-control" v-model="materi_baru" required />
                    </div>
                  </div>
                  <div class="modal-footer ">
                    <button type="submit" class="btn btn-primary">
                      Tambah Pertemuan
                    </button>
                  </div>
                </div>
              </form>
              /.modal-content
            </div>
          </div>
        </div>
      </transition>
      /.modal-dialog
    </div>
    /.modal -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import axios from "axios";
// import Swal from "sweetalert2";

export default {
  name: "Kelas",
  data() {
    return {
      kelas:{},
      show_modal: false,
      isDosen: false,
    };
  },
  props: [
    'kelas_info'
  ],
  methods: {
    uploadRPS() {


   
    },
    downloadRPS() {

    }


  },
  created() {
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    const token = localStorage.getItem("token");
    if (!this.kelas_info) {
      console.log('hit api');
      axios
        .get(
          process.env.VUE_APP_BASEURL +
            "kelas/" +
            this.$route.params.kelas_id +
            "?token=" +
            token,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          this.kelas = response.data.data;
          this.$route.params.kelas_info = this.kelas;
        })
        .catch((err) => {
          console.log(err);
          if(err.response.status == 401)
          this.parent.logout();
        });
    } else {
      this.kelas = this.kelas_info;
    }
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
