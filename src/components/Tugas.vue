<template>
  <!-- Content Wrapper. Contains page content -->

  <div class="tab-pane fade show active" id="custom-content-below-home" role="tabpanel"
    aria-labelledby="custom-content-below-home-tab">
    <br>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-2-md">
            <button v-if="isDosen && !isMonitoring && isSemesterAktif" type="button" class="btn btn-primary"
              @click="tambahTugas()">
              <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-lg"> -->
              Tugas Baru
            </button>
          </div>
            <div class="col-1-md offset-md-10">
              <button @click="callTugas()" type="button" class="btn btn-secondary">
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
      
              <div class="card-body table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th style="width: 10px">#</th>
                      <th>Tanggal</th>
                      <th >Tugas</th>
                      <th :style="totalBobot >= 100 ? {'color':'red'} : ''">Bobot% ({{totalBobot}}/100)</th>
                      <th>Tipe</th>
                      <th v-if="!isDosen">Nilai</th>
                      <th v-else v-show="!isMonitoring && isSemesterAktif">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(each, index) in tugas" :key="each.id">
                      <td>{{ index+1 }}</td>
                      <td>{{each.created_at}}</td>
                      <td>{{ each.nama }}</td>
                      <td>{{each.bobot}}</td>
                      <td v-if="each.tipe == 0">Tugas</td>
                      <td v-if="each.tipe == 1">UTS</td>
                      <td v-if="each.tipe == 2">UAS</td>
                      <td v-if="!isDosen">{{each.nilai}}</td>
                      <td v-else v-show="!isMonitoring && isSemesterAktif">
                        <button type="button" class="btn btn-secondary" @click="ubahTugas(each.id,index)">
                          Edit
                        </button>
                        <button type="button" class="btn btn-danger" @click="hapusTugas(each.id,index)"><span class="fa fa-trash"></span></button>
                      </td>
                    </tr>
                    <tr v-show="tugas.length == 0">
                      <td colspan="8" style="text-align:center">
                        <div v-if="loading" class="spinner-border text-primary" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                        <div v-if="!loading">No Data</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br>
                <div v-if="!isDosen">
                  <h3>Nilai Akhir : {{nilai_akhir}}</h3>
                  <h3>Nilai Huruf : B</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- /.content -->
    <!-- <div v-if="show_modal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper" @click.self="show_modal=false">
            <div class="modal-dialog modal-sm" ref="modal" tabindex="0" @keyup.esc="show_modal=false">
              <div v-if="show_modal" class="modal-content">
                <div class="modal-header">
                  <div class="modal-title">Tambah Tugas</div>
                     <button type="button" class="close" @click="show_modal=false">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <input type="text" class="form-control" name="nama" id="" v-model="nama_baru" aria-describedby="helpId" placeholder="Judul Tugas">
                  </div>
                  <div class="form-group">
                    <input type="text" @keypress="numberOnly($event)" class="form-control" name="bobot" v-model="bobot_baru" id="" aria-describedby="helpId" placeholder="Bobot">
                  </div>
                  <div class="form-group">
                    <select class="form-control" v-model="tipe_baru" name="type">
                      <option value="0">Tugas</option>
                      <option value="1">UTS</option>
                      <option value="2">UAS</option>
                    </select>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" @click="tambahTugas()" v-if="modal==0" class="btn btn-primary">Tambah</button>
                  <button type="button" @click="ubahTugas()" v-if="modal==1" class="btn btn-primary">Simpan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition> -->
      <!-- /.modal-dialog -->
    <!-- </div> -->
    <!-- /.modal -->
  <!-- /.content-wrapper -->
