
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">社团管理</i> 
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div> 
        <div class="container">
            <div class="handle-box">
<!--                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>	 -->			
                <el-input v-model="query.name" placeholder="社团名称" class="handle-input mr10"  @keyup.enter.native="handleSearch()"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
<!--              <el-button type="primary" icon="el-icon-check" @click="handleAdd()">添加</el-button> -->
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
                <el-table-column prop="clubid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="logo" label="LOGO" align="center">
                     <template slot-scope="scope">
                         <el-image
                             class="table-td-thumb"
                             :src="'data:image/png;base64,'+scope.row.clubLogo"
                             :preview-src-list="['data:image/png;base64,'+scope.row.clubLogo]"
                         ></el-image>
                     </template>
                </el-table-column> 
				<el-table-column prop="clubname" label="社团名称"></el-table-column>
				<el-table-column prop="introduce" label="社团简介"></el-table-column>
                <el-table-column prop="founder" label="社长"></el-table-column>
                <el-table-column prop="createtime" label="创立时间" sortable>
					<template slot-scope="scope">
						<span>{{scope.row.createtime | date}}</span>
					</template>
				</el-table-column>
				 <el-table-column width="180px" prop="state" label="审核" align="center" sortable>
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
<!--                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column> -->
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
				<el-form-item label="社团名称" >
				    <el-input v-model="form.clubname" ></el-input>
				</el-form-item>
				<el-form-item label="社长名字">
				    <el-input v-model="form.founder" ></el-input>
				</el-form-item>
				<el-form-item label="社团简介">
				    <el-input type="textarea" rows="8" v-model="form.introduce"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog> -->
		<!-- 添加 -->
<!-- 		<el-dialog title="添加社团" :visible.sync="addVisible" width="30%">
          <el-form ref="add" :model="add" :rules="rules" label-width="70px">
				<el-form-item label="社团名称" >
				    <el-input v-model="add.clubname" ></el-input>
				</el-form-item>
				<el-form-item label="社长名字">
				    <el-input v-model="add.founder" ></el-input>
				</el-form-item>
				<el-form-item label="社团简介">
				    <el-input type="textarea" rows="8" v-model="add.introduce"></el-input>
				</el-form-item>
				<el-form-item label="社团logo">
				 <el-button type="primary" icon="el-icon-lx-add">上传图片</el-button> 
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
		</el-dialog> -->
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    name: 'userinfo',
	filters: {
	    date(val) {
	      // 过滤器过滤时间格式
	      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
	    }
	  },
    data() {
        return {
			rules:{
				clubname: [{ required: true, message: '请输入社团名称', trigger: 'blur' },],
				founder: [{ required: true, message: '请输入社长名称', trigger: 'blur' },],
				introduce: [{ required: true, message: '请输入社团名称', trigger: 'blur' },],
					 
			},
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
			options: [{
			          value: '用户',
			          label: '用户'
			        },
					{
			          value: '管理员',
			          label: '管理员'
			        }],
            tableData: {},
            multipleSelection: [],
            delList: [],
            editVisible: false,
			addVisible: false,
            pageTotal: 0,
            form: {},
			add:{},
            idx: -1,
            id: -1,
			value1:true,
			
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
			this.$axios.get('/clubs').then(response=>{
				this.tableData = response.data;
				this.pageTotal = this.tableData.length || 50;

			})
			.catch(function(error){
			})
        },
        // 触发搜索按钮
        handleSearch() {
			
			
			const clubname = this.query.name
			const url = '/clubname/?clubname='+clubname
			
			this.$axios.get(url).then(response=>{
				if(response.status === 200){
					this.tableData = response.data;
					this.$set(this.tableData,this.query, 'pageIndex', 1);
				}
			})


        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
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
						this.tableData.splice(i, 1);
					}
				}
			} 
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].clubname + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
		handleAdd(){
		    this.addVisible = true;
		},
		saveAdd(){
/* 			var data = this.tableData;
			var list = new Array();
			for(var i in data){
				list.push(data[i].clubid);
			}
			list.sort(function(num1,num2){
				return num1-num2;
			})
			var timestamp = Date.parse(new Date());
			var maxid= eval(list[list.length-1]);
			var current_time = (new Date()).toISOString();
			this.$axios.post('/clubs',{
				clubid:maxid+1,
				clubname:this.add.clubname,
				founder:this.add.founder,
				introduce:this.add.introduce,
				createtime:current_time,
				state:'未批准'
			}).then(response=>{
				this.$refs.add.vaildate(vaild=>{
					if(vaild){
						this.$message.success('添加成功');
					}
					else{
						this.$message.error('请完善内容');
						console.log('error submit!!');
						return false;
					}
				})
				
			}).catch(function(error){
				
			})
           this.addVisible = false;
		   this.getData(); */
		},
		saveState(index,row){
			this.idx = index;
			this.form = row;
			this.$axios.post('/clubs',{
				clubid:this.form.clubid,
				clubname:this.form.clubname,
				introduce:this.form.introduce,
				founder:this.form.founder,
				createtime:this.form.createtime,
				state:this.form.state,
				clubLogo:this.form.clubLogo
			})
			.catch(function(error){
			})
		},
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
			console.log(this.form);
			this.$axios.post('/clubs',{
				clubid:this.form.clubid,
				clubname:this.form.clubname,
				introduce:this.form.introduce,
				founder:this.form.founder,
				state:this.form.state,
				logo:this.form.logo
			})
			.catch(function(error){
			})
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
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
