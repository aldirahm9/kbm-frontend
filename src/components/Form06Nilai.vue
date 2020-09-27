<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Kelas {{nama_kelas}}</h1>
            <h5>Kamis, 06.00-08.00</h5>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item"><a href="#">Kelas</a></li>
              <li class="breadcrumb-item active">
                Kelas {{nama_kelas}}
              </li>
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
                      <th colspan="3" style="text-align:center">Tugas</th>
                      <th rowspan="2" style="text-align:center">UTS</th>
                      <th rowspan="2" style="text-align:center">UAS</th>
                      <th rowspan="2" style="text-align:center">Nilai Angka</th>
                      <th rowspan="2" style="text-align:center">Nilai Huruf</th>
                    </tr>
                    <tr>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>3145161324</td>
                      <td class="sticky-col first-col">Aldi Rahmansyah</td>
                      <td>90</td>
                      <td>40</td>
                      <td>70</td>
                      <td>50</td>
                      <td>80</td>
                      <td>87.5</td>
                      <td>B+</td>
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
  <!-- /.content-wrapper -->
</template>

<script>
import axios from "axios";
// import Swal from "sweetalert2";

export default {
  name: "Form06Nilai",
  data() {
    return {
      nama_kelas: ''
    }
  },
  created() {
    const token = localStorage.getItem('token')
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
