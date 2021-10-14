<template>
  <!-- Content Wrapper. Contains page content -->

  <div class="tab-pane fade show active" id="custom-content-below-home" role="tabpanel"
    aria-labelledby="custom-content-below-home-tab">
    <br>
    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div v-if="kelas_info" class="row">
          <div class="col-2-md">
            <button v-if="(kelas_info.penanggung_jawab || isDosen) && !isMonitoring  && isSemesterAktif" type="button" class="btn btn-primary"
              @click.prevent="tambahPertemuan">
              <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-lg"> -->
              Pertemuan Baru
            </button>
          </div>
          <div class="col-1-md offset-md-10">
            <button @click="callForm05()" type="button" class="btn btn-secondary">
              <span v-if="!loading" class="fa fa-sync"></span>
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-if="loading" class="sr-only">Loading...</span>
            </button>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <!-- <div class="card-header">
                <h3 class="card-title">Form 05</h3>
              </div> -->
              <div class="card-body table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th style="width: 10px">Pertemuan</th>
                      <th>Waktu</th>
                      <th>Materi</th>
                      <th>Jumlah Mahasiswa Hadir</th>
                      <th>Validasi Dosen</th>
                      <th>Validasi Mahasiswa</th>
                      <th v-if="!isMonitoring  && isSemesterAktif">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(form, index) in form05" :key="form.id">
                      <td>{{ form.pertemuan }}</td>
                      <td>{{ form.created_at }}</td>
                      <td>{{ form.materi }}</td>
                      <td>{{ form.jumlah_mahasiswa }}</td>
                      <td>
                        <i v-show="form.valid_dosen == true" class="fas fa-check"></i>
                        <button @click="validasiPertemuan(form.id, index)" v-show="form.valid_dosen == false && isDosen && !isMonitoring  && isSemesterAktif"
                          type="button" class="btn btn-primary">
                          Validasi
                        </button>
                        <span v-show="form.valid_dosen == false && (!isDosen || isMonitoring || !isSemesterAktif)">Waiting...</span>
                      </td>
                      <td>
                        <i v-show="form.valid_mahasiswa == true" v-tooltip="form.penanggung_jawab" class="fas fa-check"></i>
                        <button @click="validasiPertemuan(form.id, index)" v-show="form.valid_mahasiswa == false && !isDosen  && isSemesterAktif && (kelas_info.penanggung_jawab || form.penanggung_jawab_sementara == username)"
                          type="button" class="btn btn-primary">
                          Validasi
                        </button>
                        <span v-show="form.valid_mahasiswa == false && (isDosen || !kelas_info.penanggung_jawab || !form.penanggung_jawab_sementara == username )">Waiting...</span>
                      </td>
                      <td v-if="isDosen && !isMonitoring && isSemesterAktif">
                        <button type="button" @click="ubahMateri(form.id,index)" class="btn btn-success">Ubah
                          materi</button>
                        <button type="button" @click="modalValidasi(form.id)" class="btn btn-primary">Validasi
                          Presensi</button>
                        <button type="button" class="btn btn-secondary" @click="tutupPresensi(form.id,index)">Tutup Presensi</button>
                        <button type="button" class="btn btn-warning" @click="modalPJSementara(form.id,index)">Penanggung Jawab Sementara</button>
                        <button type="button" class="btn btn-danger" @click="hapusForm(form.id,index)"><span class="fa fa-trash"></span></button>
                      </td>
                      <td v-else-if="!isMonitoring && isSemesterAktif">
                        <div v-if="checkWaktu(form.created_at)">
                          <button v-if="form.hadir == false || (form.hadir && form.hadir_valid)" :disabled="form.hadir" @click="hadirPertemuan(form.id,index)" type="button"
                            class="btn btn-primary">Hadir</button>
                          <button v-if="form.hadir == true && form.hadir_valid == false" @click="hadirPertemuan(form.id,index)" type="button"
                            class="btn btn-secondary">Menunggu validasi kehadiran</button>
                        </div>
                        <div v-else>
                        <button v-if="form.hadir && form.hadir_valid" disabled type="button"
                          class="btn btn-primary">Hadir</button>
                        <button v-else disabled type="button"
                          class="btn btn-danger">Tidak Hadir</button>
                        </div>
                        <button v-if="kelas_info.penanggung_jawab || form.penanggung_jawab_sementara == username" @click="modalValidasi(form.id)" type="button"
                          class="btn btn-info">Validasi Presensi</button>
                      </td>
                    </tr>
                    <tr v-show="form05.length == 0">
                      <td colspan="8" style="text-align:center">
                        <div v-if="loading" class="spinner-border text-primary" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                        <div v-if="!loading">No Data</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                  <h4 class="modal-title">Validasi Presensi</h4>
                  <button type="button" class="close" @click="show_modal=false">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="table-responsive" style="max-height: 300px;">
                    <table class="table table-head-fixed">
                      <thead>
                        <tr>
                          <th style="text-align:center">Nama Mahasiswa</th>
                          <th style="text-align:center">Waktu</th>
                          <th style="text-align:center">Validasi</th>
                        </tr>
                      </thead>
                      <tbody v-if="!modalLoading">
                        <tr v-if="listPresensi.length != 0" @click="checkboxAllToggle()" style="cursor:pointer;">
                          <td colspan="2" style="text-align:center;vertical-align:middle"> Validasi Semua</td>
                          <td style="text-align:center;vertical-align:middle">
                            <input style="cursor:pointer" type="checkbox"  id="checkbox_all" v-model="checkboxAll">
                          </td>
                        </tr>
                        <tr v-else>
                          <td colspan="3" style="text-align:center">
                            <div >No Data</div>
                          </td>
                        </tr>
                        <tr v-for="list in listPresensi" :key="list.id" style="height:60px;cursor:pointer;" @click="clickValidasi(list.id)" >
                          <td style="text-align:center;vertical-align:middle">{{list.nama}}</td>
                          <td style="text-align:center;vertical-align:middle">{{list.waktu}}</td>
                          <td style="text-align:center;vertical-align:middle">
                            <input style="cursor:pointer" type="checkbox" :value="list.id" :id="'checkbox_'+list.id" v-model="listValidasi">
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-else>
                        <tr>
                          <td colspan="3" style="text-align:center">
                            <div class="spinner-border text-primary" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="modal-footer" v-show="listPresensi.length != 0">
                 <button type="button" class="btn btn-primary" @click="validasiPresensi()">Validasi</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- Modal PJ sementara -->
    <div v-show="show_modal_pj">
      <transition name="modal">
        <div class="modal-mask" >
          <div class="modal-wrapper" @click.self="show_modal_pj=false">
            <div class="modal-dialog" ref="modal" tabindex="0" @keyup.esc="show_modal_pj=false">
              <div v-if="show_modal_pj" class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Pilih Penangung Jawab</h4>
                  <button type="button" class="close" @click="show_modal_pj=false">
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
    <!-- /.content-wrapper -->
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import moment from 'moment';
import 'moment/locale/id';

