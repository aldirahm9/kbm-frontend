<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Rekap Presensi</h1>
          </div>
          <div class="col-sm-6">
            <div style="float:right">
              <label style="padding-right:10px;" for="Semester">Semester</label>
              <select v-model="semester">
                <option v-for="n in semesterList" :value="n.semester" :key="n.semester">{{n.semester}}</option>
              </select>
            </div>
          </div>
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
                      <!-- <th rowspan="2" style="width:10px;text-align:center;vertical-align:center">#</th> -->
                      <th class="sticky-col first-col" rowspan="2">Mata Kuliah</th>
                      <th :colspan="16" style="text-align:center">Pertemuan</th>
                    </tr>
                    <tr>
                      <th v-for="n in 16" :key="n">{{n}}</th>
                    </tr>
                  </thead>
                  <tbody v-if="!loading">
                    <tr  v-for="presensi in mata_kuliah" :key="presensi.id">
                      <td>{{presensi.nama_kelas}}</td>
                      <td v-for="n in 16" :key="n">
                      <div v-if="presensi.pertemuan[n-1] == 1">
                        <i class="fas fa-check"></i>
                        <!-- <i class="fas fa-times" v-else></i> NOTE: Waiting for validation -->
                      </div>
                      <div v-else-if="presensi.pertemuan[n-1] == 0">
                      <!-- TODO: buat biar kalau yang terakhir pas open doang kosongnya -->
                        <i class="fas fa-times"></i> <!--- NOTE: Gaada presensi sama sekali-->
                      </div>
                      <div v-else>
                          <!-- kosong -->
                      </div>
                      </td>
                    </tr>
                    <tr v-show="mata_kuliah.length == 0">
                      <td colspan="17" style="text-align:center">
                        <div>No Data</div>
                      </td>
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

export default {
    name: "RekapPresensi",
    data() {
        return {
            mata_kuliah: [],
            loading:true,
            semesterList: [],
            semester: '',
        }
    },
    methods: {
      callRekap(semester) {
        const token = localStorage.getItem('token')
        this.loading = true
        axios
            .get(`${process.env.VUE_APP_BASEURL}rekap-presensi/${semester}?token=${token}`,
            {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            }
            )
            .then((response) => {
                this.mata_kuliah = response.data.data;
                this.loading = false;
                this.semesterList = response.data.meta.semester
            })
            .catch((err) => {
                console.log(err);
                if (err?.response?.status == 401) this.$parent.logout();
        });
      }
    },
    watch: {
      semester: function() {
        localStorage.setItem('semester', this.semester);
        this.callRekap(this.semester);
      }
    },
    created() {
      const semester = localStorage.getItem('semester')
      this.semester = semester;
      this.callRekap(semester);
    }
}
</script>