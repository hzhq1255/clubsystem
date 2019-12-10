<template>
  <div>
	  <el-col :span="20" v-for="(item, index) in myclubs" :key="item.club.clubid" :offset="2" style="padding: 10px;">
	  	<el-card :body-style="{ padding: '5px' }" style="height: 400px;" >
	  		<el-container>
	  		<el-aside>
	  			<div align="center" >
					<template >
					    <el-image
                             :src="'data:image/png;base64,'+item.club.clubLogo"
                             :preview-src-list="['data:image/png;base64,'+item.club.clubLogo]"
							 style="width: 270px;height: 300px;margin-top: 10px"
					    ></el-image>
					</template>
				</div>
	  			<div  align="center" style="padding-top: 0px;padding-bottom: 0px;">
	  				  <el-button icon="el-icon-lx-people" type="primary" class="button" @click="handleLook(item.club.clubid)">查看成员</el-button>
	  			      <el-button v-if="item.role != '社长'" icon="el-icon-lx-exit" type="danger" class="button"  @click="handleExit(item.club.clubid)">退出社团</el-button>
					  <el-tag
					  icon="el-icon-lx-info" 
					  type="primary" 
					  class="tag" 
					  style="width: 70%;height: 30px ;background: white;-webkit-text-fill-color: #2D8CF0"  
					  v-if="item.state == '已加入'"
					  >
					  <h3 >审核通过</h3>
					  </el-tag>
					  <el-tag 
					  icon="el-icon-lx-info" 
					  type="primary" 
					  class="tag" 
					  style="width: 70%;height: 30px ;"  
					  v-if="item.state == '未加入'"
					  >
					  <h3 >社团审核中</h3>
					  </el-tag>
	  			</div>
	  		</el-aside>
	  		<div class="club-info">
	  			<div class="club-name" >{{item.club.clubname}}</div>
	  			<div style="margin-bottom: 10px;">社长:{{item.club.founder}}</div>
				<div style="margin-bottom: 10px;" >
					<span>创建时间:{{item.club.createtime | date}}</span>
				
				</div>
	  			<div style="margin-bottom: 10px;">简介:{{item.club.introduce}}</div>
	  		</div>
	  		</el-container>
	      </el-card>
	    </el-col>
	  </el-row>
		<!-- 查看弹出框 -->	  
		<el-dialog title="社团成员" :visible.sync="lookVisible" width="30%">
		    <el-table
			:data="tableData"
			>
			<el-table-column prop="user.username" label="用户" align="center"></el-table-column>	
			<el-table-column prop="user.phone" label="电话" align="center"></el-table-column>
			<el-table-column prop="role" label="职务" align="center"></el-table-column>
			</el-table>
		</el-dialog>

  </div>
</template>

<script>
import dayjs from "dayjs";
  export default {
    name: 'MyClubInfo',
	filters: {
	    date(val) {
	      // 过滤器过滤时间格式
	      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
	    }
	  },
    data () {
      return {
        myclubs: [],
		lookVisible:false,
		tableData:{},
		state:true
		
      }
    },
	created(){
		this.getData();
	},
	methods:{
		getData(){		
			
			const id = localStorage.getItem('userid');
			console.log(id);
			let url = id+'/myrolestate';
			this.$axios.get(url).then(club_response=>{
				console.log(club_response.data);
				this.myclubs = club_response.data;
				if(this.myclubs.length == 0){
					this.$confirm('您还没有加入社团！', '提示', {
					    type: 'warning'
					}).catch(function(error){
						
					})
				}
			})
		},
		handleLook(index){
			this.lookVisible = true;
			let clubid = index;
			let url = '/'+clubid+'/rolestate';
			this.$axios.get(url)
			.then(response=>{
				if(response.status == 200){
					this.tableData = response.data;
				}
			}).catch(function(error){
				
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

			
		}
	}

  }
</script>

<style scoped>
	.button{
		margin: 6px ;

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
</style>
