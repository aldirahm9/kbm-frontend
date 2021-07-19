<template>
<keep-alive>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Daftar Kelas</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Daftar Kelas</li>
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row" v-if="loaded">
            <div v-for="kelas in kelas" :key="kelas.id" class="col-md-3 col-sm-6 col-12">
              <router-link :to="{name: 'form05', params:{kelas_id:kelas.id,kelas_info:kelas}}" tag="span" style="cursor: pointer">
                <div class="info-box">
                  <div class="info-box-content col-12">
                    <span class="info-box-text">{{kelas.nama}}</span>
                    <span class="info-box-number">{{kelas.hari}}, {{kelas.jam}}</span>
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
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-8 empty big"></div>
                    <div class="ph-col-8 big"></div>
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
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-8 empty big"></div>
                    <div class="ph-col-8 big"></div>
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
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-8 empty big"></div>
                    <div class="ph-col-8 big"></div>
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
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-8 empty big"></div>
                    <div class="ph-col-8 big"></div>
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
    name: 'DaftarKelas',
    data() {
      return {
        kelas: [],
        loaded: false
      }
    },
    created() {
      const token = localStorage.getItem('token')
      axios
        .get(process.env.VUE_APP_BASEURL + 'kelas?token=' + token, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        .then(
          (response) => {
            console.log(response.data)
            this.kelas = response.data.data
            this.loaded = true
          }
        ).catch(
          (err) => console.log(err)
        )
    },
    destroyed() {
      console.log('destroyed')
    },
  }
</script>

<style>

</style>