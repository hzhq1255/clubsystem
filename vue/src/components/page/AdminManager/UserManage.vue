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
                <el-input v-model="query.name" placeholder="输入用户名" class="handle-input mr10" @keyup.enter.native="handleSearch"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
				
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="userid" label="ID" width="55" align="center"></el-table-column>
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
				<el-table-column prop="type" label="权限"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="regtime" label="注册时间">
					<template slot-scope="scope">
						<span>{{scope.row.regtime | date}}</span>
					</template>
				</el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                      <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
							
                        >编辑</el-button>
						<el-button
						    type="text"
						    icon="el-icon-lx-refresh"
							style="color: #2178FC;"
						    @click="handleReset(scope.$index, scope.row)"
						>重置</el-button>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="用户名">
				    <el-input :disabled="true" v-model="form.username"></el-input>
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
            id: -1,
			imgList:[],
			imgFile:[],
			imgFileList:[]
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
			})
			.catch(function(error){
			})
        },
        // 触发搜索按钮
        handleSearch() {
				const url = '/username/?username='+this.query.name;
					
				this.$axios.get(url).then(response=>{
					if(response.status == 200){
						this.tableData = response.data;
						this.$set(this.tableData,this.query, 'pageIndex', 1);
					}
				})
        },
        //重置操作
        handleReset(index, row) {
           // 二次确认重置密码
            this.$confirm('确定要重置密码为123456吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					const url = '/user';
					const user = row;	
						
					this.$axios.post(url,{
						userid:user.userid,
						username:user.username,
						password:'123456',
						phone:user.phone,
						regtime:user.regtime,
						userLogo:user.userLogo,
						type:user.type
					}).then(response=>{
						if(response.status == 200){
							this.$message.success('重置密码成功');
							this.getData();
							
						}
					})
                })
                .catch(() => {});
        },
/*        // 多选操作
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
        // 编辑操作 */
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
			const url = '/users';
			const user = this.form;
			this.$axios.post(url,{
				userid:user.userid,
				username:user.username,
				password:user.password,
				phone:user.phone,
				regtime:user.regtime,
				userLogo:user.userLogo,
				type:user.type
			}).then(response=>{
				if(response.status === 200){
				this.$message.success(`修改第 ${this.idx + 1} 行成功`);
				}
			})
            
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
.content-title{
	    font-weight: 400;
	    line-height: 50px;
	    margin: 10px 0;
	    font-size: 22px;
	    color: #1f2f3d;
	}
	.pre-img{   
	    width: 100px;
	    height: 100px;
	    background: #f8f8f8;
	    border: 1px solid #eee;
	    border-radius: 5px;
	}
	.crop-demo{
	    display: flex;
	    align-items: flex-end;
	}
	.crop-demo-btn{
	    position: relative;
	    width: 100px;
	    height: 40px;
	    line-height: 40px;
	    padding: 0 20px;
	    margin-left: 30px;
	    background-color: #409eff;
	    color: #fff;
	    font-size: 14px;
	    border-radius: 4px;
	    box-sizing: border-box;
	}
	.crop-input{
	    position: absolute;
	    width: 100px;
	    height: 40px;
	    left: 0;
	    top: 0;
	    opacity: 0;
	    cursor: pointer;
	}
</style>
