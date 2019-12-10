<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">用户管理</i> 
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div> 
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>				
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">添加</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--                <el-table-column prop="userid" label="ID" width="55" align="center"></el-table-column> -->
                <el-table-column label="头像(查看大图)" align="center">
                     <template slot-scope="scope">
                         <el-image
                             class="table-td-thumb"
                             :src="'data:image/png;base64,'+scope.row.userLogo"
                             :preview-src-list="['data:image/png;base64,'+scope.row.userLogo]"
                         ></el-image>
                     </template>
                 </el-table-column>
				<el-table-column prop="username" label="用户名"></el-table-column>				
				<el-table-column prop="role" label="职位"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
				<el-table-column prop="state" label="申请状态"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="用户名">
				    <el-input v-model="form.username"></el-input>
				</el-form-item>
                <el-form-item label="权限">
					  <el-select v-model="form.type" placeholder="更改权限">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		<!-- 添加用户 -->
		<el-dialog title="添加用户" :visible.sync="addVisible" width="30%">
            <el-form ref="add" :model="add" label-width="70px">
				<el-form-item label="用户名">
				    <el-input v-model="add.username"></el-input>
				</el-form-item>
                <el-form-item label="权限">
					  <el-select v-model="add.type" placeholder="权限选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="add.phone"></el-input>
                </el-form-item>
				<el-form-item >
				    <span >密码默认为123456</span>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
		</el-dialog>
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
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
			this.$axios.get('/users').then(response=>{
				this.tableData = response.data
				this.pageTotal = this.tableData.length || 50
				console.log(this.tableData);
/* 				for(let i=0;i<this.tableData.length;i++){
					let files = e.target.files[0];
					if (files.size/(1024*1024) > 2) {
					this.open('上传的图片不可大于2M！')
					return false;
					}
					var reader = new FileReader();
					reader.onload = function (e) {
					var base64 = e.target.result;
					this.tableData.userlogo = base64
					console.log(base64)
					}
					if(files) {
					reader.readAsDataURL(files);
					}
				} */
				
			})
			.catch(function(error){
			})
        },
        // 触发搜索按钮
        handleSearch() {
			
			var table = this.tableData;
			var search = new Array();
			if(this.query.name != null && this.query.name !=""){
				for(var i in table){
					if(table[i].username == this.query.name){
						search.push(table[i]);
					}
				}
				this.tableData = search;
				this.$set(this.query, 'pageIndex', 1);
			}
			


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
                str += this.multipleSelection[i].username + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
		handleAdd(){
		    this.addVisible = true;
		},
		saveAdd(){
			var users = this.tableData;
			var list = new Array();
			for(var i in users){
				list.push(users[i].userid);
			}
			list.sort(function(num1,num2){
				return num1-num2;
			})
			var timestamp = Date.parse(new Date());
			var maxid= eval(list[list.length-1]);
			var current_time = (new Date()).toISOString();
			var userlist ={
				userid:maxid+1,
				username:this.add.username,
				password:"123456",
				type:this.add.type,
				phone:this.add.phone,
				regtime:current_time
			}
			if((userlist.username != "" &&userlist.username != null)
			&& (userlist.type != "" && userlist.type != null) 
			&& (userlist.phone != "" && userlist.phone != null)){
				this.tableData.push(userlist);
				this.addVisible = false;
				this.$message.success("添加用户成功");
				this.add.username="";
				this.add.type="";
				this.add.phone="";
				/* this.$set(this.tableData,this.idex); */
				this.getData()
			}
			else{
				this.$message.error('有未输入内容');
			}
			

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
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
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
