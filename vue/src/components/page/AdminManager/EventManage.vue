<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">活动信息</i> 
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div> 
        <div class="container">
            <div class="handle-box">
<!--               <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量</el-button> -->				
                <el-input v-model="query.name" placeholder="请输入活动名称" class="handle-input mr10"  @keyup.enter.native="handleSearch()"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
               <!-- <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd()">添加</el-button> -->
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
              <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="eventid" label="ID" width="55" align="center"></el-table-column>

				
                <el-table-column prop="picture" label="活动照片" align="center">
                     <template slot-scope="scope">
                         <el-image
                             class="table-td-thumb"
                             :src="'data:image/png;base64,'+scope.row.eventlogo"
                             :preview-src-list="['data:image/png;base64,'+scope.row.eventlogo]"
                         ></el-image>
                     </template>
                </el-table-column> 
				<el-table-column prop="eventname" label="活动名称"></el-table-column>
				<el-table-column prop="club.clubname" label="所属社团" sortable></el-table-column>
                <el-table-column prop="content" label="活动内容"></el-table-column>
				<el-table-column prop="place" label="活动地点"></el-table-column>
                <el-table-column prop="starttime" label="开始时间" sortable>
					<template slot-scope="scope">
						<span>{{scope.row.starttime | date}} </span>
					</template>
				</el-table-column>
				<el-table-column prop="endtime" label="结束时间" sortable>
					<template slot-scope="scope">
						<span>{{scope.row.endtime | date}} </span>
					</template>
				</el-table-column>
				 <el-table-column width="180px" prop="state" label="审批状态" align="center" sortable>
					 <template slot-scope="scope">
					 <el-switch
					   style="display: block"
					   v-model="scope.row.state"
					   active-value="批准"
					   inactive-value="未批准"
					   active-color="#13ce66"
					   inactive-color="#E0E0E0"
					   active-text="批准"
					   inactive-text="未批准"
					   @change="saveState(scope.$index,scope.row)">
					 </el-switch>
                  </template>
				 </el-table-column>
                <el-table-column label="操作" width="100px" align="center">
                    <template slot-scope="scope">
<!--                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button> -->
						<el-button
						    type="text"
						    icon="el-icon-lx-info"
						    @click="handleLook(scope.$index, scope.row)"
							
						>参与人员</el-button>
<!--                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button> -->

                    </template>
                </el-table-column>

            </el-table>
<!--            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div> -->
        </div>

        <!-- 编辑弹出框 -->
<!--        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="活动名称" >
				    <el-input v-model="form.eventname" ></el-input>
				</el-form-item>
				<el-form-item label="所属社团" >
					  <el-select v-model="form.club.clubid" placeholder="选择社团">
					    <el-option
					      v-for="item in options"
						  :value="item.clubid"
					      :key="item.clubid"
					      :label="item.clubname"
					      >
					    </el-option>
					  </el-select>
			    </el-form-item>
				<el-form-item label="活动地点">
				    <el-input v-model="form.place" ></el-input>
				</el-form-item>
				<el-form-item label="开始时间">
				    <el-col :span="11">
				        <el-date-picker
				            type="date"
				            placeholder="选择日期"
				            v-model="form.date1"
				            value-format="yyyy-MM-dd"
				            style="width: 100%;"
							:default-value="timeDefaultShow"
				        ></el-date-picker>
				    </el-col>
				    <el-col class="line" :span="2">-</el-col>
				    <el-col :span="11">
				        <el-time-picker
				            placeholder="选择时间"
				            v-model="form.date2"
				            style="width: 100%;"
							value-format="HH:mm:ss"
							:default-value="timeDefaultShow"
				        ></el-time-picker>
				    </el-col>
				</el-form-item>
				<el-form-item label="活动内容">
				    <el-input type="textarea" rows="8" v-model="form.content"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog> -->
		
		<!-- 查看弹出框 -->
		<el-dialog title="参加人员" :visible.sync="lookVisible" width="30%">
            
			<el-table
                :data="memberData"
                border
                class="table"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="user.userid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="user.username" label="用户" align="center"></el-table-column>				
				<el-table-column prop="user.phone" label="手机" align="center"></el-table-column>
            </el-table>
		</el-dialog>
    </div>
</template>

<script>
	
