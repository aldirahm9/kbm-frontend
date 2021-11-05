<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Dosen</h1>
          </div>
          <!-- <div class="col-sm-6">
            <div style="float:right">
              <label style="padding-right:10px;" for="Semester">Semester</label>
              <select v-model="semester">
                <option v-for="n in semesterList" :value="n.semester" :key="n.semester">{{n.semester}}</option>
              </select>
            </div>
          </div> -->
        </div>
      </div>
      <!-- /.container-fluid -->
    </section>


    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
      
              <div class="card-body p-0 table-responsive table-wrapper">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Nama</th>
                        <th>Prodi</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody v-if="!loading">
                      <tr v-for="(each,index) in dosen" :key="each.id">
                          <td>{{index+1}}</td>
                          <td>{{each.username}}</td>
                          <td>{{each.nama}}</td>
                          <td>{{each.prodi}}</td>
                          <td>{{each.role}}</td>
                          <td><button type="button" @click="ubahRole(index)" class="btn btn-primary" btn-lg btn-block>Ubah Role</button></td>
                      </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="17" style="text-align:center">
                        <div v-if="loading" class="spinner-border text-primary" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
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
  </div>    
</template>




<script>
import axios from 'axios'
import swal from 'sweetalert2'

export default {
    name: "Dosen",
    data() {
        return {
            dosen: [],
            loading:true,
        }
    },
    methods: {
      callDosen() {
        const token = localStorage.getItem('token')
        this.loading = true
        axios
            .get(`${process.env.VUE_APP_BASEURL}dosen/?token=${token}`,
            {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            }
            )
            .then((response) => {
                this.dosen = response.data.data;
                this.loading = false;
            })
            .catch((err) => {
                console.log(err);
                if (err?.response?.status == 401) this.$parent.logout();
        });
      },
      ubahRole(index) {
        const token = localStorage.getItem('token');
        let roleBaru = '';
          if(this.dosen[index].role == 'TPjM') roleBaru = 'Dosen';
          if(this.dosen[index].role == 'Dosen') roleBaru = 'TPjM';
        swal.fire({
            title: 'Ubah Role',
            text: `Ubah role menjadi ${roleBaru}?`,
            icon: 'question',
            showCancelButton: true
        }).then((result) => {
            if(result.isConfirmed) {
              axios
              .post(`${process.env.VUE_APP_BASEURL}dosen/${this.dosen[index].username}/switch-role?token=${token}`,
                {
                  headers: { "X-Requested-With": "XMLHttpRequest" },
                }
              )
              .then((response) => {
                console.log(response);
                this.dosen[index].role = roleBaru;
                swal.fire({
                  title: 'Berhasil merubah role',
                  icon: 'success',
                  toast: true,
                  position: 'top-end',
                  timer: 3000,
                  showConfirmButton: false,
                })
              })
              .catch((err) => {
                console.log(err);
                if (err?.response?.status == 401) this.$parent.logout();
              });
                      
            }
        })
      }
    },
    created() {
      this.callDosen();
    },
}
</script>