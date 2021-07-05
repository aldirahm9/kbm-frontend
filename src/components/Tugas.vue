<template>
  <!-- Content Wrapper. Contains page content -->



    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-2">
     
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
                        <button type="button" class="btn btn-secondary">
                          Edit
                        </button>
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
  <!-- /.content-wrapper -->
</template>

<script>
import axios from "axios";
// import Swal from "sweetalert2";

export default {
  name: "Tugas",
  data() {
    return {
      nama_kelas: "",
      tugas: [],
      isDosen: false,
      materi_baru: "",
      show_modal: false,
      pj: true,
      kehadiran: [],
    };
  },
  methods: {
    callTugas(token) {
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
  },
  created() {
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    const token = localStorage.getItem("token");
    if (!this.$route.params.nama_kelas) {
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
          this.nama_kelas = response.data.data.nama;
          this.$emit("nama_kelas", this.nama_kelas);
          this.$route.params.nama_kelas = this.nama_kelas
        })
        .catch((err) => {
          console.log(err);
          if(err.response.status == 401)
          this.parent.logout();
        });
    } else {
      this.nama_kelas = this.$route.params.nama_kelas;
      this.$emit("nama_kelas", this.nama_kelas);
    }
    this.callTugas(token);
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
