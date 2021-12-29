<template>
<div class="tab-pane fade show active" id="custom-content-below-home" role="tabpanel" aria-labelledby="custom-content-below-home-tab">

    <br>
    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
            <div class="row">
          <div  class="col-2-md">
            <button type="button" class="btn btn-success"
              @click="downloadExcel()">
              Download Excel
            </button>
            <button type="button" class="btn btn-primary" v-if="!isMonitoring && isSemesterAktif"
              @click="uploadExcel()">
              Upload Nlai
            </button>
            <button type="button" class="btn btn-warning" v-if="!isMonitoring && isSemesterAktif"
              @click="ubahBobot()">
              Ubah Bobot
            </button>
            <!-- <button type="button" class="btn btn-primary">Upload Nilai</button> -->
          </div>
          <div class="col-1-md offset-md-9 ">
            <button @click="callNilai();callTugas()" type="button" class="btn btn-secondary">
              <span v-if="!loading" class="fa fa-sync"></span>
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-if="loading" class="sr-only">Loading...</span>
            </button>
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
              <!-- <div class="card-header">
                <h3 class="card-title">Form 06</h3>
              </div> -->
              <div class="card-body p-0 table-responsive table-wrapper">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th rowspan="2" style="text-align:center;vertical-align:center">NRM</th>
                      <th class="sticky-col first-col text-center" rowspan="2">Nama</th>
                      <th :colspan="tugas_ids.length" class="text-center">Tugas</th>
                      <th rowspan="2" class="text-center">UTS</th>
                      <th rowspan="2" class="text-center">UAS</th>
                      <th rowspan="2" class="text-center">Nilai Angka</th>
                      <th rowspan="2" class="text-center">Nilai Huruf</th>
                    </tr>
                    <tr>
                     <th v-for="n in tugas_ids.length" :key="n" class="text-center">{{n}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="form in nilai" :key="form.mahasiswa_id">
                      <td class="text-center">{{form.nomor_induk}}</td>
                      <td class="sticky-col first-col text-center">{{form.nama}}</td>
                      <td v-for="tugas_id in tugas_ids" :key="tugas_id.nama">
                        <div v-for="tugas in form.tugas" :key="tugas.tugas_id">
                        <div v-if="tugas">
                          <div v-if="tugas.tugas_id == tugas_id" class="text-center">
                            {{tugas.nilai}}
                          </div>
                        </div>
                        </div>
                      </td>
                      <td v-if="tugas_ids.length == 0"></td>
                      <td>
                        <div v-if="form.UTS" class="text-center">
                          {{form.UTS.nilai}}
                        </div>
                      </td>
                      <td>
                        <div v-if="form.UAS" class="text-center">
                        {{form.UAS.nilai}}
                        </div>
                      </td>
                      <td class="text-center">{{form.nilai_akhir}}</td>
                      <td class="text-center">{{form.nilai_huruf}}</td>
                    </tr>
                    <tr v-if="nilai.length ==0">
                      <td colspan="7" style="text-align:center">
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
    
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";


export default {
  name: "Nilai",
  data() {
    return {
      nama_kelas: '',
      nilai:[],
      tugas_ids: [],
      loading: true,
      tugas: []
    }
  },
  computed: {
    isMonitoring() {
      return this.$route.name.substr(0,10) == 'monitoring' ? true : false;
    },
    isSemesterAktif() {
      return localStorage.getItem('semester') == localStorage.getItem('semesterAktif')
    },
  },
  props: ['kelas_id','kelas_info'],
  methods: {
     callNilai() {
       const token = localStorage.getItem('token')
       this.loading = true
       const semester = localStorage.getItem('semester');
       axios
        .get(
          `${process.env.VUE_APP_BASEURL}kelas/${semester}/${this.$route.params.kelas_id}/nilai?token=${token}`,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          this.nilai = response.data.data
          this.tugas_ids = response.data.meta.tugas_id
          this.loading = false
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status == 401) this.$parent.logout();
        });
      },
      downloadExcel() {
        console.log('donlot');
        const token = localStorage.getItem('token');
        const semester = localStorage.getItem('semester');
          axios
        .get(
          `${process.env.VUE_APP_BASEURL}kelas/${semester}/${this.$route.params.kelas_id}/nilai/excel?token=${token}`,
            {responseType: 'blob'}
        )
        .then((response) => {
          var fileURL = URL.createObjectURL(response.data);
          
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = "Nilai_" + this.kelas_info.nama + ".xlsx";
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status == 401) this.$parent.logout();
        });

         //easy way
        // const token = localStorage.getItem('token')
        //  const url =  process.env.VUE_APP_BASEURL +
        //     "kelas/" +
        //     this.$route.params.kelas_id +
        //     "/nilai/excel?token=" +
        //     token;
        //     const link = document.createElement('a');
        //     link.href = url;
        //     document.body.appendChild(link);
        //     link.click();
        //     link.remove();
      },
      uploadExcel() {
        const token = localStorage.getItem('token')
        Swal.fire({
          title: 'Masukan Excel Nilai',
          input: 'file',
          inputAttributes: {
            'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          showCancelButton: true,
          confirmButtonText: 'Save',
        }).then((result) => {
          if(result.isConfirmed) {
            let formData = new FormData();
            formData.append('file',result.value)
            axios.post(
              `${process.env.VUE_APP_BASEURL}kelas/${localStorage.getItem('semester')}/${this.kelas_id}/nilai/excel?token=${token}`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            ).then((response) => {
              console.log(response)
              if(response.data.status == "Success") {
                Swal.fire({
                  title: 'Upload Nilai Berhasil',
                  icon: 'success',
                  toast: true,
                  position: 'top-end',
                  timer: 3000,
                  showConfirmButton: false,
                });
              } else {
                const string = response.data.message.join('<br>')
                Swal.fire({
                  title: 'Upload nilai Berhasil',
                  icon: 'info',
                  html: string,
                  // toast: true,
                  // position: 'top-end',
                  // timer: 3000,
                  showConfirmButton: true,
                });
              }
              this.callNilai();
            }) 
            .catch((err) => {
                console.log(err);
                if (err?.response?.status == 401) this.$parent.logout();
              })
            }
        });
        
      },
      async ubahBobot() {
        let html = '';
        for(const t of this.tugas) {
          html = html.concat(`<label>${t.nama}</label> <input id="swal-input-${t.id}" class="swal2-input" value="${t.bobot}">`);
        }
        const {value: formValues} = await Swal.fire({
        title: 'Ubah Bobot Tugas',
        html: html,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save',
        preConfirm: () => {
          let returnValues = [];
          for(const t of this.tugas) {
            returnValues.push(document.getElementById(`swal-input-${t.id}`).value);
          }
          return returnValues
        }
      });

      if(formValues) {
        for(let i = 0;i < this.tugas.length;i++) {
          this.tugas[i].bobot = parseInt(formValues[i])
        }
        console.log(this.tugas)
        const token = localStorage.getItem('token');
        axios.put(
            process.env.VUE_APP_BASEURL +
              "tugas/?token=" +
              token, {tugas: this.tugas}
        ).then((response) => {
          console.log(response)
          this.show_modal=false;
          Swal.fire({
            title: 'Berhasil Mengubah Bobot Tugas',
            toast: true,
            icon: 'success',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        this.callTugas();
        this.callNilai();
        }).catch((err) => {
          this.show_modal=false;
          console.log(err);
          if (err?.response?.status == 401) this.$parent.logout();
        })
      }
    },
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
          this.loading = false
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status == 401) this.$parent.logout();
        });
    },
  },
  created() {
    this.isDosen = JSON.parse(localStorage.getItem("isDosen"));
    this.callNilai();
    this.callTugas();
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
