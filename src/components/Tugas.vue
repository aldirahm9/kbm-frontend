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
            <button type="button" class="btn btn-primary"
              @click="modalTambah()">
              <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-lg"> -->
              Tugas Baru
            </button>
          </div>
            <div class="col-1-md offset-md-10"><button @click="callTugas()" type="button" class="btn btn-secondary"><span class="fa fa-sync"></span></button></div>
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
                      <th>Tugas</th>
                      <th>Bobot%</th>
                      <th>Tipe</th>
                      <th v-if="!isDosen">Nilai</th>
                      <th v-else>Action</th>
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
                      <td v-else>
                        <button type="button" class="btn btn-secondary" @click="modalEdit(each.id,index)">
                          Edit
                        </button>
                        <button type="button" class="btn btn-danger" @click="hapusTugas(each.id,index)"><span class="fa fa-trash"></span></button>
                      </td>
                    </tr>
                    <tr v-show="tugas.length == 0">
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
    <div v-if="show_modal">
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
      </transition>
      <!-- /.modal-dialog -->
    </div>
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
      nama_baru: null,
      bobot_baru: null,
      tipe_baru: 0,
      modal: null, //model 0 untuk tambah, modal 1 untuk edit
      id_edit_tugas:null
    };
  },
  methods: {
    callTugas() {
      const token = localStorage.getItem('token');
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
          this.tugas = response.data.data;
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status == 401) this.$parent.logout();
        });
    },
    tambahTugas() {
      const token = localStorage.getItem('token');
      axios.post(
           process.env.VUE_APP_BASEURL +
            "kelas/" +
            this.$route.params.kelas_id +
            "/tugas?token=" +
            token,{
              nama: this.nama_baru,
              tipe: this.tipe_baru,
              bobot: this.bobot_baru,
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
        if (err.response.status == 401) this.$parent.logout();
      })
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
              if (err.response) {
                if (err.response.status == 401) {
                this.$parent.logout();
                }
              }
            })
            }
          })
        }
      });
    },
    ubahTugas() {
      const token = localStorage.getItem('token');
      axios.put(
           process.env.VUE_APP_BASEURL +
            "tugas/" + this.id_edit_tugas+ "?token=" +
            token,{
              nama: this.nama_baru,
              tipe: this.tipe_baru,
              bobot: this.bobot_baru,
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
        if (err.response.status == 401) this.$parent.logout();
      })
    },
    modalTambah() {
      this.nama_baru=null;
      this.tipe_baru=0;
      this.bobot_baru=null;
      this.modal=0;
      this.show_modal = true;
      this.$nextTick(() => this.$refs.modal.focus());
    },
    modalEdit(id,index) {
      console.log(id,index);
      this.nama_baru = this.tugas[index].nama;
      this.tipe_baru = this.tugas[index].tipe;
      this.bobot_baru = this.tugas[index].bobot;
      this.id_edit_tugas = id;
      this.modal=1;
      this.show_modal = true;
      this.$nextTick(() => this.$refs.modal.focus());
    },
    numberOnly: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
            evt.preventDefault();
        } else {
            return true;
        }
    }
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
