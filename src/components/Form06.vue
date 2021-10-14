<template>
<div class="tab-pane fade show active" id="custom-content-below-home" role="tabpanel" aria-labelledby="custom-content-below-home-tab">
<br>
    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-1 offset-10">
            <div class="col-1-md offset-md-10">
              <button @click="callForm06()" type="button" class="btn btn-secondary">
                <span v-if="!loading" class="fa fa-sync"></span>
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span v-if="loading" class="sr-only">Loading...</span>
              </button>
            </div>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-12">
            <div class="card">
      
              <div class="card-body p-0 table-responsive table-wrapper">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th rowspan="2" style="width:10px;text-align:center;vertical-align:center">NRM</th>
                      <th class="sticky-col first-col" rowspan="2">Nama</th>
                      <th :colspan="jumlah_pertemuan" style="text-align:center">Pertemuan</th>
                    </tr>
                    <tr>
                      <th v-for="n in jumlah_pertemuan" :key="n">{{n}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="mahasiswa in form06" :key="mahasiswa.id">
                      <td>{{mahasiswa.nomor_induk}}</td>
                      <td class="sticky-col first-col">{{mahasiswa.nama}}</td>
                      <td v-for="n in jumlah_pertemuan" :key="n">
                      <div v-if="mahasiswa.pertemuan.find(p=> p.pertemuan == n)">
                        <div v-for="presensi in mahasiswa.pertemuan" :key="presensi.pertemuan">
                          <div v-if="presensi.pertemuan == n">
                            <div v-if="presensi.valid == 1"> 
                              <i v-tooltip="presensi.created_at" class="fas fa-check"></i>  <!-- present and validated-->
                            </div>
                            <div v-else> <!--ga valid -->
                              <i class="fas fa-times" v-if="!isPertemuanBerlangsung"></i>  <!--  unvalidated on past meeting -->
                              <i class="fas fa-minus-circle" v-else></i> <!--TODO:unvalidated on latest, what icon to use  -->
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <i v-if="n != jumlah_pertemuan" class="fas fa-times"></i> <!--ot Present at all --->
                        <i v-if="n == jumlah_pertemuan && !isPertemuanBerlangsung" class="fas fa-times"></i><!-- Not Present at all -->
                      </div>
                      
                      </td>
                    </tr>

                    <tr v-show="form06.length == 0">
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
              <button type="button" class="btn btn-primary" data-dismiss="modal">Save c hanges</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
      <!-- /.modal -->

  <!-- /.content-wrapper -->
</div>
</template>

<script>
import axios from "axios";
import moment from 'moment';
import 'moment/locale/id';
// import Swal from "sweetalert2";

export default {
  name: "Form06",
  data() {
    return {
      nama_kelas: '',
      form06: [],
      jumlah_pertemuan: null,
      pertemuan_terakhir: '',
      loading: true,
    }
  },
  props: [
    'kelas_info'
  ],
  computed: {
    isMonitoring() {
      return this.$route.name.substr(0,10) == 'monitoring' ? true : false;
    },
    isPertemuanBerlangsung() {
      const time = moment(this.pertemuan_terakhir,"l H:m"); //waktu dibuatnya pertemuan terakhir
      const now = moment();                         //waktu sekarang

      if(this.kelas_info) 
      {
        const duration = this.kelas_info.sks * 50; //waktu selesainya kelas berdasarkan sks * 50
        time.add(duration,'m');
      
      }    
      return time >= now;
    }
  },
  methods: {
    bukaPresensi() {
      const token = localStorage.getItem('token')
      axios
      .post(
        process.env.VUE_APP_BASEURL +
          "form-05/" +
          this.$route.params.kelas_id +
          "/buka-presensi?token=" +
          token,
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        }
      )
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status == 401) this.$parent.logout();
      });
    },
    callForm06() {
      const token = localStorage.getItem('token');
      const semester = localStorage.getItem('semester');
      this.loading = true;
       axios
        .get(`${process.env.VUE_APP_BASEURL}kelas/${semester}/${this.$route.params.kelas_id}/form-06?token=${token}`,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          this.form06 = response.data.data;
          this.jumlah_pertemuan = response.data.meta.jumlah_pertemuan;
          this.pertemuan_terakhir = response.data.meta.pertemuan_terakhir;
          this.loading =false;
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status == 401) this.$parent.logout();
        });
    }
  },
  created() {
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    this.callForm06();
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

@import '../assets/styles/tooltip.css';

</style>
