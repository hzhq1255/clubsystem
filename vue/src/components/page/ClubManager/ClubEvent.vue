<template>
  <div>
	  <el-col :span="6" v-for="(item, index) in clubs" :key="index" :offset="1" style="padding-top: 10px;">
	  	<el-card :body-style="{ padding: '5px' }" style="height: 240px;">
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
		  <el-card :body-style="{ padding: '5px' }" style="height: 520px;margin-top: 20px;">
		  	<div style="margin-top: 5px;margin-bottom: 5px;" align="center"><h5>点击左侧活动管理报名人员</h5></div>
			<div>
		  		<el-table
		  		    :data="memberData"
		  		    border
		  		    class="table"
		  		    ref="multipleTable"
		  		    header-cell-class-name="table-header"
		  		    @selection-change="handleSelectionChange(this.row)"
		  		>    
		  			<el-table-column prop="user.username" label="用户名" align="center"></el-table-column>
		  			<el-table-column prop="user.phone" label="电话" align="center"></el-table-column>
		  			<el-table-column  label="报名状态" align="center" width="140px" >
					 <template slot-scope="scope">
					 <el-switch
					   v-model="scope.row.state"
					   active-value="参加"
					   inactive-value="不参加"
					   active-color="#13ce66"
					   inactive-color="#E0E0E0"
					   active-text="通过"
					   inactive-text="等待"
					   @change="saveState(scope.row)">
					 </el-switch>
                  </template>
					</el-table-column>
					<el-table-column label="操作" width="50px" align="center">
						<template slot-scope="scope">
							<el-button
							    type="text"
							    icon="el-icon-delete"
							    class="red"
								v-if="scope.row.state == '不参加'"
							    @click="handleDeleteMember(scope.$index, scope.row)"
							></el-button>
						</template>
					</el-table-column>
		  			</el-table>
		  	</div>
		  </el-card>
	    </el-col>
		<el-col :span="15" v-for="(item, index) in clubs" :key="item.clubid" :offset="1" style="padding-top: 10px;">
			<el-card :body-style="{ padding: '5px' }" style="height: 780px;">	
				<el-button icon="el-icon-lx-add" type="primary" class="button"  @click="handleAdd()">创建活动</el-button>
				 <el-input v-model="search" placeholder="活动名称" style="width: 60%;" @keyup.enter.native="handleSearch()"></el-input>
				<div>
					<el-table
					    :data="tableData"
					    border
					    class="table"
					    ref="multipleTable"
					    header-cell-class-name="table-header"
						@row-click="handleMember"
					>    
					    <el-table-column label="活动照片" align="center" width="80px">
					         <template slot-scope="scope" >
					             <el-image
					                 class="table-td-thumb"
					                 :src="'data:image/png;base64,'+scope.row.eventlogo"
					                 :preview-src-list="['data:image/png;base64,'+scope.row.eventlogo]"
									 style="height: 60px;width: 60px;"
					             ></el-image>
					         </template>
					     </el-table-column>
						<el-table-column prop="eventname" label="活动名称"></el-table-column>
						<el-table-column prop="content" label="活动内容"></el-table-column>
						<el-table-column prop="place" label="地点" ></el-table-column>
						<el-table-column label="时间">
							 <template slot-scope="scope">{{scope.row.starttime | date}} 至 {{scope.row.endtime | date}}</template>
						</el-table-column >
						<el-table-column label="报名" align="center" width="80px">
						    <template slot-scope="scope">
						        <el-tag
						            :type="scope.row.state==='批准'?'success':(scope.row.state==='未批准'?'danger':'')"
						        >{{scope.row.state === '批准'?'通过':(scope.row.state === '未批准'?'等待':'')}}</el-tag>
						    </template>
						</el-table-column>
					    <el-table-column label="操作" width="60px" align="center">
					        <template slot-scope="scope">
					            <el-button
					                type="text"
					                icon="el-icon-edit"
					                @click="handleEdit(scope.$index, scope.row)"
					            ></el-button>
								<el-button
								    type="text"
								    icon="el-icon-delete"
								    class="red"
									v-if="scope.row.state == '未批准'"
								    @click="handleDelete(scope.$index, scope.row)"
								></el-button>
					        </template>
					    </el-table-column>
						  </el-table>
				</div>
			</el-card>
		</el-col>
		<!-- 添加弹出框 -->	  
		<el-dialog title="添加" :visible.sync="addVisible" width="50%">
			<el-form ref="add" :model="add" :rules="rules"  label-width="70px">
				<el-form-item  label="图片">
						<el-image
						    class="table-td-thumb"
						    :src="'data:image/png;base64,'+add.eventlogo"
						    :preview-src-list="['data:image/png;base64,'+add.eventlogo]"
							style="width: 180px;height: 180px;"
							v-if="add.eventlogo"
						></el-image>
						<div class="div1">
							<div class="div2">点击上传</div>
							<input id="file" class="file" type="file" accept="image/png" @change="uploadLogo($event)">
						</div>
					</el-form-item>
				<el-form-item prop="eventname" label="活动">
					<el-input v-model="add.eventname" ></el-input>
				</el-form-item>
				<el-form-item prop="place" label="地点">
					<el-input v-model="add.place" ></el-input>
				</el-form-item>
				<el-form-item prop="time" label="时间">
					<template>
					  <div class="block">
					    <el-date-picker
					      v-model="time_add"
						  :editable="true"
					      type="datetimerange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					  </div>
					</template>
				</el-form-item>
				<el-form-item prop="content" label="内容">
			        <el-input type="textarea" rows="10" v-model="add.content"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="addVisible = false">取 消</el-button>
			    <el-button type="primary" @click="saveAdd">确 定</el-button>
			</span>
		</el-dialog>
		
		<el-dialog title="编辑" :visible.sync="editVisible" width="60%">
 			<el-form ref="edit" :model="edit" :rules="rules"  label-width="70px">
					<el-form-item  label="图片">
						<el-image
						    class="table-td-thumb"
						    :src="'data:image/png;base64,'+edit.eventlogo"
						    :preview-src-list="['data:image/png;base64,'+edit.eventlogo]"
							style="width: 180px;height: 180px;"
						></el-image>
						<div class="div1">
							<div class="div2">点击上传</div>
							<input id="file" class="file" type="file" accept="image/png" @change="uploadLogo($event)">
						</div>
					</el-form-item>
				<el-form-item prop="eventname" label="活动">
					<el-input v-model="edit.eventname" ></el-input>
				</el-form-item>
				<el-form-item prop="place" label="地点">
					<el-input v-model="edit.place" ></el-input>
				</el-form-item>
				<el-form-item prop="time" label="时间">
					<template>
					  <div class="block">
					    <el-date-picker
					      v-model="time"
						  :editable="true"
					      type="datetimerange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					  </div>
					</template>
				</el-form-item>
				<el-form-item prop="content" label="内容">
					 <el-input type="textarea" rows="10" v-model="edit.content"></el-input>
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
		user:[],
		finace:[],
		tableData:[],
		memberData:[],
		lookVisible:false,
		addData:{
		},
		newsname:"",
		name:"",
		id:"",
		state:true,
		addVisible:false,
		editVisible:false,
		newsid:"",
		edit:{
		},
		add:{},
        dialogImageUrl: '',
        dialogVisible: false,
		search:'',
		rules: {
		    eventname: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
			content: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
			place: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
		},
		timeDefaultShow:'',
		row:{},
		time:{},
		time_add:{}
      }
    },
	created(){
		this.getData();
		this.getMemberData();
	},
	watch:{
		$route(){
			this.getData();
			this.getMemberData();
		}
	},
	methods:{
		getData(){		
			this.name = this.$router.currentRoute.query.clubname;
			this.id = this.$router.currentRoute.query.clubid;
 			let url = '/clubname/?clubname='+this.name;
 			this.$axios.get(url).then(club_response=>{
				this.clubs = club_response.data;
			}).catch(function(error){
				
			})
			this.$set(this.clubs);
			let _url = '/clubs/'+this.id+'/events';
			this.$axios.get(_url).then(event_response=>{
				this.tableData = event_response.data;
				console.log(this.tableData);
			}).catch(function(error){
				
			})
			
		},
		getMemberData(){
			if(this.row != null){
				var url = '/'+this.row.eventid+'/state';
				this.$axios.get(url).then(response=>{
					if(response.status == 200){
						this.memberData = response.data;
					}
				}).catch(function(error){
				
			})
			}
		},
		handleAdd(){
			this.addVisible = true;
			this.time_add = [];
		},
		handleMember(row){
			this.row = row;
			this.getMemberData();
			
		},
		handleDelete(index,row){
			let e = row;
			let url = '/events/delete';
			this.$confirm('确定要删除吗？','提示',{
				type:'warning'
				
			}).then(()=>{
				this.$axios.post(url,{
					eventid:e.eventid
				}).then(response=>{
					if(response.status == 200){
						this.$message.success('删除成功');
						this.getData();
						this.getMemberData();
					}else{
						this.$message.error('删除失败');
					}
				})
			}).catch(function(error){
				
			})

		},
		handleDeleteMember(index,row){
			console.log(index);
			console.log(row);
			let m = row;
			let url = '/userevents/delete';
			this.$confirm('确定要删除吗？','提示',{
				type:'warning'
				
			}).then(()=>{
				this.$axios.post(url,{
					id:m.id
				}).then(response=>{
					if(response.status == 200){
						this.$message.success('删除成功');
						this.getMemberData();
					}else{
						this.$message.error('删除失败');
					}
				}).catch(function(error){
				
			})
			}).catch(function(error){
				
			})
		},
		handleEdit(index,row){
			this.editVisible = true;
			this.edit = row;
			this.time = [];
			this.time.push(this.edit.starttime);
			this.time.push(this.edit.endtime);
		},
		handleSearch(){
			let url = '/eventname/?eventname='+this.search;
			this.$axios.get(url)
			.then(response=>{
				if(response.status == 200){
					let list = new Array();
					let search = new Array()
					list = response.data;
					for(var i in list){
						if(list[i].club.clubid == this.id){
							search.push(list[i]);
						}
					}
					this.tableData = search;
					this.$set(this.tableData);
				}
			}).catch(function(error){
				
			})
		},
		saveAdd(){
			let url = '/events';
			console.log(this.time);
 			this.$axios.post(url,{
				club:{
					clubid:this.id
				},
				eventname:this.add.eventname,
				content:this.add.content,
				place:this.add.place,
				starttime:this.time_add[0],
				endtime:this.time_add[1],
				eventlogo:this.add.eventlogo,
				state:"未批准"
			}).then(response=>{
				if(response.status == 200){
					console.log(response);
					this.$message.success('添加成功');
					this.getData();
					this.addVisible = false;
				}else{
					this.$message.error('添加失败');
				}
			}).catch(function(error){
				
			}) 
		},
		saveEdit(){
			
			let url = '/events';
			console.log(this.time);
			this.$axios.post(url,{
				eventid:this.edit.eventid,
				club:this.edit.club,
				eventname:this.edit.eventname,
				content:this.edit.content,
				place:this.edit.place,
				starttime:this.time[0],
				endtime:this.time[1],
				eventlogo:this.edit.eventlogo,
				state:this.edit.state
			}).then(response=>{
				if(response.status == 200){
					console.log(response);
					this.$message.success('修改成功');
					this.getData();
					this.editVisible = false;
				}else{
					this.$message.error('修改失败');
				}
			}).catch(function(error){
				
			})
			
		},
		saveState(row){
			let url = '/userevents';
			let member = row;
			console.log(member);
			this.$axios.post(url,{
				id:member.id,
				user:member.user,
				event:member.event,
				state:member.state
			}).then(response=>{
				if(response.status == 200){
					this.getMemberData();
					
				}
			}).catch(function(error){
				
			})
		},
		handleLook(index){
			let clubid = index;
			console.log(clubid);
			this.lookVisible = true;
			let url = '/'+clubid+'/rolestate';
			this.$axios.get(url).then(response=>{
				console.log(response.data);
				this.tableData = response.data;
			}).catch(function(error){
				
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
					this.edit.eventlogo = base64;
					this.$set(this.edit);
				}

				if(this.addVisible == true){
					this.add.eventlogo = base64;
					this.$set(this.add);
				}
			}
		}
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
