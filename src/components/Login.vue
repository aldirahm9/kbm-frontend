<template>
    <div class="hold-transition login-page">
        <link rel="stylesheet" href="../../plugins/icheck-bootstrap/icheck-bootstrap.min.css">
        <div class="login-box">
            <div class="login-logo">
                <a href="../../index2.html"><b>SIM</b>KBM</a>
            </div>
            <!-- /.login-logo -->
            <div class="card">
                <div class="card-body login-card-body">
                    <p class="login-box-msg">Silahkan Login</p>
                    <form @submit.prevent="login">
                        <div class="input-group mb-3">
                            <input v-model="username" type="text" @keypress="numberOnly($event)" name="username" class="form-control" placeholder="Username" required>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-envelope"></span>
                                </div>
                            </div>
                        </div>
                        <div class="input-group mb-3">
                            <input v-model="password" name="password" type="password" class="form-control" placeholder="Password" required>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <div class="icheck-primary">
                                    <input type="checkbox" id="remember" v-model="remember">
                                    <label for="remember">
                                        Remember Me
                                    </label>
                                </div>
                            </div>
                            <!-- /.col -->
                            <div class="col-4">
                                <button-spinner v-bind="{isLoading,status}" :disabled="isLoading"
                                 type="submit" class="btn btn-primary btn-block">Sign In</button-spinner>
                            </div>
                            <!-- /.col -->
                        </div>
                    </form>

        
                </div>
                <!-- /.login-card-body -->
            </div>
        </div>
        <!-- /.login-box -->
    </div>
</template>

<script>
    import axios from 'axios';
    import ButtonSpinner from 'vue-button-spinner'
    import Swal from "sweetalert2";

    export default {
        name: 'Login',
        data() {
            return {
                username: '',
                password: '',
                isLoading: false,
                status: '',
                nama: '',
                remember: false
            }
        },
        components:{
            ButtonSpinner
        },
        methods: {
            login() {
                this.isLoading = true;
                var ini = this;
                axios
                    .post(process.env.VUE_APP_BASEURL + 'auth/login', {
                        username: this.username,
                        password: this.password,
                        remember: this.remember
                    })
                    .then(
                        (response) => {
                            console.log(response)
                            const token = response.data.access_token;
                            const base64Url = token.split('.')[1];
                            const base64 = base64Url.replace('-', '+').replace('_', '/');
                            console.log(JSON.parse(window.atob(base64)));
                            localStorage.setItem('token', token);

                            axios
                                .get(process.env.VUE_APP_BASEURL + "auth/me?token=" + token, {
                                    headers: {
                                        "X-Requested-With": "XMLHttpRequest"
                                    },
                                })
                                .then((response) => {
                                    this.nama = response.data.nama
                                    this.username = response.data.username
                                    localStorage.setItem('username',response.data.username);
                                    if (response.data.role == 2) {
                                        localStorage.setItem('isDosen', true);
                                        localStorage.setItem('isAdmin', false);
                                        localStorage.setItem('isTpjm', false);
                                    } else if (response.data.role == 3) {
                                        localStorage.setItem('isDosen', true);
                                        localStorage.setItem('isTpjm', true);
                                        localStorage.setItem('isAdmin', false);
                                    } else if (response.data.role == 4) {
                                        localStorage.setItem('isAdmin', true);
                                        localStorage.setItem('isDosen', false);
                                        localStorage.setItem('isTpjm', false);
                                    } else {
                                        localStorage.setItem('isDosen', false);
                                        localStorage.setItem('isTpjm', false);
                                        localStorage.setItem('isAdmin', false);
                                    }
                                    this.isLoading = false;
                                    this.status = 'success';
                                    this.$router.push({name:'home',params:{nama_info:response.data.nama,username_info:response.data.username}});
                                })
                                .catch((err) => {
                                    console.log(err)
                                    this.logout()
                                });
                            
                            
                        }
                    ).catch(
                        function (err) {
                            
                            console.log(err);
                            ini.isLoading = false;
                            ini.status = 'error';
                            if(err?.response?.status == 401) {
                                Swal.fire({
                                    title: 'Username dan Password tidak cocok!',
                                    icon: 'error',
                                    toast: true,
                                    position: 'top-end',
                                    timer: 3000,
                                    showConfirmButton: false,
                                });
                            } else {
                                Swal.fire({
                                    title: 'Server Error!',
                                    icon: 'error',
                                    text: err,
                                    showConfirmButton: false,
                                });

                            }
                            ini.clear();
                        }
                    )
            },
            clear() {
                setTimeout(() => {
                    this.status = ''
                }, 1600);
                this.password = '';
            },
            numberOnly: function (evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
           
        },

    }

</script>