</div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Tugas",
  data() {
    return {
      tugas: [],
      isDosen: false,
      show_modal: false,
      nilai_akhir: 0,
      modal: null, //model 0 untuk tambah, modal 1 untuk edit
      id_edit_tugas:null,
      loading: true,
      totalBobot: 0
    };
  },
  watch: {
    bobotArr(val) {
      console.log(val)
      let totalNumber = 0;
      for (let i = 0, l = val.length; i < l; i++) {
        totalNumber += val[i];
      }
      this.totalBobot= totalNumber;
    },
  },
  computed: {
    bobotArr() {
      return this.tugas.map(a => a.bobot)
    },
    isMonitoring() {
      return this.$route.name.substr(0,10) == 'monitoring' ? true : false;
    },
    isSemesterAktif() {
      return localStorage.getItem('semester') == localStorage.getItem('semesterAktif')
    },
  },
  methods: {
    callTugas() {
      const token = localStorage.getItem('token');
      this.loading = true
      axios
        .get(
          process.env.VUE_APP_BASEURL +
            "kelas/" +
            this.$route.params.kelas_id +
            "/tugas?token=" +
            token,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          this.tugas = response.data.data
          this.nilai_akhir = response.data.meta.nilai_akhir
          this.loading = false
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status == 401) this.$parent.logout();
        });
    },
    async tambahTugas() {
      const {value: formValues} = await Swal.fire({
        title: 'Buat Tugas',
        html:
          '<input id="swal-input1" autocomplete="off" class="swal2-input" placeholder="Nama Tugas">' +
          '<input id="swal-input2" class="swal2-input" autocomplete="off" placeholder="Bobot Tugas">' +
          '<select id="swal-input3" class="swal2-input"  name="type"> ' +
                            '<option value="0">Tugas</option>' +
                            '<option value="1">UTS</option>' +
                            '<option value="2">UAS</option>' +
                          '</select>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save',
        preConfirm: () => {
          if(!document.getElementById('swal-input1').value) {
            Swal.showValidationMessage('Nama tugas kosong!');
          }
          else if(!document.getElementById('swal-input2').value) {
            Swal.showValidationMessage('Bobot tugas kosong!');
          }
          else if (isNaN(document.getElementById('swal-input2').value)) {
            Swal.showValidationMessage('Bobot tugas harus berupa angka!');
          }
          else 
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value,
          ]
        }
      });
      if(formValues) {
        const token = localStorage.getItem('token');
        axios.post(
           process.env.VUE_APP_BASEURL +
            "kelas/" +
            this.$route.params.kelas_id +
            "/tugas?token=" +
            token,{
              nama: formValues[0],
              bobot: parseInt(formValues[1]),
              tipe: formValues[2],
            }
      ).then((response) => {
        this.show_modal=false;
        Swal.fire({
          title: 'Berhasil Menambahkan Tugas',
          toast: true,
          icon: 'success',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        this.tugas.push(response.data.data)
      }).catch((err) => {
        this.show_modal=false;
        console.log(err);
        if (err?.response?.status == 401) this.$parent.logout();
        if (err?.response?.status == 403) {
           Swal.fire({
          title: 'Pertemuan belum cukup untuk melaksanakan UAS',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000
        });
        }
      })
      }
      
    },
    hapusTugas(id,index) {
      const token = localStorage.getItem('token');
       Swal.fire({
        title: "Hapus Tugas?",
        text: "Tugas yang dihapus tidak bisa dikembalikan lagi",
        confirmButtonText: "Ya",
        showDenyButton: true,
        denyButtonText: "Tidak",
      }).then((result) => {
        if(result.isConfirmed) {
          Swal.fire({
            title: "Anda yakin?",
            text: "Tugas dan Nilai yang dihapus tidak bisa dikembalikan lagi",
            confirmButtonText: "Ya",
            showDenyButton: true,
            denyButtonText: "Tidak",
          }).then((result)=> {
            if(result.isConfirmed) {
              axios.delete(
                process.env.VUE_APP_BASEURL +
                "tugas/" + id + "?token=" +
                token
            ).then(() => {
                Swal.fire({
                title: 'Tugas berhasil dihapus',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
              });
            this.tugas.splice(index,1);
            }).catch((err) => {
              console.log(err)
              if (err?.response?.status == 401) {
              this.$parent.logout();
              }
            
            })
            }
          })
        }
      });
    },
    async ubahTugas(id,index) {
      const {value: formValues} = await Swal.fire({
        title: 'Ubah Tugas',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Nama Tugas" value="' + this.tugas[index].nama + '">' +
          '<input id="swal-input2" class="swal2-input" onClick="numberOnly()" placeholder="Bobot Tugas" value="' + this.tugas[index].bobot + '">'  +
          '<select id="swal-input3" class="swal2-input"  name="type">' +
                            '<option value="0" ' + (this.tugas[index].tipe == 0 ? 'selected' : '') +'>Tugas</option>' +
                            '<option value="1" ' + (this.tugas[index].tipe == 1 ? 'selected' : '') +'>UTS</option>' +
                            '<option value="2" ' + (this.tugas[index].tipe == 2 ? 'selected' : '') +'>UAS</option>' +
                          '</select>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save',
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value,
          ]
        }
      });

      if(formValues) {
      // console.log(formValues[0]);
      const token = localStorage.getItem('token');
      axios.put(
           process.env.VUE_APP_BASEURL +
            "tugas/" + id+ "?token=" +
            token,{
              nama: formValues[0],
              bobot: parseInt(formValues[1]),
              tipe: formValues[2],
            }
      ).then(() => {
        this.show_modal=false;
        Swal.fire({
          title: 'Berhasil Menambahkan Tugas',
          toast: true,
          icon: 'success',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
       this.callTugas();
      }).catch((err) => {
        this.show_modal=false;
        console.log(err);
        if (err?.response?.status == 401) this.$parent.logout();
      })
      }
    },
    // modalEdit(id,index) {
    //   console.log(id,index);
    //   this.nama_baru = this.tugas[index].nama;
    //   this.tipe_baru = this.tugas[index].tipe;
    //   this.bobot_baru = this.tugas[index].bobot;
    //   this.id_edit_tugas = id;
    //   this.modal=1;
    //   this.show_modal = true;
    //   this.$nextTick(() => this.$refs.modal.focus());
    // },
    numberOnly: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
            evt.preventDefault();
        } else {
            return true;
        }
    },
  },
  created() {
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    this.callTugas();
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
