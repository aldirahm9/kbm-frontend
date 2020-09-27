<template>
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
                <div class="ph-row">
                  <div class="ph-col-6 big"></div>
                  <div class="ph-col-4 empty big"></div>
                  <div class="ph-col-2 big"></div>
                  <div class="ph-col-4"></div>
                  <div class="ph-col-8 empty"></div>
                  <div class="ph-col-6"></div>
                  <div class="ph-col-6 empty"></div>
                  <div class="ph-col-12"></div>
                </div>
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
</template>

<script>
  export default {
    name: 'Home',
    destroyed() {
      console.log('home destroyed')
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>