<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">注册</div>

            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item  prop="username">
                    <el-input  v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input  v-model="param.password" placeholder="密码">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="confirmpwd">
                    <el-input v-model="param.confirmpwd"
                            placeholder="确认密码"
                             >
                        >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="phone">
                    <el-input v-model="param.phone"
                            placeholder="手机"
                    >
                        >
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>

<!--                <el-form-item  prop="type">-->
<!--                    <el-select class="ms-title" v-model="param.type" placeholder="请选择用户类型" >-->
<!--                        <el-option-->
<!--                                v-for="item in options"-->
<!--                                :key="item.id"-->
<!--                                :label="item.type"-->
<!--                                :value="item.id"-->
<!--                        >-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->

<!--                <div class="login-btn">-->
<!--                    <el-button type="primary" @click="submitForm()">登录</el-button>-->
<!--                </div>-->
                <div class="login-btn">
                    <el-button type="primary" @click="zhuce()">确认注册</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="quxiao()">取消</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                options: [{
                    id: '用户',
                    type: '用户'
                }, {
                    id: '管理员',
                    type: '管理员'
                }],
                value: '',

                param: {
                    username: '',
                    password: '',
                    confirmpwd:'',
                    phone:'',
                    type:'用户'
                },
                responseResult:[],
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                    confirmpwd:[{required: true, message: '请确认密码', trigger: 'blur'}],
                    phone:[{required: true, message: '请输入手机号', trigger: 'blur'}]
                },
                registform:{
                    username:'',
                    password:'',
                    phonenum:'',
                    type:'用户'
                }
            };
        },
        methods: {
            submitForm(){
                /* 			this.$axios({
                                method:"post",
                                url:"/login",
                                data:{
                                    username:this.param.username,
                                    password:this.param.password
                                }
                            })
                            .then(successResponse => {
                                if(successResponse.data.code == 200){
                                    this.$router.replace({path:'/Home'})
                                }
                            })
                            .catch(failResponse => {
                                alert("请求失败")
                            }) */
                // this.$axios
                //     .post('/login',{
                //
                //         username:this.param.username,
                //         password:this.param.password,
                //         type:this.param.type
                //
                //     })
                //     .then(successResponse => {
                //         if(successResponse.data.code === 200){
                //             localStorage.setItem('username',this.param.username)
                //             localStorage.setItem('type',this.param.type);
                //             this.$message.success('登录成功');
                //             this.$router.push('/');
                //         }
                //     })
                //     .catch(failResponse => {
                //         this.$message.error('登录失败')
                //
                //     })
            },
            zhuce(){
                if(this.param.password==this.param.confirmpwd){
                this.$axios.post('/users',{
                    username:this.param.username,
                    password:this.param.password,
                    phone:this.param.phone,
                    type:this.param.type,
                    })
                    this.$message.success('注册成功');
                    this.$router.push('/login');}
                else{
                    this.$message.error('两次输入密码不同');
                    this.$router.replace('/regist');
                }
            },
            quxiao(){
                this.$router.push('/login');
            }


            /*        submitForm() {
                        this.$refs.login.validate(valid => {
                            if (valid) {
                                this.$message.success('登录成功');
                                localStorage.setItem('ms_username', this.param.username);
                                this.$router.push('/');
                            } else {
                                this.$message.error('请输入账号和密码');
                                console.log('error submit!!');
                                return false;
                            }
                        });
                    }, */
        },
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }
    .ms-content {
        padding: 30px 30px;
    }
    .login-btn {
        text-align: center;
    }
    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }
    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }

</style>
