<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i>社团创建 
                </el-breadcrumb-item>
                <el-breadcrumb-item>社团创建</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item prop="clubname" label="社团名称">
						<el-input v-model="form.clubname"></el-input>
                    </el-form-item>
                    <el-form-item prop="introduce" label="社团简介">
                        <el-input type="textarea" rows="10" v-model="form.introduce"></el-input>
                    </el-form-item>
					<el-form-item label="社团logo">
						<el-image
						    class="table-td-thumb"
						    :src="'data:image/png;base64,'+form.clubLogo"
						    :preview-src-list="['data:image/png;base64,'+form.clubLogo]"
							style="width: 200px;height: 200px;"
							v-if="form.clubLogo"
						></el-image>
						<div class="div1">
							<div class="div2">点击上传</div>
							<input id="file" class="file" type="file" accept="image/png" @change="uploadLogo($event)">
						</div>
					</el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
					
                </el-form>
            </div>
			<el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
			    <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="cancelCrop">取 消</el-button>
			        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			    </span>
			</el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            form: {
                clubid:'',
				clubname:'',
				introduce:'',
				foubder:'',
				createtime:'',
				state:'',
				clubLogo:''
            },
			clubs:[],
			rules: {
			    clubname: [{ required: true, message: '请输入社团名称', trigger: 'blur' }],
				introduce: [{ required: true, message: '请输入社团简介', trigger: 'blur' }],
			}
        };
    },
    methods: {
        onSubmit() {
			
			const url = '/clubs';
			this.$axios.get(url).then(response=>{
				if(response.status == 200){
					this.clubs = response.data;
					if(this.clubs.some(item=>item.clubname === this.form.clubname)){
						this.$message.error('该社团已存在，请再次尝试');
					}
				}
			}).catch(function(error){
				
			})
			
			this.clubs.sort(function(a,b){
				return b.clubid-a.clubid;
			})
			const clubid = this.clubs[0].clubid+1;
			console.log(clubid);
			const _this = this;
			const date = (new Date()).getTime();
			const founder = localStorage.getItem('username');
			const id = localStorage.getItem('userid');
            _this.$axios.post('/clubs',{
				clubid:clubid,
				clubname:this.form.clubname,
				introduce:this.form.introduce,
				foubder:founder,
				createtime:date,
				state:'未批准',
				clubLogo:this.form.clubLogo
            }).then(_response=>{
				if(_response.status == 200){
					_this.$axios.post('/userclubs',{
						user:{
							userid:id
						},
						club:{
							clubid:clubid
						},
						role:'社长',
						state:'已加入'
						
					}).then(__response=>{
						if(__response.status == 200){
							this.$message.success('创建成功');
						}
					})
				}
			})
            
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
				this.form.clubLogo = base64;
			}
		
		
		}
    }
};
</script>
<style>
	.content-title{
	    font-weight: 400;
	    line-height: 50px;
	    margin: 10px 0;
	    font-size: 22px;
	    color: #1f2f3d;
	}
	.pre-img{   
	    width: 100px;
	    height: 100px;
	    background: #f8f8f8;
	    border: 1px solid #eee;
	    border-radius: 5px;
	}
	.crop-demo{
	    display: flex;
	    align-items: flex-end;
	}
	.crop-demo-btn{
	    position: relative;
	    width: 100px;
	    height: 40px;
	    line-height: 40px;
	    padding: 0 20px;
	    margin-left: 30px;
	    background-color: #409eff;
	    color: #fff;
	    font-size: 14px;
	    border-radius: 4px;
	    box-sizing: border-box;
	}
	.crop-input{
	    position: absolute;
	    width: 100px;
	    height: 40px;
	    left: 0;
	    top: 0;
	    opacity: 0;
	    cursor: pointer;
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