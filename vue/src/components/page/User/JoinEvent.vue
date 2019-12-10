<template>
  <div>
	  <el-col :span="20" v-for="(item, index) in events" :key="index" :offset="2" style="padding: 10px;">
	  	<el-card :body-style="{ padding: '5px' }" style="height: 400px;" v-if="item.role != '社长'">
	  		<el-container>
	  		<el-aside>
	  			<div align="center" style="">
					<template >
					    <el-image
                             :src="'data:image/png;base64,'+item.eventlogo"
                             :preview-src-list="['data:image/png;base64,'+item.eventlogo]"
							 style="width: 270px;height: 300px;margin-top: 10px"
					    ></el-image>
					</template>
				</div>
	  			<div  align="center" style="padding-top: 0px;padding-bottom: 0px;">
	  				  <el-button :disabled="users.some(e=>e.event.eventid === item.eventid) == true || item.state === '未批准'"
					   icon="el-icon-lx-add" type="primary" class="button" @click="handleLook(item.eventid)">加入活动</el-button>
					  <el-tag
					  icon="el-icon-lx-info" 
					  type="primary" 
					  class="tag" 
					  style="width: 70%;height: 30px ;"  
					  v-if="item.state === '未批准'"
					  >
					  <h3 >活动审核中</h3>
					  </el-tag>
	  			</div>
	  		</el-aside>
 	  		<div class="club-info">
	  			<div class="club-name" >{{item.eventname}}</div>
	  			<div style="margin-bottom: 10px;">社团:{{item.club.clubname}} 地点:{{item.place}}</div>
				<div style="margin-bottom: 10px;" >
					<span>时间:{{item.starttime | date}} 至 {{item.endtime | date}}</span>
				
				</div>
	  			<div style="margin-bottom: 10px;">简介:{{item.content}}</div>
	  		</div>
	  		</el-container>
	      </el-card>
	    </el-col>
	  </el-row>

  </div>
</template>

<script>
import dayjs from "dayjs";
  export default {
    name: 'event',
	filters: {
	    date(val) {
	      // 过滤器过滤时间格式
	      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
	    }
	  },
    data () {
      return {
        events: [],
		lookVisible:false,
		tableData:{},
		users:[],
		state:true
		
      }
    },
	created(){
		this.getData();
	},
	methods:{
		getData(){		
			const id = localStorage.getItem('userid');
			let url = '/events';
			this.$axios.get(url).then(response=>{
				console.log(response.data);
				this.events = response.data;
			})
			const _this = this
			let _url = '/'+id+'/mystate'; 
			_this.$axios.get(_url).then(_response=>{
				_this.users = _response.data;
			})
			console.log(users);
		},
		handleLook(index){
/* 			const userid = localStorage.getItem('userid');
			const clubid = index;
			let url = '/userevents';
			this.$axios.post(url,{
				event:{
					eventid:clubid
				},
				user:{
					userid:userid
				},
				state:"不参加"
			})
			.then(response=>{
				if(response.status == 200){
					this.$message.success("加入成功请等待活动主办方审核");
					this.getData();
				}
			}).catch(function(error){
				
			}) */
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
