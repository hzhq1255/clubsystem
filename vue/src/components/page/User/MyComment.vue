<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">评论信息</i>
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
                <el-input v-model="query.name" placeholder="评论内容" class="handle-input mr10" @keyup.enter.native="handleSearch()"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
<!--                <el-button type="primary" icon="el-icon-zanzan"@click="toggle_like">{{like_count}}</el-button>-->
            </div>
            <el-table
                    :data="mycomments"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--                <el-table-column prop="comid" label="ID" width="55" align="center"></el-table-column>-->


                <el-table-column prop="news.club.clubname"  label="发布社团" sortable >
<!--                    <template slot-scope="scope">-->
<!--						<span v-if="scope.row.club !== null">-->
<!--							{{scope.row.club.clubname}}-->
<!--						</span>-->
<!--                        <span v-if="scope.row.club === null">-->
<!--							社联-->
<!--						</span>-->
<!--                    </template>-->
                </el-table-column>

                <el-table-column prop="news.newsname" label="新闻名称"></el-table-column>
                <el-table-column prop="content" label="评论内容"></el-table-column>
                <el-table-column prop="likecount" label="热度"></el-table-column>
                <el-table-column label="操作" width="90" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button> -->
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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


    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {

                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData:{},
                multipleSelection: [],
                mycomments:[],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData(){
                var _this=this
                const id = localStorage.getItem('userid');
                console.log(id);
                let url = '/users'+'/'+id+'/comts';
                this.$axios.get(url).then(response=>{
                    _this.mycomments = response.data;
                    if(_this.mycomments.length == 0){
                        this.$confirm('您还没有发布评论哦！', '提示', {
                            type: 'warning'
                        }).catch(function(error){

                        })
                    }
                })
            },
            // 触发搜索按钮
            handleSearch() {
                var _this=this
                const id = localStorage.getItem('userid');
                console.log(id);
                const url = '/'+id+'/comtsname/?comtsname='+this.query.name
                this.$axios.get(url).then(response=>{
                    if(response.status === 200){
                        this.mycomments = response.data;
                        this.$set(this.mycomments,this.query, 'pageIndex', 1);
                    }
                })


            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                let id = row.comid;
                let url = '/comts/delete';
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        console.log(id);
                        this.$axios.post(url,{
                            comid:id
                        }).then(response=>{
                            if(response.status === 200){
                                this.$message.success('删除成功');
                                this.getData();
                            }
                        })
                    })
                    .catch(() => {});

            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {


                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        const length = this.multipleSelection.length;
                        let str = ' ';
                        console.log(length);
                        this.delList = this.delList.concat(this.multipleSelection);
                        console.log(this.delList);
                        for (let i = 0; i < length; i++) {
                            console.log('del',this.delList[i])
                            let id = this.delList[i].comid;
                            let url = '/comts/delete';
                            this.$axios.post(url,{
                                comid:id
                            }).then(response=>{

                            })
                            str += this.multipleSelection[i].newsname + ' ';
                        }
                        this.$message.error(`删除了${str}`);
                        this.multipleSelection = [];
                        this.delList = [];
                        console.log(id);

                    })
                    .catch(() => {});
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
