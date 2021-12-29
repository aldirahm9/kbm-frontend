<template>
<keep-alive>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Monitoring</h1>
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
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row" v-if="loaded">
            <div v-for="kelas in kelas" :key="kelas.id" class="col-md-3 col-sm-6 col-12">
              <router-link :to="{name: 'monitoring-form05', params:{kelas_id:kelas.id,kelas_info:kelas}}" tag="span" style="cursor: pointer">
                <div class="info-box">
                  <div class="info-box-content col-12">
                    <span class="info-box-text">{{kelas.nama}}</span>
                    <span class="info-box-number">{{kelas.dosen[0]}}<span v-if="kelas.dosen[1]">, {{kelas.dosen[1]}}</span></span>
                  </div>
                  <!-- /.info-box-content -->
                </div>
              </router-link>
              <!-- /.info-box -->
            </div>
        </div>
        <div class="row" v-if="!loaded">
            <div  class="col-md-3 col-sm-6 col-12">
              <!-- <router-link :to="{name: 'form05', params:{nama_kelas: kelas.nama,kelas_id: kelas.id}}" tag="span" style="cursor: pointer"> -->
                <div class="info-box">
                  <div class="info-box-content col-12">
                  <div class="ph-row" style="padding-top:10px">
                    <div class="ph-col-8 big"></div>
                    <div class="ph-col-4 empty big"></div>
                    <div class="ph-col-6 big"></div>
                  </div>
                  </div>
                  <!-- /.info-box-content -->
                </div>
              <!-- </router-link> -->
              <!-- /.info-box -->
            </div>
            <div  class="col-md-3 col-sm-6 col-12">
              <!-- <router-link :to="{name: 'form05', params:{nama_kelas: kelas.nama,kelas_id: kelas.id}}" tag="span" style="cursor: pointer"> -->
                <div class="info-box">
                  <div class="info-box-content col-12">
                  <div class="ph-row" style="padding-top:10px">
                    <div class="ph-col-8 big"></div>
                    <div class="ph-col-4 empty big"></div>
                    <div class="ph-col-6 big"></div>
                  </div>
                  </div>
                  <!-- /.info-box-content -->
                </div>
              <!-- </router-link> -->
              <!-- /.info-box -->
            </div>
            <div  class="col-md-3 col-sm-6 col-12">
              <!-- <router-link :to="{name: 'form05', params:{nama_kelas: kelas.nama,kelas_id: kelas.id}}" tag="span" style="cursor: pointer"> -->
                <div class="info-box">
                  <div class="info-box-content col-12">
                  <div class="ph-row" style="padding-top:10px">
                    <div class="ph-col-8 big"></div>
                    <div class="ph-col-4 empty big"></div>
                    <div class="ph-col-6 big"></div>
                  </div>
                  </div>
                  <!-- /.info-box-content -->
                </div>
              <!-- </router-link> -->
              <!-- /.info-box -->
            </div>
            <div  class="col-md-3 col-sm-6 col-12">
              <!-- <router-link :to="{name: 'form05', params:{nama_kelas: kelas.nama,kelas_id: kelas.id}}" tag="span" style="cursor: pointer"> -->
                <div class="info-box">
                  <div class="info-box-content col-12">
                  <div class="ph-row" style="padding-top:10px">
                    <div class="ph-col-8 big"></div>
                    <div class="ph-col-4 empty big"></div>
                    <div class="ph-col-6 big"></div>
                  </div>
                  </div>
                  <!-- /.info-box-content -->
                </div>
              <!-- </router-link> -->
              <!-- /.info-box -->
            </div>
        </div>
      </div>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
  </keep-alive>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Monitoring',
    data() {
      return {
        kelas: [],
        loaded: false,
        semesterList: [],
        semester: ''
      }
    },
    methods: {
      callKelas(semester) {
        const token = localStorage.getItem('token')
        this.loaded = false;
        axios
          .get(`${process.env.VUE_APP_BASEURL}monitoring/kelas/${semester}?token=${token}`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          .then(
            (response) => {
              console.log(response.data)
              this.kelas = response.data.data
              this.loaded = true
              this.semesterList = response.data.meta.semester
            }
          ).catch(
            (err) => console.log(err)
          )
        }
    },
    watch: {
      semester: function() {
        localStorage.setItem('semester', this.semester);
        this.callKelas(this.semester);
      }
    },
    created() {
      const semester = localStorage.getItem('semester');
      this.semester = semester;
      this.callKelas(semester);
    },
    destroyed() {
      console.log('monitoring destroyed')
    },
  }
</script>

<style>

</style>