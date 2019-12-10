<template>
  <div>
	  <el-col :span="20" v-for="(item, index) in clubs" :key="item.clubid" :offset="2" style="padding-top: 10px;" >
	  	<el-card :body-style="{ padding: '5px' }" style="height: 450px;" >
	  		<el-container>
	  		<el-aside>
	  			<div align="center" style="">
					<template >
					    <el-image
                             :src="'data:image/png;base64,'+item.clubLogo"
                             :preview-src-list="['data:image/png;base64,'+item.clubLogo]"
							 style="width: 270px;height: 300px;margin-top: 10px"
					    ></el-image>
					</template>
				</div>
	  			<div  align="center" style="padding-top: 0px;">
	  				  <el-button :disabled="item.state == '未批准'" icon="el-icon-lx-people" type="primary" class="button" @click="handleManageMember(item.clubid,item.clubname)">管理成员</el-button>
					  <el-button :disabled="item.state == '未批准'" icon="el-icon-menu" type="primary" class="button" @click="handleManageEvent(item.clubid,item.clubname)">管理活动</el-button>
					  <el-button :disabled="item.state == '未批准'" icon="el-icon-menu" type="primary" class="button" @click="handleManageFinace(item.clubid,item.clubname)">管理财务</el-button>
	  			      <el-button :disabled="item.state == '未批准'" icon="el-icon-lx-info" type="danger" class="button"  @click="">解散社团</el-button>
					  <el-tag
					  icon="el-icon-lx-info" 
					  type="primary" 
					  class="tag" 
					  style="width: 70%;height: 30px ;background: white;-webkit-text-fill-color: #2D8CF0"  
					  v-if="item.state == '批准'"
					  >
					  <h3 >社联审核通过</h3>
					  </el-tag>
					  <el-tag 
					  icon="el-icon-lx-info" 
					  type="primary" 
					  class="tag" 
					  style="width: 70%;height: 30px ;"  
					  v-if="item.state == '未批准'"
					  >
						  <h3 >社联审核中</h3>
					  </el-tag>
					  <!-- <el-button icon="el-icon-lx-info" type="primary" class="button" disabled="false" style="border: red;">审核中</el-button> -->
	  			</div>
	  		</el-aside>
	  		<div class="club-info">
	  			<div class="club-name" >{{item.clubname}}</div>
				<div style="margin-bottom: 10px;" >
					<span>创建时间:{{item.createtime | date}}</span>
				</div>
				<div style="margin-bottom: 10px;">社长:{{item.founder}}</div>
				<div style="margin-bottom: 5px;">
					<el-button icon="el-icon-edit" type="primary" class="button" style="background: #20A0FF;border:#20A0FF"  @click="handleEdit(index,item)">修改内容</el-button>
					<el-button :disabled="item.state == '未批准'" icon="el-icon-edit" type="primary" class="button" style="background: #20A0FF;border:#20A0FF" @click="handleEditNews(item.clubid,item.clubname)">发布新闻</el-button>
				</div>
	  			<div style="margin-bottom: 10px;">简介:{{item.introduce}}</div>
	  		</div>
	  		</el-container>
	      </el-card>
	    </el-col>
		</el-col>
		
		
		<el-dialog title="编辑" :visible.sync="editVisible" width="60%">
			<el-form ref="edit" :model="edit" :rules="rules"  label-width="70px">
				<el-form-item v-if="edit.state == '未批准'"  label="Logo">
						<el-image
						    :src="'data:image/png;base64,'+edit.clubLogo"
						    :preview-src-list="['data:image/png;base64,'+edit.clubLogo]"
							style="width: 200px;height: 200px;"
							v-if="edit.clubLogo"
						></el-image>
						<div class="div1">
							<div class="div2">点击上传</div>
							<input id="file" class="file" type="file" accept="image/png" @change="uploadLogo($event)">
						</div>
					</el-form-item>
				<el-form-item :disabled="true" v-if="edit.state == '未批准'" prop="clubname" label="名称">
					<el-input v-model="edit.clubname" ></el-input>
				</el-form-item>
				<el-form-item prop="introduce" label="简介">
					<el-input type="textarea" rows="12" v-model="edit.introduce" ></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="editVisible = false">取 消</el-button>
			    <el-button type="primary" @click="saveEdit()">确 定</el-button>
			</span>
			
		</el-dialog>

  </div>
