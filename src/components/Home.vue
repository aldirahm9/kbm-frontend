<template>
<keep-alive>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Home</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item active">Home</li>
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="">
              <div class="">
                <div class=""></div>
                <!-- <div class="ph-row">
                  
                  <div class="ph-col-4 empty big"></div>
                  <div class="ph-col-2 big"></div>
                  <div class="ph-col-4"></div>
                  <div class="ph-col-8 empty"></div>
                  <div class="ph-col-6"></div>
                  <div class="ph-col-6 empty"></div>
                  <div class="ph-col-12"></div>
                </div> -->
              </div>
            </div>

            <!-- /.card -->
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
import axios from 'axios';
  export default {
    name: 'Home',
    props: [
      'nama_info',
      'username_info'
    ],
    created() {
      this.$route.params.nama_info = this.nama_info;
      this.$route.params.username_info = this.username_info;
      localStorage.setItem('username',this.username_info);
      const token = localStorage.getItem('token');
      axios.get(`${process.env.VUE_APP_BASEURL}semester-aktif?token=${token}`, {
        headers: {
                    "X-Requested-With": "XMLHttpRequest"
                  },
      }).then((response) => {
        localStorage.setItem('semesterAktif',response.data.semester_aktif);
        localStorage.setItem('semester',response.data.semester_aktif);
      }).catch((err) => {
        console.log(err);
        this.logout();
      })
    },
    destroyed() {
      console.log('home destroyed')
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>