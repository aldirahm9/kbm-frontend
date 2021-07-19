<template>
  <!-- Content Wrapper. Contains page content -->

  <div class="tab-pane fade show active" id="custom-content-below-home" role="tabpanel"
    aria-labelledby="custom-content-below-home-tab">
    <br>
    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div v-if="kelas_info" class="col-2-md">
            <button v-if="kelas_info.penanggung_jawab" type="button" class="btn btn-primary"
              @click.prevent="tambahPertemuan">
              <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-lg"> -->
              Pertemuan Baru
            </button>
          </div>
          <div class="col-1-md offset-md-10"><button type="button" class="btn btn-secondary"><span class="fa fa-sync"></span></button></div>
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(form, index) in form05" :key="form.id">
                      <td>{{ form.pertemuan }}</td>
                      <td>{{form.created_at}}</td>
                      <td>{{ form.materi }}</td>
                      <td>{{form.jumlah_mahasiswa}}</td>
                      <td>
                        <i v-show="form.valid_dosen == true" class="fas fa-check"></i>
                        <button @click="validasiPertemuan(form.id, index)" v-show="form.valid_dosen == 0 && isDosen"
                          type="button" class="btn btn-primary">
                          Validasi
                        </button>
                        <span v-show="form.valid_dosen == false && !isDosen">Waiting...</span>
                      </td>
                      <td>
                        <i v-show="form.valid_mahasiswa == true" class="fas fa-check"></i>
                        <button @click="validasiPertemuan(form.id, index)" v-show="form.valid_mahasiswa == 0 && !isDosen"
                          type="button" class="btn btn-primary">
                          Validasi
                        </button>
                        <span v-show="form.valid_mahasiswa == false && isDosen">Waiting...</span>
                      </td>
                      <td v-if="isDosen">
                        <button type="button" @click="ubahMateri(form.id,index)" class="btn btn-success">Ubah
                          materi</button>
                        <button type="button" @click="modalValidasi(form.id)" class="btn btn-primary">Validasi
                          Presensi</button>
                        <button type="button" class="btn btn-secondary" @click="tutupAbsen(form.id,index)">Tutup Absen</button>
                        <button type="button" class="btn btn-danger" @click="hapusForm(form.id,index)"><span class="fa fa-trash"></span></button>
                      </td>
                      <td v-else>
                        <button :disabled="form.hadir == true" @click="hadirPertemuan(form.id,index)" type="button"
                          class="btn btn-primary">Hadir</button>
                        <button v-if="kelas_info.penanggung_jawab" @click="modalValidasi(form.id)" type="button"
                          class="btn btn-info">Validasi Presensi</button>
                      </td>
                    </tr>
                    <tr v-show="form05.length == 0">
                      <td colspan="8" style="text-align:center">No data</td>
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
                      <tbody>
                        <tr v-for="list in listPresensi" :key="list.id" style="height:60px;" @click="clickValidasi(list.id)">
                          <td style="text-align:center;vertical-align:middle">{{list.nama}}</td>
                          <td style="text-align:center;vertical-align:middle">{{list.waktu}}</td>
                          <td style="text-align:center;vertical-align:middle">
                            <input type="checkbox" :value="list.id" :id="'checkbox_'+list.id" v-model="listValidasi">
                          </td>
                        </tr>
                        <tr v-show="listPresensi.length == 0">
                          <td colspan="3" style="text-align:center">No data</td>
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
    <!-- /.modal -->
    <!-- /.content-wrapper -->
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import Axios from 'axios';

export default {
  name: "Form05",
  data() {
    return {
      form05: [],
      materi_baru: "",
      show_modal: false,
      isDosen:false,
      listValidasi: [],
      listPresensi: [],
    };
  },
  props: [
    'kelas_info'
    ],
  methods: {
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
              if (err.response) {
                if (err.response.status == 401) {
                  this.$parent.logout();
                }
              }
            });
        }
      });
    },
    callForm05(token) {
      axios
        .get(
          process.env.VUE_APP_BASEURL +
            "kelas/" +
            this.$route.params.kelas_id +
            "/form-05?token=" +
            token,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          this.form05 = response.data.data;
          console.log('call ' + response);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status == 401) this.$parent.logout();
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
            .post(
              process.env.VUE_APP_BASEURL +
                "kelas/" +
                this.$route.params.kelas_id +
                "/form-05?token=" +
                token,
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
              if (err.response.status == 401) this.$parent.logout();
            });
        }
      })
      
    },
    ubahMateri(id,index) {
      var token = localStorage.getItem('token');
      console.log(id + index);
      Swal.fire({
        title: 'Masukan materi baru',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Save',
      }).then((result) => {
        if(result.isConfirmed) {
          this.materi_baru = result.value;
          Axios.put(
            process.env.VUE_APP_BASEURL +
            'form-05/' + id + '?token=' + token,
            {materi: this.materi_baru},
            { headers: { "X-Requested-With": "XMLHttpRequest" } }
          ).then((response) => {
            console.log(response);
            this.form05[index].materi = this.materi_baru
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
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
              this.form05[index].hadir = true;
            })
            .catch((err) => {
              if (err.response) {
                if (err.response.status == 401) {
                  this.$parent.logout();
                }
              }
            });
        }
      });
    },
    modalValidasi(id) {
      const token = localStorage.getItem('token');
      this.show_modal = true;
      this.$nextTick(() => this.$refs.modal.focus());
      axios.get(process.env.VUE_APP_BASEURL + 
            'form-05/' + id +
            '/unvalid?token=' +
            token,
            {
              headers: { "X-Requested-With": "XMLHttpRequest" },
            }
          ).then((response) => {
            this.listPresensi = response.data.data;
          })
              .catch((err) => {
              if (err.response) {
                if (err.response.status == 401) {
                  this.$parent.logout();
                }
              }
            });
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
                "absen/valid?token=" +
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
              this.callForm05(token);
            })
            .catch((err) => {
              if (err.response) {
                if (err.response.status == 401) {
                  this.$parent.logout();
                }
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
    tutupAbsen(id,index) {
      const token = localStorage.getItem('token');
      Swal.fire({
        title: "Tutup Kesempatan Hadir?",
        confirmButtonText: "Ya",
        showDenyButton: true,
        denyButtonText: "Tidak",
      }).then((result) => {
        if(result.isConfirmed) {
          Axios.post(
              process.env.VUE_APP_BASEURL +
              "form-05/" + id + "/tutup-absen?token=" +
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
              if (err.response) {
                if (err.response.status == 401) {
                this.$parent.logout();
                }
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
              Axios.delete(
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
              if (err.response) {
                if (err.response.status == 401) {
                this.$parent.logout();
                }
              }
            })
            }
          })
        }
      })
    }
  },
  created() {
    if(this.kelas_info) {
      this.$emit('kelas',this.kelas_info);
    }
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    const token = localStorage.getItem("token");
    this.callForm05(token);
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
</style>

<style>
.swal2-container {
  z-index: 10000;
}
</style>
