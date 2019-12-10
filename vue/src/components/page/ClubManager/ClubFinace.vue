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
				<el-button
				    type="danger"
				    icon="el-icon-delete"
				    class="handle-del mr10"
				    @click="delAllSelection"
				></el-button>		
				<el-button icon="el-icon-lx-add" type="primary" class="button"  @click="handleAdd()"></el-button>
				 <el-input v-model="search" placeholder="请输入财务名称回车搜索" style="width: 60%;" @keyup.enter.native="handleSearch()"></el-input>
				<div>
					<el-table
					    :data="tableData"
					    border
					    class="table"
					    ref="multipleTable"
					    header-cell-class-name="table-header"
					    @selection-change="handleSelectionChange"
					>
					    <el-table-column type="selection" width="55" align="center"></el-table-column>
						<el-table-column prop="finaname" label="财务"></el-table-column>
						<el-table-column prop="content" label="备注"></el-table-column>
					    <el-table-column label="金额">
							 <template slot-scope="scope">￥{{scope.row.money}}</template>
						</el-table-column>
					    <el-table-column label="操作" width="80" align="center">
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
					                @click="handleDelete(scope.$index, scope.row)"
					            ></el-button>
					        </template>
					    </el-table-column>
						  </el-table>
				</div>
			</el-card>
		</el-col>
		<!-- 添加弹出框 -->	  
		<el-dialog title="详情" :visible.sync="addVisible" width="50%">
			<el-form ref="add" :rules="rules" :model="add" label-width="70px">
				<el-form-item prop="finaname" label="名称">
					<el-input v-model="add.finaname" ></el-input>
				</el-form-item>
				<el-form-item prop="money" label="金额">
					<el-input v-model.number="add.money" ></el-input>
				</el-form-item>
				<el-form-item label="备注">
					 <el-input type="textarea" rows="12" v-model="add.content"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="addVisible = false">取 消</el-button>
			    <el-button type="primary" @click="saveAdd">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="50%">
			<el-form ref="edit" :rules="rules" :model="edit" label-width="70px">
				<el-form-item prop="finaname" label="名称">
					<el-input v-model="edit.finaname" ></el-input>
				</el-form-item>
				<el-form-item prop="money" label="金额">
					<el-input v-model.number="edit.money" ></el-input>
				</el-form-item>
				<el-form-item label="备注">
					 <el-input type="textarea" rows="12" v-model="edit.content"></el-input>
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
		finace:[],
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
        dialogImageUrl: '',
        dialogVisible: false,
		search:'',
		multipleSelection: [],
		delList: [],
		rules: {
		    finaname: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
			money: [{ required: true, message: '请输入花费金额', trigger: 'blur' },
			{type: 'number', message: '请输入数字', trigger: 'blur'}]
			
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
		getData(){		
			this.name = this.$router.currentRoute.query.clubname;
			this.id = this.$router.currentRoute.query.clubid;
 			let url = '/clubname/?clubname='+this.name;
 			this.$axios.get(url).then(club_response=>{
				this.clubs = club_response.data;
			}) 
			this.$set(this.clubs);
			let _url = '/clubs/'+this.id+'/finaces';
			this.$axios.get(_url).then(finace_response=>{
				this.tableData = finace_response.data;
			})
		},
		handleSearch(){
			let url =  '/finaname/?finaname='+this.search;
			this.$axios.get(url)
			.then(response=>{
				let list = new Array();
				let search = new Array()
				list = response.data;
				for(var i in list){
					if(list[i].club.clubid == this.id){
						search.push(list[i]);
					}
				}
				this.tableData = search;
			})
		},
		handleAdd(){
			this.addVisible = true;
		},
		saveAdd(){
			let url = '/finaces';
			
			this.$axios.post(url,{
				finaname:this.add.finaname,
				content:this.add.content,
				club:{
					clubid:this.id
				},
				money:this.add.money
			}).then(response=>{
				if(response.status == 200){
					this.$message.success('添加成功');
					this.getData();
				}
				else{
					this.$message.error('添加失败');
				}
			})
			this.addVisible = false;
		},

		handleEdit(index,row){
			this.editVisible = true;
			this.edit = row;
		},
		saveEdit(){
			let url = '/finaces';
			
			this.$axios.post(url,{
				finaid:this.edit.finaid,
				finaname:this.edit.finaname,
				content:this.edit.content,
				club:this.edit.club,
				money:this.edit.money
			}).then(response=>{
				if(response.status == 200){
					this.$message.success('修改成功');
					this.getData();
				}
				else{
					this.$message.error('修改失败');
				}
			})
			this.editVisible = false;
		},
		handleDelete(index, row) {
		    // 二次确认删除
		    this.$confirm('确定要删除吗？', '提示', {
		        type: 'warning'
		    })
		        .then(() => {
					let url = '/finaces/delete';
					this.$axios.post(url,{
						finaid:row.finaid
					}).then(response=>{
						if(response.status == 200){
							this.$message.success('删除成功');
							this.getData();
							this.$set(this.tableData);
						}
						else{
							this.$message.error('删除失败');
						}
					}).catch(function(error){
						
					})
		        })
		        .catch(() => {});
		},
		// 多选操作
		handleSelectionChange(val) {
		    this.multipleSelection = val;
		},
		delAllSelection() {
			
			this.$confirm('确定要全部删除吗？', '提示', {
			    type: 'warning'
			})
			    .then(() => {
					let str = ' ';
					let url = '/finaces/delete';
					this.delList = this.delList.concat(this.multipleSelection);
					console.log(this.delList);
					for (let i = 0; i < this.delList.length; i++) {
					    str += this.delList[i].finaname + ' ';
						this.$axios.post(url,{
							finaid:this.delList[i].finaid
						}).then(response=>{
						})
					}
					this.$message.error(`删除了${str}`);
					this.multipleSelection = [];
					this.delList = [];
					this.getData();
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
