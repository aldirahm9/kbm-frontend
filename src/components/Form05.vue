<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Kelas {{ nama_kelas }}</h1>
            <h5>Kamis, 06.00-08.00</h5>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item"><a href="#">Kelas</a></li>
              <li class="breadcrumb-item active">Kelas {{ nama_kelas }}</li>
            </ol>
          </div>
        </div>
      </div>
      <!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-2">
            <button
              type="button"
              class="btn btn-primary"
              @click.prevent="tambahPertemuan"
            >
              Pertemuan Baru
            </button>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Form 05</h3>
              </div>
              <div class="card-body table-responsive">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th style="width: 10px">Pertemuan</th>
                      <th>Hari/Tanggal</th>
                      <th>Pokok Bahasan</th>
                      <th>Jumlah Mahasiswa Hadir</th>
                      <th>Validasi Dosen</th>
                      <th>Validasi Mahasiswa</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(form, index) in form05" :key="form.id">
                      <td>{{ form.pertemuan }}</td>
                      <td>Kamis, 11/08/2020</td>
                      <td>{{ form.materi }}</td>
                      <td>220</td>
                      <td>
                        <i
                          v-show="form.valid_dosen == 1"
                          class="fas fa-check"
                        ></i>
                        <button
                          @click="validasi(form.id, index)"
                          v-show="form.valid_dosen == 0 && isDosen"
                          type="button"
                          class="btn btn-primary"
                        >
                          Validasi
                        </button>
                             <span v-show="form.valid_dosen == 0 && !isDosen"
                          >Waiting...</span>
                      </td>
                      <td>
                        <i
                          v-show="form.valid_mahasiswa == 1"
                          class="fas fa-check"
                        ></i>
                        <button
                          @click="validasi(form.id, index)"
                          v-show="form.valid_mahasiswa == 0 && !isDosen"
                          type="button"
                          class="btn btn-primary"
                        >
                          Validasi
                        </button>
                        <span v-show="form.valid_mahasiswa == 0 && isDosen"
                          >Waiting...</span
                        >
                      </td>
                      <td>Button Button Button</td>
                    </tr>
                    <tr v-show="form05.length == 0">
                      <td colspan="7" style="text-align:center">No data</td>
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
    
          <div class="modal-dialog modal-lg">
            <form >
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Pertemuan Baru</h4>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label for="materi">Pokok Bahasan</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="materi_baru"
                      required
                    />
                  </div>
                </div>
                <div class="modal-footer ">
                  <button type="submit" class="btn btn-primary">
                    Tambah Pertemuan
                  </button>
                </div>
              </div>
            </form>
            <!-- /.modal-content -->
          </div>
          <!-- /.modal-dialog -->
        </div>
        <!-- /.modal -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Form05",
  data() {
    return {
      nama_kelas: "",
      form05: [],
      isDosen: false,
      materi_baru: "",
      show_modal= false,
    };
  },
  methods: {
    validasi(id, index) {
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
        .post(
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
                "/form-05/add?token=" +
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
              });
            })
            .catch((err) => {
              console.log(err);
              if (err.response.status == 401) this.$parent.logout();
            });
        }
      })
      
    },
  },
  created() {
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    const token = localStorage.getItem("token");
    if (!this.$route.params.nama_kelas) {
      axios
        .post(
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
    this.callForm05(token);
  },
};
</script>

<style></style>
