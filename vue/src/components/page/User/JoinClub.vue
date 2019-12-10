<template>
  <div>
	  <el-col :span="20" v-for="(item, index) in clubs" :key="item.clubid" :offset="2" style="padding: 10px;">
	  	<el-card :body-style="{ padding: '5px' }" style="height: 400px;" >
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
	  			<div  align="center" style="padding-top: 0px;padding-bottom: 0px;">
	  				  <el-button :disabled="users.some(e=>e.club.clubid===item.clubid) == true || item.state === '未批准'"
					   icon="el-icon-lx-people" type="primary" class="button" @click="handleAdd(item.clubid)">
					   加入社团
					   </el-button>
					  <el-tag
					  icon="el-icon-lx-info" 
					  type="primary" 
					  class="tag" 
					  style="width: 70%;height: 30px ;"  
					  v-if="item.state === '未批准'"
					  >
					  <h3 >社团审核中</h3>
					  </el-tag>
	  			</div>
	  		</el-aside>
	  		<div class="club-info">
	  			<div class="club-name" >{{item.clubname}}</div>
	  			<div style="margin-bottom: 10px;">社长:{{item.founder}}</div>
				<div style="margin-bottom: 10px;" >
					<span>创建时间:{{item.createtime | date}}</span>
				
				</div>
	  			<div style="margin-bottom: 10px;">简介:{{item.introduce}}</div>
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
    name: 'MyClub',
	filters: {
	    date(val) {
	      // 过滤器过滤时间格式
	      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
	    }
	  },
    data () {
      return {
        clubs: [],
		lookVisible:false,
		users:[],
		tableData:[],
		state:true
		
      }
    },
	mounted(){
		this.getData();
	},
	methods:{
		getData(){		
			let url = '/clubs';
			const _this = this;
			this.$axios.get(url).then(club_response=>{
				this.clubs = club_response.data;
			}) 
			let id = localStorage.getItem('userid');
			let user_url = '/'+id+'/myrolestate';
			
			_this.$axios.get(user_url).then(response=>{
				_this.users = response.data;
				console.log(_this.$data.users)
			})
			console.log(_this);
			console.log(_this.users);
			

		},
		handleAdd(index){
			let id = localStorage.getItem('userid');
			let url = '/userclubs';
			this.$axios.post(url,{
				user:{
					userid:id
				},
				club:{
					clubid:index
				},
				state:"未加入",
				role:"社员"
			}).then(user_response=>{
						
			     	if(user_response.status == 200){
						this.$message.success("加入成功请等待审核");
						this.getData();
					}
			})
		},
		handleSearch(index){
			
			let id = localStorage.getItem('userid');
			let url = id+'/myrolestate';
			this.$axios.get(url).then(user_response=>{
				this.userclubs = user_response.data;
				
				return this.userclubs.some(item=>item.club.clubid == index)
				
			})
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
