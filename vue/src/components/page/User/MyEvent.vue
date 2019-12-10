<template>
  <div>
	  <el-col :span="20" v-for="(item, index) in myevents" :key="item.event.eventid" :offset="2" style="padding: 10px;">
	  	<el-card :body-style="{ padding: '5px' }" style="height: 400px;" >
	  		<el-container>
	  		<el-aside>
	  			<div align="center" style="">
					<template >
					    <el-image
                             :src="'data:image/png;base64,'+item.event.eventlogo"
                             :preview-src-list="['data:image/png;base64,'+item.event.eventlogo]"
							 style="width: 270px;height: 300px;margin-top: 10px"
					    ></el-image>
					</template>
				</div>
	  			<div  align="center" style="padding-top: 0px;padding-bottom: 0px;">
	  				  <el-button icon="el-icon-lx-people" type="primary" class="button" @click="handleLook(item.event.eventid)">活动成员</el-button>
	  			      <el-button v-if="item.role != '社长'" icon="el-icon-lx-exit" type="danger" class="button"  @click="handleExit(item.event.eventid)">退出活动</el-button>
					  <el-tag
					  icon="el-icon-lx-info" 
					  type="primary" 
					  class="tag" 
					  style="width: 70%;height: 30px ;background: white;-webkit-text-fill-color: #2D8CF0"  
					  v-if="item.state == '参加'"
					  >
					  <h3 >报名成功</h3>
					  </el-tag>
					  <el-tag 
					  icon="el-icon-lx-info" 
					  type="primary" 
					  class="tag" 
					  style="width: 70%;height: 30px ;"  
					  v-if="item.state == '不参加'"
					  >
					  <h3 >报名进行中</h3>
					  </el-tag>
	  			</div>
	  		</el-aside>
	  		<div class="club-info">
	  			<div class="club-name" >{{item.event.eventname}}</div>
	  			<div style="margin-bottom: 10px;">社团:{{item.event.club.clubname}} 地点:{{item.event.place}}</div>
				<div style="margin-bottom: 10px;" >
					<span>时间:{{item.event.starttime | date}}至{{item.event.endtime | date}}</span>
				
				</div>
	  			<div style="margin-bottom: 10px;">内容:{{item.event.content}}</div>
	  		</div>
	  		</el-container>
	      </el-card>
	    </el-col>
	  </el-row>
		<!-- 查看弹出框 -->	  
		<el-dialog title="活动成员" :visible.sync="lookVisible" width="30%">
		    <el-table
			:data="tableData"
			>
			<el-table-column prop="user.username" label="用户" align="center"></el-table-column>	
			<el-table-column prop="user.phone" label="电话" align="center"></el-table-column>
			</el-table>
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
        myevents: [],
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
			let url = id+'/mystate';
			this.$axios.get(url).then(event_response=>{
				this.myevents = event_response.data;
			})
		},
		handleLook(index){
			this.lookVisible = true;
			let eventid = index;
			let url = '/'+eventid+'/state';
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
					let eventid = index;
					let userid = localStorage.getItem('userid');
					console.log(userid);
					let url = '/users/'+ userid +'/events/'+eventid+'/delete';
					this.$axios.post(url,{
							eventid:eventid,
							userid:userid
					}).then(response=>{
						if(response.status == 200){
							this.$message.success('退出成功');
							this.getData();
						}

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