export default {
  name: "Form05",
  data() {
    return {
      form05: [],
      materi_baru: "",
      show_modal: false,
      show_modal_pj: false,
      isDosen:false,
      listValidasi: [],
      listPresensi: [],
      loading: true,
      modalLoading: true,
      listMahasiswa: [],
      form05pj: "",
      checkboxAll: false
    };
  },
  props: [
    'kelas_info'
  ],
  computed: {
    isMonitoring() {
      return this.$route.name.substr(0,10) == 'monitoring' ? true : false;
    },
    username() {
      return localStorage.getItem('username');
    },
    isSemesterAktif() {
      return localStorage.getItem('semester') == localStorage.getItem('semesterAktif')
    },
  },
  watch: {
    show_modal: function() {
      this.listValidasi = []
    },
    checkboxAll: function() {
      if(this.checkboxAll == true) {
        this.listValidasi = [];
        for(const list of this.listPresensi) {
          this.listValidasi.push(list.id);
        }
      } else {
        this.listValidasi = [];
      }
    },
  },
  methods: {
    checkboxAllToggle() {
      if(this.checkboxAll == true) this.checkboxAll = false;
      else this.checkboxAll = true;
    },
    checkWaktu(string) {
      const time = moment(string,"dddd, L H:m:ss"); //waktu dibuatnya pertemuan
      const now = moment();                         //waktu sekarang

      if(this.kelas_info) 
      {
        const duration = this.kelas_info.sks * 50; //waktu selesainya kelas berdasarkan sks * 50
        time.add(duration,'m');
      }    

      return time >= now;                            //apakah waktu tersebut sudah terlewat
    },
    validasiPertemuan(id, index) {
      const token = localStorage.getItem("token");
      Swal.fire({
        title: "Validasi Pertemuan?",
        confirmButtonText: "Ya",
        showDenyButton: true,
        denyButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(
              process.env.VUE_APP_BASEURL +
                "form-05/" +
                id +
                "/valid?token=" +
                token,
              {
                headers: { "X-Requested-With": "XMLHttpRequest" },
              }
            )
            .then(() => {
              Swal.fire({
                title: 'Berhasil validasi',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
              if (this.isDosen) {
                this.form05[index].valid_dosen = 1;
              } else {
                this.form05[index].valid_mahasiswa = 1;
              }
            })
            .catch((err) => {
              console.log(err);
              if (err?.response?.status == 401) {
                this.$parent.logout();
              }
              
            });
        }
      });
    },
    callForm05() {
      const token = localStorage.getItem('token')
      this.loading = true
      axios
        .get(`${process.env.VUE_APP_BASEURL}kelas/${this.$route.params.kelas_id}/form-05?token=${token}`,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          this.form05 = response.data.data
          this.loading = false
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status == 401) this.$parent.logout();
        });
    },
    tambahPertemuan() {
      Swal.fire({
        title: 'Masukan materi hari ini',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Save',
      }).then((result) => {
        this.materi_baru = result.value
        if(result.isConfirmed) {
          const token = localStorage.getItem("token");
          axios
            .post(`${process.env.VUE_APP_BASEURL}kelas/${this.$route.params.kelas_id}/form-05?token=${token}`,
              { materi: this.materi_baru },
              { headers: { "X-Requested-With": "XMLHttpRequest" } }
            )
            .then((response) => {
              console.log(response);
              Swal.fire({
                title: 'Berhasil Menambahkan Pertemuan',
                toast: true,
                icon: 'success',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
              });
              this.form05.push({
                id: response.data.data.id,
                materi: response.data.data.materi,
                pertemuan: response.data.data.pertemuan,
                valid_dosen: response.data.data.valid_dosen,
                valid_mahasiswa: response.data.data.valid_mahasiswa,
                jumlah_mahasiswa: response.data.data.jumlah_mahasiswa,
                created_at: response.data.data.created_at,
                hadir: response.data.data.hadir,
              });
            })
            .catch((err) => {
              console.log(err);
              if (err?.response?.status == 401) this.$parent.logout();
            });
        }
      })
      
    },
    ubahMateri(id,index) {
      var token = localStorage.getItem('token');
      console.log(index);
      Swal.fire({
        title: 'Ubah materi',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Save',
        inputValue: this.form05[index].materi
      }).then((result) => {
        if(result.isConfirmed) {
          this.materi_baru = result.value;
          axios.put(
            process.env.VUE_APP_BASEURL +
            'form-05/' + id + '?token=' + token,
            {materi: this.materi_baru},
            { headers: { "X-Requested-With": "XMLHttpRequest" } }
          ).then((response) => {
            console.log(response);
            this.form05[index].materi = this.materi_baru
          }) 
          .catch((err) => {
              console.log(err);
              if (err?.response?.status == 401) this.$parent.logout();
            })
        }
      });
    },
    hadirPertemuan(id,index) {
      const token = localStorage.getItem("token");
       Swal.fire({
        title: "Konfirmasi Kehadiran?",
        confirmButtonText: "Ya",
        showDenyButton: true,
        denyButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(
              process.env.VUE_APP_BASEURL +
                "form-05/" +
                id +
                "/hadir?token=" +
                token,
              {
                headers: { "X-Requested-With": "XMLHttpRequest" },
              }
            )
            .then(() => {
              Swal.fire({
                title: 'Berhasil konfirmasi',
                text: 'Harap tunggu validasi penanggung jawab atau dosen',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
              this.form05[index].hadir = true;
            })
            .catch((err) => {
              console.log(err);
              if (err?.response?.status == 401) {
                this.$parent.logout();
              }
              
            });
        }
      });
    },
    modalValidasi(id) {
      const token = localStorage.getItem('token');
      this.show_modal = true;
      this.$nextTick(() => this.$refs.modal.focus());
      this.modalLoading = true
      axios.get(process.env.VUE_APP_BASEURL + 
            'form-05/' + id +
            '/unvalid?token=' +
            token,
            {
              headers: { "X-Requested-With": "XMLHttpRequest" },
            }
          ).then((response) => {
            this.listPresensi = response.data.data;
            this.modalLoading = false
          })
              .catch((err) => {
                console.log(err);
                if (err?.response?.status == 401) {
                  this.$parent.logout();
                }
            
            });
    },
    async modalPJSementara(id) {
      this.form05pj = id;
      const token = localStorage.getItem('token');
      const semester = localStorage.getItem('semester');
      await axios.get(`${process.env.VUE_APP_BASEURL}kelas/${semester}/${this.$route.params.kelas_id}/mahasiswa?token=${token}`, {
            headers: {
              "X-Requested-With": "XMLHttpRequest"
            },
          }
        ).then((response) => {
          console.log('response')
          console.log(response.data);
          this.listMahasiswa = response.data;
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status == 401)
            this.parent.logout();
        });
      this.show_modal_pj = true;
      this.$nextTick(() => this.$refs.modal.focus());
      this.modalLoading = true
    },
    assignPJ() {
      const token = localStorage.getItem('token');
      Swal.fire({
        title: 'Pilih ' + this.penanggungJawab.nama + ' sebagai penanggung jawab pertemuan sementara?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya'
      })
      .then((result) => {
        if(result.isConfirmed){
          axios.post(
              process.env.VUE_APP_BASEURL +
              'form-05/' + this.form05pj + '/penanggung-jawab-sementara?token=' + token,
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
              this.show_modal_pj = false;
            }).catch((err) => {
                console.log(err);
                if (err?.response?.status == 401) this.$parent.logout();
              })
        }
      })
    },
    validasiPresensi() {
      const token = localStorage.getItem('token');
          Swal.fire({
        title: "Konfirmasi Kehadiran?",
        confirmButtonText: "Ya",
        showDenyButton: true,
        denyButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(
              process.env.VUE_APP_BASEURL +
                "presensi/valid?token=" +
                token,this.listValidasi,
              {
                headers: { "X-Requested-With": "XMLHttpRequest" },
              }
            )
            .then(() => {
              Swal.fire({
                title: 'Berhasil validasi',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
              this.show_modal=false;
              this.callForm05();
            })
            .catch((err) => {
              console.log(err)
              if (err?.response?.status == 401) {
                this.$parent.logout();
              }
            });
        }
      });

    },
    clickValidasi(value) {
      console.log(this.listValidasi.indexOf(value));
      if(this.listValidasi.indexOf(value) == -1) {
        this.listValidasi.push(value);
      } else {
        var index = this.listValidasi.indexOf(value);
        this.listValidasi.splice(index,1);
      }
    },
    tutupPresensi(id,index) {
      const token = localStorage.getItem('token');
      Swal.fire({
        title: "Tutup Kesempatan Hadir?",
        confirmButtonText: "Ya",
        showDenyButton: true,
        denyButtonText: "Tidak",
      }).then((result) => {
        if(result.isConfirmed) {
          axios.post(
              process.env.VUE_APP_BASEURL +
              "form-05/" + id + "/tutup-presensi?token=" +
              token,
            ).then(() => {
                Swal.fire({
                title: 'Kehadiran berhasil ditutup',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
              this.form05[index].open = 1;
            }).catch((err) => {
              console.log(err)
              if (err?.response?.status == 401) {
              this.$parent.logout();
              }
            
            });
        }
      })
    },
    hapusForm(id,index) {
      const token = localStorage.getItem('token');
      Swal.fire({
        title: "Hapus Pertemuan?",
        text: "Pertemuan yang dihapus tidak bisa dikembalikan lagi",
        confirmButtonText: "Ya",
        showDenyButton: true,
        denyButtonText: "Tidak",
      }).then((result) => {
        if(result.isConfirmed) {
          Swal.fire({
            title: "Anda yakin?",
            text: "Pertemuan yang dihapus tidak bisa dikembalikan lagi",
            confirmButtonText: "Ya",
            showDenyButton: true,
            denyButtonText: "Tidak",
          }).then((result)=> {
            if(result.isConfirmed) {
              axios.delete(
                process.env.VUE_APP_BASEURL +
                "form-05/" + id + "?token=" +
                token,
            ).then(() => {
                Swal.fire({
                title: 'Pertemuan berhasil dihapus',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
            this.form05.splice(index,1);
            }).catch((err) => {
              console.log(err)
              if (err?.response?.status == 401) {
              this.$parent.logout();
              }
            
            })
            }
          })
        }
      })
    },
  },
  created() {
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    this.callForm05();
  },
  mounted() {
    
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

@import '../assets/styles/tooltip.css';
</style>

<style>
.swal2-container {
  z-index: 10000;
}

 @import '../assets/styles/tooltip.css';
</style>
