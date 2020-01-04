<template>
  <div>
	  <el-col :span="9" v-for="(item, index) in clubs" :key="item.clubid" :offset="1" style="padding-top: 10px;">
	  	<el-card :body-style="{ padding: '5px' }" style="height: 350px;">
	  		<el-container>
	  		<el-aside>
	  			<div align="center" >
					<template >
					    <el-image
                             :src="'data:image/png;base64,'+item.clubLogo"
                             :preview-src-list="['data:image/png;base64,'+item.clubLogo]"
							 style="width: 270px;height: 300px;margin-top: 10px"
					    ></el-image>
					</template>
				</div>
	  		</el-aside>
	  		<div class="club-info">
	  			<div class="club-name" >{{item.clubname}}</div>
				<div style="margin-bottom: 10px;" >
					<span>创建时间:{{item.createtime | date}}</span>
				</div>
	  			<div style="margin-bottom: 10px;">社长:{{item.founder}}</div>

	  			<div style="margin-bottom: 10px;">简介:{{item.introduce}}</div>
	  		</div>
	  		</el-container>
	      </el-card>
	    </el-col>
		<el-col :span="12" v-for="(item, index) in clubs" :key="index" :offset="1" style="padding-top: 10px;">
			<el-card class="news-info" :body-style="{ padding: '5px' }" style="height: 780px;">
				<el-button icon="el-icon-lx-add" type="primary" class="button"  @click="handleAdd()">发布新闻</el-button>
				 <el-input v-model="newsname" placeholder="新闻名称" style="width: 60%;" @keyup.enter.native="handleSearch()"></el-input>
				
				<div class="radio" style="padding-top: 5px;padding-bottom: 15px;">
				  排序：
				  <el-radio-group v-model="reverse">
				    <el-radio :label="true">倒序</el-radio>
				    <el-radio :label="false">正序</el-radio>
				  </el-radio-group>
				</div>
				  <el-timeline :reverse="reverse">
				    <el-timeline-item v-for="(item,index) in news" :key="item.newsid" :timestamp="item.time | date"  placement="top" >
				      <el-card @click.native="handleEdit(item.newsname)">
				        <h3>{{item.newsname}}</h3>
				        <p>{{item.club.clubname}}</p>
				      </el-card>
					  <el-button icon="el-icon-lx-delete" type="danger" class="button-news"   @click="handleDelete(item.newsid)">删除</el-button>
				    </el-timeline-item>
				  </el-timeline>
			</el-card>
		</el-col>
		<!-- 添加弹出框 -->	  
		<el-dialog title="发布新闻" :visible.sync="addVisible" width="60%">
			<el-form ref="add" :rules="rules" :model="add" label-width="70px">
					<el-form-item label="图片">
						<el-image
						    class="table-td-thumb"
						    :src="'data:image/png;base64,'+add.newsLogo"
						    :preview-src-list="['data:image/png;base64,'+add.newsLogo]"
							style="width: 200px;height: 200px;"
							v-if="add.newsLogo != null && add.newsLogo != ''"
						></el-image>
						<div class="div1">
							<div class="div2">点击上传</div>
							<input id="file" class="file" type="file" accept="image/png" @change="uploadLogo($event)">
						</div>
						
					</el-form-item>
				<el-form-item prop="newsname" label="标题">
					<el-input v-model="add.newsname" ></el-input>
				</el-form-item>
				<el-form-item prop="content" label="内容">
					 <el-input type="textarea" rows="12" v-model="add.content"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="addVisible = false">取 消</el-button>
			    <el-button type="primary" @click="saveAdd">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="详情" :visible.sync="editVisible" width="60%">
			<el-form ref="edit" :model="edit" :rules="rules"  label-width="70px">
					<el-form-item  label="图片">
						<el-image
						    class="table-td-thumb"
						    :src="'data:image/png;base64,'+edit.newsLogo"
						    :preview-src-list="['data:image/png;base64,'+edit.newsLogo]"
							style="width: 200px;height: 200px;"
							v-if="edit.newsLogo != null"
						></el-image>
						<div class="div1">
							<div class="div2">点击上传</div>
							<input id="file" class="file" type="file" accept="image/png" @change="uploadLogo($event)">
						</div>
					</el-form-item>
				<el-form-item prop="newsname" label="标题">
					<el-input v-model="edit.newsname" ></el-input>
				</el-form-item>
				<el-form-item prop="content" label="内容">
					 <el-input type="textarea" rows="12" v-model="edit.content"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="editVisible = false">取 消</el-button>
			    <el-button type="primary" @click="saveEdit()">修 改</el-button>
			</span>
			
		</el-dialog>

  </div>
</template>

