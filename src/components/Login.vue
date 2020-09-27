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
                            <input v-model="email" type="email" name="email" class="form-control" placeholder="Email" required>
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
                                    <input type="checkbox" id="remember">
                                    <label for="remember">
                                        Remember Me
                                    </label>
                                </div>
                            </div>
                            <!-- /.col -->
                            <div class="col-4">
                                <button type="submit" class="btn btn-primary btn-block">Sign In</button>
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
    export default {
        name: 'Login',
        data() {
            return {
                email: '',
                password: '',
            }
        },
        methods: {
            login() {
                axios
                    .post(process.env.VUE_APP_BASEURL + 'auth/login',
                        {email: this.email, password: this.password},
                        {headers: {'X-Requested-With': 'XMLHttpRequest'}})
                    .then(
                        (response) => {
                            console.log(response)
                            const token = response.data.access_token;
                            const base64Url = token.split('.')[1];
                            const base64 = base64Url.replace('-','+').replace('_','/');
                            console.log(JSON.parse(window.atob(base64)));
                            localStorage.setItem('token', token);
                            this.$router.push('home');
                        }
                    ).catch(
                        (err) => console.log(err)
                    )
            }
        },

    }
</script>


<style>

</style>