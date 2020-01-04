<template>
    <div>
        <el-col :span="20" v-for="(item, index) in myclubnews" :key="item.newsid" :offset="2" style="padding: 10px;" >
            <el-card :body-style="{ padding: '5px' }" style="height: 400px;" >
                <el-container>
                    <el-aside>
                        <div align="center" >
                            <template >
                                <el-image
                                        :src="'data:image/png;base64,'+item.newsLogo"
                                        :preview-src-list="['data:image/png;base64,'+item.newsLogo]"
                                        style="width: 270px;height: 300px;margin-top: 10px"
                                ></el-image>
                            </template>
                        </div>
                        <div  align="center" style="padding-top: 0px;padding-bottom: 0px;">
                            <el-button icon="el-icon-lx-people" type="primary" class="button" @click="handleLook(item.newsid)">查看评论</el-button>
                        </div>
                    </el-aside>
                    <div class="clubnews-info">
                        <div class="clubnews-name" >{{item.newsname}}</div>
                        <div style="margin-bottom: 10px;" v-if="item.club !== null" >社团:{{item.club.clubname}}</div>
						<div style="margin-bottom: 10px;" v-if="item.club === null" >社联</div>
                        <div style="margin-bottom: 10px;" >
                            <span>时间:{{item.time | date}}</span>

                        </div>
                        <div style="margin-bottom: 10px;">内容:{{item.content}}</div>
                    </div>
                </el-container>
            </el-card>
        </el-col>
        <!-- 查看弹出框 -->
        <el-dialog title="新闻评论" :visible.sync="lookVisible" width="30%">
            <el-dialog
                    width="30%"
                    title="添加评论"
                    :visible.sync="innerVisible"
                    append-to-body>
                <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="content"
                        maxlength="30"
                        show-word-limit
                >
                </el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible=false">取消</el-button>
                    <el-button @click="handleAdd()">发表评论</el-button>
                </div>
            </el-dialog>

            <el-dialog
                    width="30%"
                    title="回复TA"
                    :visible.sync="Visible"
                    append-to-body>
                <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="content"
                        maxlength="30"
                        show-word-limit
                >
                </el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="Visible=false">取消</el-button>
                    <el-button @click="comment_reply()">确定</el-button>
                </div>
            </el-dialog>

            <el-card>
                <div class="news-info" style="height:600px;overflow-y: scroll;">
                    <el-row>
                        <el-timeline :reverse="reverse">
                            <el-timeline-item  v-for="(item,index) in comments" :key="index" :commentsuser="item.user.userid"  placement="top" >
                                <el-card>
                                    <p>{{item.user.username}}</p>
                                    <h3>{{item.content}}</h3>
                                    <el-button  icon="el-icon-zandianzan"@click="toggle_like(item)">{{item.likecount}}</el-button>
                                    <el-button  icon="el-icon-zanbianji" class="button" @click="get_reply(item)">回复</el-button>
                                </el-card>
                            </el-timeline-item>
                        </el-timeline>
                    </el-row>
                </div>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button @click="lookVisible = false">取 消</el-button>
                <el-button icon="el-icon-lx-add" type="primary" class="button" @click="innerVisible = true">评论</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import dayjs from "dayjs";
    export default {
        name: 'MyClubNewsInfo',
        filters: {
            date(val) {
                // 过滤器过滤时间格式
                return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        data () {
            return {
                myclubnews: [],
                lookVisible:false,
                Visible:false,
                innerVisible:false,
                tableData:{},
                state:true,
                comments:{},
                reverse:true,
                textarea:'',
                newsidd:'',
                content:'',
                like_init:0,
                liked:false,
                usernm:'',
                useridd:'',
				index:'',
				addvisble:false
            }
        },
        created(){
            this.getData();
        },
        methods:{
            getData(){

                let url = '/news';
				console.log(1);
                this.$axios.get(url).then(clubnews_response=>{
                    const _this = this;
                    this.myclubnews = clubnews_response.data;
                    console.log(_this);
                })
            },
			getComt(){
				const index = this.index;
				console.log(index);
				this.$axios.get('/news/'+index+'/comts').then(newscomments_response=>{
				    this.comments=newscomments_response.data;
				    this.newsidd=index;
				}).catch(function(error){
					
				})
			},
            handleLook(index){
				this.index = index;
				console.log(this.index);
				this.getComt();
                this.lookVisible=true;
            },
            handleAdd(){
                const _this = this;
                const id = localStorage.getItem('userid');
                _this.$axios.post('/comts',{
                    user:{
                        userid:id
                    },
                    news:{
                        newsid:this.newsidd
                    },
                    content:'说'+': '+this.content,
                    likecount:this.like_init,
                })
                this.$message.success('^3^ 评论成功');
				this.innerVisible = false;
				this.getComt();
            },
            toggle_like(item){
                const _this = this;
                const id = localStorage.getItem('userid');
                if(item.user.userid !=id) {
                    if (!this.liked) {
                        item.likecount++;
                        _this.$axios.post('/comts', {
                            user: {
                                userid: item.user.userid
                            },
                            news: {
                                newsid: item.news.newsid
                            },
                            content: item.content,
                            likecount: item.likecount,
                            comid: item.comid,
                        })
                        this.$message.success('^3^ 点赞成功');
                    } else {
                        item.likecount--;
                        _this.$axios.post('/comts', {
                            user: {
                                userid: item.user.userid
                            },
                            news: {
                                newsid: item.news.newsid
                            },
                            content: item.content,
                            likecount: item.likecount,
                            comid: item.comid,
                        })
                        this.$message.success('^3^ 取消成功');
                    }
                    this.liked = !this.liked;
                }else{
                    this.$message.error('TAT 亲，不能给自己点赞哦！');
                }

            },
            comment_reply(){
                const _this = this;
                const id = localStorage.getItem('userid');
                if(this.useridd!=id) {
                _this.$axios.post('/comts', {
                    user: {
                        userid: id
                    },
                    news: {
                        newsid: this.newsidd
                    },
                    content: '回复 '+this.usernm+': '+this.content,
                    likecount: this.like_init,

                }).then(response=>{
					if(response.status === 200){
						this.$message.success('^3^ 回复成功');
						this.getComt();
					    this.Visible = false;
					}
				})
              }
			  else{
			      this.$message.error('TAT 亲，不能回复自己哦！');
			  }
			}
            ,
            get_reply(item){
                this.usernm=item.user.username;
                this.useridd=item.user.userid;
                this.Visible = true;
            }
        },
        // handleLook(index){
        //     this.lookVisible = true;
        //     let newsid = index;
        //     let url = '/'+clubid+'/rolestate';
        //     this.$axios.get(url)
        //         .then(response=>{
        //             let list = new Array();
        //             let result = new Array()
        //             list = response.data;
        //             for(var i in list){
        //                 if(list[i].state == '已加入'){
        //                     result.push(list[i]);
        //                 }
        //             }
        //             this.tableData = result;
        //         }).catch(function(error){
        //
        //     })
        //     console.log(this.tableData);
        //     this.$set(this.tableData);
        // },

    }
</script>

<style scoped>
    .button{
        margin: 6px ;

    }
    .clubnews-info{
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
    .clubnews-info::-webkit-scrollbar {
        width: 10px;
        height: 1px;
    }
    .clubnews-info::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #82848A;
    }
    .clubnews-info::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #EDEDED;
    }
    .clubnews-name{
        font-weight: 700;
        font-family: "微软雅黑";
        font-size: 40px;
        margin-bottom: 10px ;
        margin-top: 10px ;
    }
</style>