</template>

<script>
import dayjs from "dayjs";
  export default {
    name: 'MyClub',
	filters: {
	    date(val) {
	      // 过滤器过滤时间格式
	      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
	    }
	  },
    data () {
      return {
		username:"admin",
        clubs: [
		],
		lookVisible:false,
		tableData:{
			username:"",
			phone:"",
			role:""
		},
		edit:{},
		editVisible:false,
		rules: {
		    newsname: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
			content: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }],
			
		}
		
      }
    },
	mounted(){
		this.getData();
	},
	methods:{
		getData(){		
			this.username = localStorage.getItem('username');
			console.log(this.username);
			const id = localStorage.getItem('userid');
			let url = '/'+id+'/myrolestate';
			this.$axios.get(url).then(club_response=>{
				var list = new Array()
				console.log(club_response.data)
				for(let i in club_response.data){

					if(club_response.data[i].club.founder == this.username){
						
						list.push(club_response.data[i].club);
					}
				}
				this.clubs = list;
				console.log(this.clubs);
			})
		},
		handleEdit(index,value){
			this.editVisible = true;
			this.edit = value;
		},
		saveEdit(){
			let url = '/clubs';
			this.$axios.post(url,{
				clubid:this.edit.clubid,
				clubname:this.edit.clubname,
				introduce:this.edit.introduce,
				founder:this.edit.founder,
				createtime:this.edit.createtime,
				clubLogo:this.edit.clubLogo,
				state:this.edit.state
			}).then(response=>{
				if(response.status == 200){
					this.$message.success('修改成功');
					this.getData();
				}
				else{
					this.$message.error('修改失败');
				}
			}).catch(function(error){
				
			})
			this.editVisible = false;
		},
		handleEditNews(index,value){
			let id = index;
			let name = value;
			this.$router.push({
				name:'clubnews',
				query:{
					clubid:id,
					clubname:name
				}});
/* 			console.log(this.$router); */
			
		},
		handleManageMember(index,value){
			let id = index;
			let name = value;
			this.$router.push({
				name:'clubmember',
				query:{
					clubid:id,
					clubname:name
				}});
		},
		handleManageFinace(index,value){
			let id = index;
			let name = value;
			this.$router.push({
				name:'clubfinace',
				query:{
					clubid:id,
					clubname:name
				}});
		},
		handleManageEvent(index,value){
			let id = index;
			let name = value;
			this.$router.push({
				name:'clubevent',
				query:{
					clubid:id,
					clubname:name
				}});
		},
		handleLook(index){
			let clubid = index;
			console.log(clubid);
			this.lookVisible = true;
			let url = '/'+clubid+'/rolestate';
			this.$axios.get(url).then(response=>{
				console.log(response.data);
				this.tableData = response.data;
			})
		},
		handleExit(index){
			this.$confirm('确定要退出吗？', '提示', {
			    type: 'warning'
			})
			    .then(() => {
					let clubid = index;
					let userid = localStorage.getItem('userid');
					console.log(userid);
					let url = 'users/'+userid+'/clubs/'+clubid+'/delete';
					this.$axios.post(url,{
						userid:userid,
						clubid:clubid
					}).then(response=>{
						this.$message.success('退出成功');
						this.getData();
					})
			    })
			    .catch(() => {});

			
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
				if(this.editVisible == true){
					this.edit.clubLogo = base64;
					this.$set(this.edit);
				}
		
			}
		
		
		}, 
	}

  }
</script>

<style scoped>
	.button{
		margin:6px;
	}
	.club-info{
		margin-bottom: 10px ;
		margin-top: 10px ;
		margin-left: 10px;
		margin-right: 10px;
		height: 380px;
		overflow-y: scroll;
		overflow: auto;
		font-family: "微软雅黑";
		font-size: 20px;
		
	}
	.club-info::-webkit-scrollbar {
	        width: 10px;    
	        height: 1px;
	    }
	.club-info::-webkit-scrollbar-thumb {
	        border-radius: 10px;
	         -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	        background: #82848A;
	    }
	.club-info::-webkit-scrollbar-track {
	        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	        border-radius: 10px;
	        background: #EDEDED;
	    } 
	.club-name{
		font-weight: 700;
		font-family: "微软雅黑";
		font-size: 40px;
		margin-bottom: 10px ;
		margin-top: 10px ;
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
