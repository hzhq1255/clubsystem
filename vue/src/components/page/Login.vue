<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">社团管理系统</div>
            
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                
				<el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()" >
                    >
					<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
				<el-form-item  prop="type">
					<el-select class="ms-title" v-model="param.type" placeholder="请选择用户类型" >	  
					  <el-option
					    v-for="item in options"
					    :key="item.id"
					    :label="item.type"
					    :value="item.id"
						>						
					  </el-option>
					</el-select>
				</el-form-item>
				<div>
                <div class="login-btn" align="right" width="50%">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
				<div class="reg-btn" align="left" width="50%" >
				    <el-button type="primary" @click="handleReg()">注册</el-button>
				</div>
				</div>
            </el-form>
        </div>
	<!-- 	注册框 -->
		<el-dialog title="注册用户" :visible.sync="regVisible" width="30%">
		    <el-form ref="reg" :model="reg" :rules="rules" label-width="70px">
				<el-form-item prop="username" label="用户名">
				    <el-input v-model="reg.username"  ></el-input>
				</el-form-item>
				<el-form-item prop="password1" label="密码" >
				    <el-input v-model="reg.password1" type="password"></el-input>
				</el-form-item>
				<el-form-item prop="password2" label="密码" >
				    <el-input v-model="reg.password2" type="password"></el-input>
				</el-form-item>
				<el-form-item prop="phone" label="手机" >
				    <el-input v-model="reg.phone" ></el-input>
				</el-form-item>
				<el-form-item prop="mail" label="邮箱" >
				    <el-input v-model="reg.mail" ></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<el-image
					    class="table-td-thumb"
					    :src="'data:image/png;base64,'+reg.userLogo"
					    :preview-src-list="['data:image/png;base64,'+reg.userLogo]"
						style="width: 200px;height: 200px;"
						v-if="reg.userLogo"
					></el-image>
					<div class="div1">
						<div class="div2">点击上传</div>
						<input id="file" class="file" type="file" accept="image/png" @change="uploadLogo($event)">
					</div>
					
				</el-form-item>
			</el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="regVisible = false">取 消</el-button>
		        <el-button type="primary" @click="submitReg()">确 定</el-button>
		    </span>
		</el-dialog>
    </div>
</template>

<script>
export default {
	
    data: function() {	

		var checkPhone = (rule, value, callback) => {
		    const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
		    if (!value) {
		      return callback(new Error('电话号码不能为空'))
		    }
		    setTimeout(() => {
		      
		      if (!Number.isInteger(+value)) {
		        callback(new Error('请输入数字值'))
		      } else {
		        if (phoneReg.test(value)) {
		          callback()
		        } else {
		          callback(new Error('电话号码格式不正确'))
		        }
		      }
		    }, 100)
		  };
		 var checkMail = (rule, value, callback) => {
		         if (value === '') {
		           callback(new Error('请正确填写邮箱'));
		         } else {
		           if (value !== '') { 
		             var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		             if(!reg.test(value)){
		               callback(new Error('请输入有效的邮箱'));
		             }
		           }
		           callback();
		         }
		       };
        return {

        options: [{
          id: '用户',
          type: '用户'
        }, {
          id: '管理员',
          type: '管理员'
        }],
        value: '',
			reg:{
				username:'',
				password1:'',
				password2:'',
				phone:''
			}	,
            param: {
                username: 'admin',
                password: '123456',
				type:''
            },
			regVisible:false,
			
			responseResult:[],
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				type: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
                password1: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				password2: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				mail:[{ validator: checkMail, message: '请输入注册邮箱', trigger: 'blur' }],
				phone: [{ validator: checkPhone, message: '请输入手机号码', trigger: 'blur' }],
				
            }
	    };
 },
    methods: {
		handleReg(){
			this.regVisible = true;
		},
		submitReg(){
			this.$refs.reg.validate(vaild=>{
				if(vaild){
					let flag = 0;
					if(this.reg.password1==this.reg.password2){
						this.$axios.post('/user',{
							username:this.reg.username
						}).then(response=>{
							if(response.data != null){
								this.$message.error('该用户已存在');
								flag = 1;
							}
						})
					if(flag === 0){
						let date = (new Date).getTime();
						this.$axios.post('/users',{
							username:this.reg.username,
							password:this.reg.password1,
							phone:this.reg.phone,
							type:'用户',
							userLogo:this.reg.userLogo,
							mail:this.reg.mail,
							regtime:date
						}).then(response=>{
							if(response.status === 200){
								this.regVisible = false;
								this.$message.success('注册成功');
							}
						}).catch(function(error){
							
						})
					}
					}else{
						this.$message.error('两次输入密码不一致');
					}
				}else{
					return false;
				}

			
			});
		},
		submitForm(){

			this.$refs.login.validate(valid => {
			    if (valid) {
					console.log(this.param);
					this.$axios
					.post('/login',{
						username:this.param.username,
						password:this.param.password,
						type:this.param.type 
						
					})
					.then(successResponse => {
						console.log(successResponse);
						if(successResponse.data.code === 200){
							let username_url = '/username/?username='+this.param.username;
							console.log(this.param);
							this.$axios.get(username_url)
							.then(user_response=>{
								
								console.log(user_response.data[0]);
								localStorage.setItem('userid',user_response.data[0].userid);
								console.log(localStorage.getItem('userid',user_response.data.userid));
								
								localStorage.setItem('username',this.param.username)
								localStorage.setItem('type',this.param.type);
								console.log(localStorage);
								this.$router.push('/');
								this.$message.success('登录成功');
							}).catch(failResponse => {
					        }) 

						}
						else{
							this.$message.error('登录失败')
						}
					})
					.catch(failResponse => {
					}) 

			    } else {
			        this.$message.error('请输入账号密码和用户类型');
			        console.log('error submit!!');
			        return false;
			    }
			});
		},
		uploadLogo(event){
			var _this = this;
			var file = event.target.files[0];
			console.log(file);
			
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload =()=>{
				var base64 = reader.result;
				base64 = base64.replace('data:image/png;base64,',''); 
				if(this.regVisible == true){
					this.reg.userLogo = base64;
					this.$set(this.reg);
				}
		
			}
		
		
		}
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
    text-align: left;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.reg-btn {
    text-align: right;
}
.reg-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
	 .div1 {
	        position: relative;
	    }
	
    .div2 {
        width: 100px;
        height: 36px;
        background: #2178fc;
        color: #fff;
        text-align: center;
        line-height: 36px;
    }
    	
    .file {
        width: 200px;/*因为file-input在部分浏览器中会自带一个输入框，需要双击才可以点击上传,放大后将其定位到div外面就好啦*/
        height: 36px;
        position: absolute;
        left: -100px;
        top: 0;
        z-index:1;
        -moz-opacity: 0;
        -ms-opacity: 0;
        -webkit-opacity: 0;
        opacity: 0;  /*css属性——opcity不透明度，取值0-1*/
        filter: alpha(opacity=0); /*兼容IE8及以下--filter属性是IE特有的，它还有很多其它滤镜效果，而filter: alpha(opacity=0); 兼容IE8及以下的IE浏览器(如果你的电脑IE是8以下的版本，使用某些效果是可能会有一个允许ActiveX的提示,注意点一下就ok啦)*/
        cursor: pointer;
    }
</style>