<script type="text/javascript">
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
		reverse: true,
        clubs: [],
		news:[],
		lookVisible:false,
		addData:{
			username:"",
			phone:"",
			role:""
		},
		newsname:"",
		name:"",
		id:"",
		state:true,
		addVisible:false,
		editVisible:false,
		newsid:"",
		edit:{},
		add:{
			newsname:"",
			content:"",
			newsLogo:""
		},
        dialogImageUrl: '',
        dialogVisible: false,
		img:"",
		rules: {
		    newsname: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
			content: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }],
			
		}
      }
    },
	mounted(){
		this.getData();
	},
	watch:{
		$route(){
			this.getData();
		}
	},
	methods:{
		handleRemove(file, fileList) {
		console.log(file, fileList);
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
		    this.dialogVisible = true;
		},
		getData(){		
			console.log(this.$router);
			this.name = this.$router.currentRoute.query.clubname;
			this.id = this.$router.currentRoute.query.clubid;
 			let url = '/clubname/?clubname='+this.name;
 			this.$axios.get(url).then(club_response=>{
				this.clubs = club_response.data;
			}) 
			this.$set(this.clubs);
			let url_news = '/clubs/'+this.id+'/news';
			this.$axios.get(url_news).then(news_response=>{
				this.news = news_response.data;
			})
		} ,
		handleAdd(){
			this.addVisible = true;
		},
		handleEdit(index){
			let name = index;
			this.editVisible = true;
			let url = '/newsname/?newsname='+name;
			this.$axios.get(url).then(response=>{
				this.edit = response.data[0];
				console.log(this.edit);
			})
		},
		handleSearch(){
			let url =  '/newsname/?newsname='+this.newsname;
			this.$axios.get(url)
			.then(response=>{
				let list = new Array();
				let search = new Array()
				list = response.data;
				for(var i in list){

					if(list[i].club){

					if(list[i].club.clubid == this.id ){
						search.push(list[i]);
					}
					}
				}
				this.news = search;
			})
		},
		saveAdd(){
			var url = '/news';
			var date = new Date();
			this.$refs.add.validate(valid=>{
				if(valid){
					console.log(valid);
					date = date.getTime();
					this.$axios.post(url,{
						newsname:this.add.newsname,
						content:this.add.content,
						newsLogo:this.add.newsLogo,
						club:{
							clubid:this.id
						},
						time:date
					}).then(response=>{
						if(response.status == 200){
							this.$message.success('添加成功');
							this.getData();
						}
						else{
							this.$message.error('添加失败');
						}
					})
				}

			})
			this.addVisible = false;
		},
		saveEdit(){
			var url = '/news';
			var date = new Date();
			console.log(this.$refs.edit.validate);
			this.$refs.edit.validate(valid=>{
				if(valid){
					console.log(valid);
					date = date.getTime();
					this.$axios.post(url,{
						newsid:this.edit.newsid,
						newsname:this.edit.newsname,
						content:this.edit.content,
						newsLogo:this.edit.newsLogo,
						club:this.edit.club,
						time:date
					}).then(response=>{
						if(response.status == 200){
							this.$message.success('修改成功');
							this.getData();
							this.$set(this.edit);
						}
						else{
							this.$message.error('修改失败');
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
				if(this.editVisible == true){
					this.edit.newsLogo = base64;
					this.$set(this.edit);
				}

				if(this.addVisible == true){
					this.add.newsLogo = base64;
					this.$set(this.add);
				}
			}


		}, 
		handleDelete(index){
			let id = index;
			let url = '/news/delete';
			this.$confirm('确定要删除吗？', '提示', {
			    type: 'warning'
			})
			    .then(() => {
					console.log(id);
					this.$axios.post(url,{
						newsid:id
					}).then(response=>{
						if(response.status === 200){
							this.$message.success('删除成功');
							this.getData();
						}
					})
			    })
			    .catch(() => {});
		},
		handleLook(index){
			let clubid = index;
			console.log(clubid);
			this.lookVisible = true;
			let url = '/'+clubid+'/rolestate';
			this.$axios.get(url).then(response=>{
				this.tableData = response.data;
			})
		}
/* 		handleExit(index){
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

			
		} */
	}

  }
</script>

<style scoped>
	.button-news{
		position: relative;
		right: 0px; 
	}
	.button{
		margin:4px;
	}
	.news-info{
		overflow-y: scroll;
		overflow: auto;
	}
	.news-info::-webkit-scrollbar {
	        width: 10px;    
	        height: 1px;
	    }
	.news-info::-webkit-scrollbar-thumb {
	        border-radius: 10px;
	         -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	        background: #00A854;
	    }
	.news-info::-webkit-scrollbar-track {
	        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	        border-radius: 10px;
	        background: #EDEDED;
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
	        background: #00A854;
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
