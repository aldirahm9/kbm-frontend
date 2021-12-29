<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 v-if="!loading">Kelas {{ kelas.nama }}</h1>
            <h4 v-if="!loading && kelas.dosen">
              {{kelas.dosen[0]}}<span v-if="kelas.dosen[1]"> -
                {{kelas.dosen[1]}}</span>
            </h4>
            <h5 v-if="!loading && kelas.hari">{{kelas.hari}}, {{kelas.jam}}</h5>
            <div v-if="loading" class="ph-row">
              <div class="ph-col-12 big"></div>
              <div class="ph-col-8 big"></div>
              <div class="ph-col-4 big empty"></div>
              <div class="ph-col-6"></div>
              <br>
            </div>
            <button v-if="isDosen && !isMonitoring && isSemesterAktif" type="button" @click="uploadRPS()" class="btn btn-primary">Upload
              RPS</button>
            <button type="button" @click="downloadRPS()" class="btn btn-success">Download RPS</button>
            <button v-if="isDosen && !isMonitoring  && isSemesterAktif" :disabled="kelas.penanggung_jawab_isExists" type="button" @click="modalAssignPJ()"
              class="btn btn-secondary">Pilih Penanggung Jawab</button>
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
                <router-link v-if="kelas && !isMonitoring"
                  :to="{name:'form05','params':{kelas_id:this.$route.params.kelas_id,kelas_info:kelas}}"
                  class="nav-link" id="custom-content-below-home-tab" data-toggle="pill" role="tab"
                  aria-controls="custom-content-below-home" aria-selected="true">Pertemuan</router-link>
                <router-link v-if="kelas && isMonitoring"
                  :to="{name:'monitoring-form05','params':{kelas_id:this.$route.params.kelas_id,kelas_info:kelas}}"
                  class="nav-link" id="custom-content-below-home-tab" data-toggle="pill" role="tab"
                  aria-controls="custom-content-below-home" aria-selected="true">Pertemuan</router-link>
              </li>
              <li class="nav-item">
                <router-link v-if="kelas && !isMonitoring"
                  :to="{name:'form06','params':{kelas_id:this.$route.params.kelas_id,kelas_info:kelas}}"
                  class="nav-link" id="custom-content-below-profile-tab" data-toggle="pill" role="tab"
                  aria-controls="custom-content-below-profile" aria-selected="false">Presensi</router-link>
                <router-link v-if="kelas && isMonitoring"
                  :to="{name:'monitoring-form06','params':{kelas_id:this.$route.params.kelas_id,kelas_info:kelas}}"
                  class="nav-link" id="custom-content-below-profile-tab" data-toggle="pill" role="tab"
                  aria-controls="custom-content-below-profile" aria-selected="false">Presensi</router-link>
              </li>
              <li class="nav-item">
                <router-link v-if="kelas && !isMonitoring"
                  :to="{name:'tugas','params':{kelas_id:this.$route.params.kelas_id,kelas_info:kelas}}" class="nav-link"
                  id="custom-content-below-settings-tab" data-toggle="pill" role="tab"
                  aria-controls="custom-content-below-settings" aria-selected="false">Tugas</router-link>
                <router-link v-if="kelas && isMonitoring"
                  :to="{name:'monitoring-tugas','params':{kelas_id:this.$route.params.kelas_id,kelas_info:kelas}}" class="nav-link"
                  id="custom-content-below-settings-tab" data-toggle="pill" role="tab"
                  aria-controls="custom-content-below-settings" aria-selected="false">Tugas</router-link>
              </li>
              <li class="nav-item">
                <router-link v-if="isDosen && !isMonitoring"
                  :to="{name:'form06-nilai','params':{kelas_id:this.$route.params.kelas_id,kelas_info:kelas}}"
                  class="nav-link" id="custom-content-below-settings-tab" data-toggle="pill" role="tab"
                  aria-controls="custom-content-below-settings" aria-selected="false">Nilai</router-link>
                <router-link v-if="isDosen && isMonitoring"
                  :to="{name:'monitoring-form06-nilai','params':{kelas_id:this.$route.params.kelas_id,kelas_info:kelas}}"
                  class="nav-link" id="custom-content-below-settings-tab" data-toggle="pill" role="tab"
                  aria-controls="custom-content-below-settings" aria-selected="false">Nilai</router-link>
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
   <div v-show="show_modal">
      <transition name="modal">
        <div class="modal-mask" >
          <div class="modal-wrapper" @click.self="show_modal=false">
            <div class="modal-dialog" ref="modal" tabindex="0" @keyup.esc="show_modal=false">
              <div v-if="show_modal" class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Pilih Penangung Jawab</h4>
                  <button type="button" class="close" @click="show_modal=false">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <v-select label="nama" v-model="penanggungJawab" :options="listMahasiswa" :dropdown-should-open="dropdownShouldOpen"></v-select>
                </div>
                <div class="modal-footer">
                 <button type="button" class="btn btn-primary" @click="assignPJ()">Pilih</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- /.modal -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Kelas",
  data() {
    return {
      kelas:{},
      show_modal: false,
      isDosen: false,
      loading: true,
      penanggungJawab: null,
      listMahasiswa: [
      ],
    };
  },
  computed: {
    isMonitoring() {
      return this.$route.name.substr(0,10) == 'monitoring' ? true : false;
    },
    isSemesterAktif() {
      return localStorage.getItem('semester') == localStorage.getItem('semesterAktif')
    },
  },
  props: [
    'kelas_info'
  ],
  methods: {
    uploadRPS() {
      const token = localStorage.getItem('token');
      Swal.fire({
        title: 'Masukan File RPS',
        input: 'file',
        inputAttributes: {
            'accept': 'application/pdf',
          },
        showCancelButton: true,
        confirmButtonText: 'Save',
      }).then((result) => {
        console.log(result.value != null)
        if(result.isConfirmed) {
          if(result.value != null) {
            let formData = new FormData();
            formData.append('file',result.value)
            axios.post(
              `${process.env.VUE_APP_BASEURL}kelas/${this.$route.params.kelas_id}/rps?token=${token}`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            ).then(() => {
              Swal.fire({
                title: 'Upload RPS Berhasil',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
            }) 
            .catch((err) => {
                console.log(err);
                if (err?.response?.status == 401) this.$parent.logout();
              })
            } else {
              Swal.fire({
                title: 'Anda belum memasukan file',
                icon: 'error',
              })
            }
        }
      });
    },
    modalAssignPJ() {
      // const token = localStorage.getItem('token');
      this.show_modal = true;
      this.$nextTick(() => this.$refs.modal.focus());
      this.modalLoading = true
      
    },
    downloadRPS() {
       console.log('donlot');
        const token = localStorage.getItem('token');
          axios
        .get(
          `${process.env.VUE_APP_BASEURL}kelas/${this.$route.params.kelas_id}/rps?token=${token}`,
            {responseType: 'blob'}
        )
        .then((response) => {
          var fileURL = URL.createObjectURL(response.data);
          
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = "RPS_" + this.kelas_info.nama + ".pdf";
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status == 404) {
            Swal.fire({
              title: 'RPS belum tersedia',
              icon: 'error'
            });
          } else if (err?.response?.status == 401) this.$parent.logout();
        });

         //easy way
        // const token = localStorage.getItem('token')
        //  const url =  process.env.VUE_APP_BASEURL +
        //     "kelas/" +
        //     this.$route.params.kelas_id +
        //     "/nilai/excel?token=" +
        //     token;
        //     const link = document.createElement('a');
        //     link.href = url;
        //     document.body.appendChild(link);
        //     link.click();
        //     link.remove();

    },
    dropdownShouldOpen(VueSelect) {
      if (this.penanggungJawab !== null) {
        return VueSelect.open
      }

      return VueSelect.search.length !== 0 && VueSelect.open
    },
    assignPJ() {
      const token = localStorage.getItem('token');
      Swal.fire({
        title: 'Pilih ' + this.penanggungJawab.nama + ' sebagai penanggung jawab mata kuliah?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya'
      })
      .then((result) => {
        if(result.isConfirmed){
          const semester = localStorage.getItem('semester');
          axios.post(
              `${process.env.VUE_APP_BASEURL}kelas/${semester}/${this.$route.params.kelas_id}/penanggung-jawab?token=${token}`,
              {mahasiswa: this.penanggungJawab.username},
              { headers: { "X-Requested-With": "XMLHttpRequest" }, }
            ).then(() => {
               Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil memilih PJ',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
              this.show_modal = false;
              this.kelas.penanggung_jawab_isExists = true;
            }).catch((err) => {
                console.log(err);
                if (err?.response?.status == 401) this.$parent.logout();
              })
        }
      })
    }
  },
  created() {
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    const token = localStorage.getItem("token");
    const semester = localStorage.getItem("semester");
    if (!this.kelas_info) { //load baru
      axios
        .get(`
          ${process.env.VUE_APP_BASEURL}kelas/${semester}/${this.$route.params.kelas_id}?token=${token}`,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          console.log(response)
          this.kelas = response.data.data
          this.kelas.id = this.$route.params.kelas_id
          this.$route.params.kelas_info = this.kelas
          this.loading =false
        })
        .catch((err) => {
          console.log(err);
          if(err?.response?.status == 401)
          this.parent.logout();
        });
    } else { //dari daftar kelas only load to get dosen
      this.kelas = this.kelas_info
      this.loading = false
      axios 
        .get(
          `${process.env.VUE_APP_BASEURL}kelas/${semester}/${this.$route.params.kelas_id}?token=${token}`,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => { //only get dosen name
          this.kelas = response.data.data
          // this.$route.params.kelas_info = this.kelas
        })
        .catch((err) => {
          console.log(err);
          if(err?.response?.status == 401)
          this.parent.logout();
        });
    }

    axios.get(
      `${process.env.VUE_APP_BASEURL}kelas/${semester}/${this.$route.params.kelas_id}/mahasiswa?token=${token}`,
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        }
      ).then((response) => {
        console.log(response.data);
        this.listMahasiswa = response.data;
      })
      .catch((err) => {
        console.log(err);
        if(err?.response?.status == 401)
          this.parent.logout();
      });
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
