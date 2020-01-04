<template>
  <div>
	  <el-col :span="6" v-for="(item, index) in clubs" :key="index" :offset="1" style="padding-top: 10px;">
	  	<el-card :body-style="{ padding: '5px' }" style="height: 200px;">
	  		<el-container>
	  		<el-aside style="width: 130px;">
	  			<div align="center" >
					<template >
					    <el-image
                             :src="'data:image/png;base64,'+item.clubLogo"
                             :preview-src-list="['data:image/png;base64,'+item.clubLogo]"
							 style="width: 120px;height: 120px;margin: 5px"
					    ></el-image>
					</template>
				</div>
	  		</el-aside>
	  		<div class="club-info">
	  			<div class="club-name" >{{item.clubname}}</div>
				<div style="margin-bottom: 10px;" >
					<span>创建时间:</span>
				</div>
				<div style="margin-bottom: 10px;" >
					
					<span>{{item.createtime | date}}</span>
				</div>
<!-- 				<div style="margin-bottom: 5px;">
					<el-button icon="el-icon-edit" type="primary" class="button"  @click="">修改内容</el-button>
					<el-button icon="el-icon-edit" type="primary" class="button"  @click="">发布新闻</el-button>
				</div> -->
	  			<div style="margin-bottom: 10px;">社长:{{item.founder}}</div>

	  		</div>
	  		</el-container>
	      </el-card>
	    </el-col>
		<el-col :span="15" v-for="(item, index) in clubs" :key="item.clubid" :offset="1" style="padding-top: 10px;">
			<el-card :body-style="{ padding: '5px' }" style="height: 780px;">
				<el-button icon="el-icon-user" type="success" class="button"  @click="handleEdit()">委任社长</el-button>
				 <el-input v-model="search" placeholder="用户名" style="width: 60%;"></el-input>
				<div>
					    <el-table
					      :data="tableData"
						  border
						  class="table"
						  header-cell-class-name="table-header"
					      style="width: 100%">
						   <el-table-column  label="用户头像"  align="center" width="80px">
							   <template slot-scope="scope">
							       <el-image
							           class="table-td-thumb"
							           :src="'data:image/png;base64,'+scope.row.user.userLogo"
							           :preview-src-list="['data:image/png;base64,'+scope.row.user.userLogo]"
									   style="width: 60px;height: 60px;"
							       ></el-image>
							   </template>
						   </el-table-column>
						   <el-table-column prop="user.username" label="用户名"  align="center"></el-table-column>
						   <el-table-column prop="user.phone" label="手机"  align="center"></el-table-column>
						   <el-table-column prop="role" label="角色"  align="center"></el-table-column>
						   <el-table-column label="申请加入状态" align="center" width="180px">
						   	<template slot-scope="scope">
						   					 <el-switch
						   					   style="display: block"
						   					   v-model="scope.row.state"
						   					   active-value="已加入"
						   					   inactive-value="未加入"
						   					   active-color="#13ce66"
						   					   inactive-color="#E0E0E0"
						   					   active-text="通过"
						   					   inactive-text="未通过"
											   v-if="scope.row.role !='社长'"
						   					   @change="saveMember(scope.$index,scope.row)">
						   					 </el-switch>
											 <el-tag
											     icon="el-icon-s-custom"
											     :type="true"
												 v-if="scope.row.role == '社长'"
											 >{{scope.row.state == '已加入' ?'通过':(scope.row.state == '未加入'?'未通过':'')}}</el-tag>
						    </template>
						   </el-table-column>
						   <el-table-column label="操作" width="60px" align="center">
						   	<template slot-scope="scope">
						   		<el-button
						   		    type="text"
						   		    icon="el-icon-delete"
						   		    class="red"
						   			v-if="scope.row.state == '未加入'"
						   		    @click="handleDelete(scope.$index, scope.row)"
						   		></el-button>
						   	</template>
						   </el-table-column>

					    </el-table>
				</div>
			</el-card>
		</el-col>
		<!-- 添加弹出框 -->	  
		<el-dialog title="委任社长" :visible.sync="editVisible" width="30%">
			<el-form  :model="edit" label-width="70px">
				<el-form-item label="社员">
					<template>
					  <el-select v-model="edit.username" placeholder="请选择下一任社长">
					    <el-option
					      v-for="item in tableData"
					      :key="item.user.userid"
					      :label="item.user.username"
					      :value="item.user.username"
						  v-if="(item.role != '社长'&&item.state !='未加入')"
						  >
					    </el-option>
					  </el-select>
					</template>
				</el-form-item> 
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="editVisible = false">取 消</el-button>
			    <el-button type="primary" @click="saveEdit()">确 定</el-button>
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
		user:[],
		tableData:[],
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
		add:{},
		search:"",
		founder:""
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
		getData(){		
			this.name = this.$router.currentRoute.query.clubname;
			this.id = this.$router.currentRoute.query.clubid;
 			let url = '/clubname/?clubname='+this.name;
 			this.$axios.get(url).then(club_response=>{
				this.clubs = club_response.data;
			}) 
			this.$set(this.clubs);
			if(this.id){
				let url_news = '/'+this.id+'/rolestate';
				this.$axios.get(url_news).then(user_response=>{
					this.tableData = user_response.data;
					console.log(this.founder);
					
				})
			}

		},
		handleEdit(){
			this.editVisible = true;
/* 			this.getNext(); */
		},
		handleSearch(){
			this.newsname;
		},
		saveEdit(){
			let founder = this.tableData.find(item=>item.role=='社长');
			let next = this.tableData.find(item=>item.user.username==this.edit.username&&item.state=='已加入')
			founder.role = '社员';
			next.role = '社长';
			console.log(this.founder);
			console.log(next);
			let url = '/userclubs';
			this.$confirm('确定要更改社长吗？', '提示', {
			    type: 'warning'
			})
			    .then(() => {
					this.$axios.post('/clubs',{
						clubid:next.club.clubid,
						clubname:next.club.clubname,
						introduce:next.club.introduce,
						founder:next.user.username,
						createtime:next.club.createtime,
						clubLogo:next.club.clubLogo,
						state:next.club.state
					}).then(response=>{
						if(response.status == 200){
							console.log('club',response);
							this.$axios.post(url,{
								id:next.id,
								user:next.user,
								club:next.club,
								state:next.state,
								role:next.role
							}).then(response=>{
								if(response.status == 200){
									console.log('next',response);
									this.$axios.post(url,{
										id:founder.id,
										user:founder.user,
										club:founder.club,
										state:founder.state,
										role:founder.role
									}).then(response=>{
										console.log('founder',response);
										if(response.status == 200){
											this.$message.success('操作成功请重新登录');
											this.$router.push('/login');
											this.getData();
										}
										else{
											this.$message.error('操作失败');
										}
										
									}).catch(function(error){
									})
								}
								
							}).catch(function(error){
							})
					
						}
					}).catch(function(error){
					})
			    })
			    .catch(() => {});

		},
		saveMember(index,row){
			let url = '/userclubs';
			let i = index;
			let r = row;
			console.log(i);
			console.log(r);
			let member = row ;
			this.$axios.post(url,{
				id:member.id,
				user:member.user,
				club:member.club,
				state:member.state,
				role:member.role,
			}).then(response=>{
				if(response.status == 200){
					this.memberData = response.data;
					this.getData();
					
					if(member.state === '已加入'){
						let userid = member.user.userid;
						let clubid = member.club.clubid;
						let mail_url = '/'+clubid+'/send/'+userid;
						this.$axios.get(mail_url).then(response=>{
							console.log('发送成功');
						})
					}

				}
			}).catch(function(error){
				
			})
			
		},
		handleDelete(index,row){
			let m = row;
			let url = '/userclubs/delete';
			this.$confirm('确定要删除此成员的申请吗？', '提示', {
			    type: 'warning'
			})
			    .then(() => {
					this.$axios.post(url,{
						id:m.id
					}).then(response=>{
						if(response.status == 200){
							this.$message.success('删除成功');
							this.getData();
						}else{
							this.$message.error('删除失败');
						}
					}).catch(function(e){
						
					})
			    })
			    .catch(() => {});
			
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
	.red {
	    color: #ff0000;
	}
	.button-news{
		position: relative;
		right: 0px; 
	}
	.button{
		margin:4px;
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
