<template>
<div class="tab-pane fade show active" id="custom-content-below-home" role="tabpanel" aria-labelledby="custom-content-below-home-tab">

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-2">
            <!-- <button type="button" class="btn btn-primary"
            data-toggle="modal" data-target="#modal-lg">
              Pertemuan Baru
            </button> -->
          </div>
        </div>
        <br />
        <div class="modal fade" id="modal-lg">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Large Modal</h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>One fine body&hellip;</p>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
              
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
      <!-- /.modal -->
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Form 06</h3>
              </div>
              <div class="card-body p-0 table-responsive table-wrapper">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th rowspan="2" style="text-align:center;vertical-align:center">NRM</th>
                      <th class="sticky-col first-col" rowspan="2">Nama</th>
                      <th :colspan="tugas_ids.length" style="text-align:center">Tugas</th>
                      <th rowspan="2" style="text-align:center">UTS</th>
                      <th rowspan="2" style="text-align:center">UAS</th>
                      <th rowspan="2" style="text-align:center">Nilai Angka</th>
                      <th rowspan="2" style="text-align:center">Nilai Huruf</th>
                    </tr>
                    <tr>
                     <th v-for="n in tugas_ids.length" :key="n">{{n}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="form in form06" :key="form.mahasiswa_id">
                      <td>{{form.nomor_induk}}</td>
                      <td class="sticky-col first-col">{{form.nama}}</td>
                      <td v-for="tugas_id in tugas_ids" :key="tugas_id">
                        <div v-for="tugas in form.tugas" :key="tugas.tugas_id">
                        <div v-if="tugas">
                          <div v-if="tugas.tugas_id == tugas_id">
                            {{tugas.nilai}}
                          </div>
                        </div>
                        </div>
                      </td>
                      <td>
                        <div v-if="form.UTS">
                          {{form.UTS.nilai}}
                        </div>
                      </td>
                      <td>
                        <div v-if="form.UAS">
                        {{form.UAS.nilai}}
                        </div>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import axios from "axios";
// import Swal from "sweetalert2";

export default {
  name: "Form06Nilai",
  data() {
    return {
      nama_kelas: '',
      form06:[],
      tugas_ids: [],
    }
  },
  methods: {
     callForm06(token) {
       axios
        .get(
          process.env.VUE_APP_BASEURL +
            "kelas/" +
            this.$route.params.kelas_id +
            "/form-06-nilai?token=" +
            token,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          this.form06 = response.data.data
          this.tugas_ids = response.data.meta.tugas_id
          console.log(response)
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status == 401) this.$parent.logout();
        });
    }
  },
  created() {
    const token = localStorage.getItem('token')
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
    this.callForm06(token)
  },
};
</script>

<style scoped>
table.table-fit {
  width: auto !important;
  table-layout: auto !important;
}
table.table-fit thead th, table.table-fit tfoot th {
    width: auto !important;
}
table.table-fit tbody td, table.table-fit tfoot td {
    width: auto !important;
}
.sticky-col {
  position: -webkit-sticky;
  position: sticky;
  background-color: white;
}
.first-col {

  left: 0px;
}
.second-col {
  
  left: 110px;
}
.table-wrapper {
  position: relative;
  overflow: auto;
  border: 1px solid white;
  white-space: nowrap;
}

</style>