import dayjs from "dayjs";
export default {
    name: 'eventmanage',
	filters: {
	    date(val) {
	      // 过滤器过滤时间格式
	      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
	    }
	  },
    data() {
        return {
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: {},
            multipleSelection: [],
            delList: [],
            editVisible: false,
			addVisible: false,
			lookVisible:false,
            pageTotal: 0,
			memberpageTotal:0,
            form: {
				eventid:'',
				club:{
					clubid:'',
					clubname:'',
					introduce:'',
					founder:'',
					createtime:'',
					state:''
				},
				eventname:'',
				content:'',
				place:'',
				starttime:'',
				endtime:'',
				eventlogo:'',
				state:''
				
			},
			add: {
				eventid:'',
				club:{
					clubid:'',
					clubname:'',
					introduce:'',
					founder:'',
					createtime:'',
					state:''
				},
				eventname:'',
				content:'',
				place:'',
				starttime:'',
				endtime:'',
				eventlogo:'',
				state:''
				
			},
			memberData:[],
			select:'',
			options:[],
            idx: -1,
            id: -1,
			value1:true,
			timeDefaultShow:'',
			rules:{
				eventname: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				clubname: [{ required: true, message: '请选择所属社团', trigger: 'blur' }],
				place: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
				starttime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
			}
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
			
			this.$axios.get('/events').then(response=>{
				this.tableData = response.data;
				this.pageTotal = this.tableData.length || 50;
				
			})
			.catch(function(error){
			})

        },		

        // 触发搜索按钮
        handleSearch() {

			const url = '/eventname/?eventname='+this.query.name;
			this.$axios.get(url)
			.then(response=>{
				if(response.status == 200){
					this.tableData = response.data;
					this.$set(this.tableData,this.query, 'pageIndex', 1);
				}
			})

        },

        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
			var e = row;
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					this.$axios.post('events/delete',{
						eventid:e.eventid,
						club:e.club,
						eventname:e.eventname,
						place:e.place,
						content:e.content,
						starttime:e.starttime,
						state:e.state
					}).then(response=>{
							this.$message.success('删除成功');
							this.tableData.splice(index, 1);
							this.getData();
							
					}).catch(function(error){
						
					})

                })
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
 			//两个循环不行到时候得改
			for(var i in this.tableData){
				for(var j in this.multipleSelection){
					if(this.tableData[i] == this.multipleSelection[j]){
						console.log(this.tableData[j]);
						this.$axios.post('events/delete',{
							eventid:this.tableData[j].eventid,
							club:this.tableData[j].club,
							eventname:this.tableData[j].eventname,
							place:this.tableData[j].place,
							content:this.tableData[j].content,
							starttime:this.tableData[j].starttime,
							state:this.tableData[j].state
						}).then(response=>{
							
						}).catch(function(error){
							
						})
					}
				}
				
			} 
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].eventname + ' ';
            }
			this.getData()
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
		handleLook(index,row){
			var e = row;
			
			this.lookVisible = true;
			var url = e.eventid+'/state';
			this.$axios.get(url).then(response=>{
				
				this.memberData = response.data;
			}).catch(function(error){
				
			})
		},
/* 		handleAdd(){
		    this.addVisible = true;
		},
		saveAdd(){
		}, */
		saveState(index,row){
			this.idx = index;
			this.form = row;
			this.$axios.post('/events',{
				eventid:this.form.eventid,
				club:this.form.club,
				eventname:this.form.eventname,
				content:this.form.content,
				place:this.form.place,
				starttime:this.form.starttime,
				state:this.form.state,
				eventlogo:this.form.eventlogo,
				endtime:this.form.endtime
			})
			.then(reponsse=>{
			})
			.catch(function(error){
			})
		},
        // 编辑操作
/*        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
			var date=new Date(this.form.date1+' '+this.form.date2);
			date = date.getTime();
			var list = new Array();
			list = this.tableData;
            this.editVisible = false;
			this.$axios.post('/events',{
				eventid:this.form.eventid,
				club:this.form.club,
				eventname:this.form.eventname,
				content:this.form.content,
				place:this.form.place,
				starttime:date,
				state:this.form.state
			})
			.catch(function(error){
			})
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
			this.getData();
            this.$set(this.tableData, this.idx, this.form);
        }, */
        // 分页导航
        handlePageChange(val) {
			this.$set(this.querydialog,'userpageIndex',val)
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
		//上传图片
	  handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
