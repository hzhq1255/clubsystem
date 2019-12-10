<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:101px;">
                    <div class="user-info">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:680px;">
					  <div class="chat-box">
					    <header >聊天室人数：{{count}}</header>
					    <div class="msg-box" ref="msg-box">
					      <div
					        v-for="(i,index) in list"
					        :key="index"
					        class="msg"
					        :style="i.userId == userId?'flex-direction:row-reverse':''"
					      >
					        <div class="user-head">
					          <div
					            class="head"
					            :style="` background: hsl(${getUserHead(i.userId,'bck')}, 88%, 62%); clip-path:polygon(${getUserHead(i.userId,'polygon')}% 0,100% 100%,0% 100%); transform: rotate(${getUserHead(i.userId,'rotate')}deg)`"
					          ></div>
					        </div>
					        <div class="user-msg">
					          <span class="user-msg-span"
					            :style="i.userId == userId?' float: right;':''"
					            :class="i.userId == userId?'right':'left'"
					          >{{i.content}}</span>
					        </div>
					      </div>
					    </div>
					    <div class="input-box">
					      <input type="text" ref="sendMsg" v-model="contentText" @keyup.enter="sendText()" />
					      <div class="btn" :class="{['btn-active']:contentText}" @click="sendText()">发送</div>
					    </div>
					  </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="10" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">34</div>
                                    <div>在线人数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-sort grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">13</div>
                                    <div>社团总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">2</div>
                                    <div>动态数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-col :span="24"  shadow="hover" >
					<el-card>
					<div class="radio" style="padding-top: 5px;padding-bottom: 5px;">
					  <el-radio-group v-model="reverse">
					    <el-radio :label="true">倒序</el-radio>
					    <el-radio :label="false">正序</el-radio>
					  </el-radio-group>
					  <el-input  calss="search" v-model="newsname" placeholder="输入新闻名称回车搜索" style="width: 40%;" @keyup.enter.native="handleSearch()"></el-input>
					</div>
					<div class="news-info" style="height:600px;overflow-y: scroll;">
					<el-row  class="mgb20">
						  <el-timeline :reverse="reverse">
						    <el-timeline-item  v-for="(item,index) in news" :key="item.newsid" :timestamp="item.time | date"  placement="top" >
						      <el-card @click.native="handleComment(item.newsname)">
						        <h3>{{item.newsname}}</h3>
								<p v-if="item.club !== null">{{item.club.clubname}}</p>
								<p v-if="item.club === null">管理员</p>
						      </el-card>
						    </el-timeline-item>
						  </el-timeline>
					</el-row>
					</div>
					</el-card>
                </el-col>
            </el-col>
        </el-row>
<!--        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row> -->
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import dayjs from "dayjs";
export default {
    name: 'dashboard',
	filters: {
	    date(val) {
	      // 过滤器过滤时间格式
	      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
	    }
	  },
    data() {
        return {
			reverse:true,
            name: localStorage.getItem('username'),
			type: localStorage.getItem('type'),
            news: {},
			newsname:'',
	      ws: null,
	      count: 0,
	      userId: null, //当前用户ID
	      list: [], //聊天记录的数组
	      contentText: "" //input输入的值		
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.type === '管理员' ? '管理员' : '用户';
        }
    },
     created() {
		 this.getData();
		 this.getUserID();
     },
	  mounted() {
	    this.initWebSocket();
	  }, 
    methods: {
		getData(){
			let url = '/news';
			this.$axios.get(url).then(response=>{
				if(response.status == 200){
					this.news = response.data;
				}
			})
			console.log(this);
			console.log(this.news);
			console.log("lalla");
		},
		handleComment(row){
			
		},
		handleSearch(){
			let url =  '/newsname/?newsname='+this.newsname;
			this.$axios.get(url)
			.then(response=>{
				this.news = response.data;
			})
		},
		    getUserID() {
			  let time = new Date().getTime();
			  this.userId = time;

		    },
		    getUserHead(id, type) {
		      let ID = String(id);
		      if (type == "bck") {
		        return Number(ID.substring(ID.length - 3));
		      }
		      if (type == "polygon") {
		        return Number(ID.substring(ID.length - 2));
		      }
		      if (type == "rotate") {
		        return Number(ID.substring(ID.length - 3));
		      }
		    },
		    scrollBottm() {
		      let el = this.$refs["msg-box"];
		      el.scrollTop = el.scrollHeight;
		    },
		    sendText() {
		      let _this = this;
		      _this.$refs["sendMsg"].focus();
		      if (!_this.contentText) {
		        return;
		      }
		      let params = {
		        userId: _this.userId,
		        msg: _this.contentText
		      };
		      _this.ws.send(JSON.stringify(params)); //调用WebSocket send()发送信息的方法
		      _this.contentText = "";
		      setTimeout(() => {
		        _this.scrollBottm();
		      }, 500);
		    },
		    //进入页面创建websocket连接
		    initWebSocket() {
		      let _this = this;
		      //判断页面有没有存在websocket连接
		      if (window.WebSocket) {
		        // 10.64.67.116 是本地IP地址 此处的端口号 要与后端配置的一致
		        let ws = new WebSocket("ws://10.64.67.116:3000");
		        _this.ws = ws;
		        ws.onopen = function(e) {
		          console.log("服务器连接成功");
		        };
		        ws.onclose = function(e) {
		          console.log("服务器连接关闭");
		        };
		        ws.onerror = function() {
		          console.log("服务器连接出错");
		        };
		        ws.onmessage = function(e) {
		          //接收服务器返回的数据
		          let resData = JSON.parse(e.data);
		          if (resData.funName == "userCount") {
		            _this.count = resData.users;
		            _this.list = resData.chat;
		            console.log(resData.chat);
		          } else {
		            _this.list = [
		              ..._this.list,
		              { userId: resData.userId, content: resData.msg }
		            ];
		          }
		        };
		      }
		    }
    }
};
</script>


<style lang="scss" scoped>
.chat-box {
  margin: 0 auto;
  background: white;
  position: relative;
  height: 650px;
  width: 100%;
  max-width: 700px;
  header {
    position: relative;
    width: 100%;
    height: 40px;
    background: #409eff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: white;
    font-size: 1rem;
  }
  .msg-box::-webkit-scrollbar{
	  display: none;
  }
  .msg-box {
    position: relative;
    height: calc(100% - 6.5rem);
    width: 100%;
    margin-top: 0px;
    overflow-y: scroll;
    .msg {
      width: 95%;
      min-height: 2.5rem;
      margin: 1rem 0.5rem;
      position: relative;
      display: flex;
      justify-content: flex-start !important;
      .user-head {
        min-width: 2.5rem;
        width: 20%;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: #f1f1f1;
        display: flex;
        justify-content: center;
        align-items: center;
        .head {
          width: 1.2rem;
          height: 1.2rem;
        }
        // position: absolute;
      }
      .user-msg {
        width: 80%;
        // position: absolute;
        word-break: break-all;
        position: relative;
        z-index: 5;
        span {
          display: inline-block;
          padding: 0.5rem 0.7rem;
          border-radius: 0.5rem;
          margin-top: 0.2rem;
          font-size: 0.88rem;
        }
        .left {
          background: white;
          animation: toLeft 0.5s ease both 1;
        }
        .right {
          background: #53a8ff;
          color: white;
          animation: toright 0.5s ease both 1;
        }
        @keyframes toLeft {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
        @keyframes toright {
          0% {
            opacity: 0;
            transform: translateX(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
      }
    }
  }
  .input-box {
    padding: 0;
    position: relative;
    bottom: 0;
    width: 100%;
    height: 3.5rem;
    background: #fafafa;
    box-shadow: 0 0 5px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      height: 2.3rem;
      display: inline-block;
      width: 100%;
      padding: 0.5rem;
      border: none;
      border-radius: 0.2rem;
      font-size: 0.88rem;
    }
    .btn {
      height: 2.3rem;
      min-width: 4rem;
      background: #e0e0e0;
      padding: 0.5rem;
      font-size: 0.88rem;
      color: white;
      text-align: center;
      border-radius: 0.2rem;
      margin-left: 0.5rem;
      transition: 0.5s;
    }
    .btn-active {
      background: #409eff;
    }
  }
  }
	
	.search{
		margin: 5px;
	}
	.button{
		margin:4px;
	}	
.el-row {
    margin-bottom: 4px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

/* .todo-item-del {
    text-decoration: line-through;
    color: #999;
}
 */
.schart {
    width: 100%;
    height: 300px;
}
	.news-info{
		overflow-y: scroll;
		overflow: auto;
	}
	.news-info::-webkit-scrollbar {
	        width: 10px;    
	        height: 1px;
	    }
	.news-info::-webkit-scrollbar-thumb {
	        border-radius: 10px;
	         -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	        background: #00A854;
	    }
	.news-info::-webkit-scrollbar-track {
	        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	        border-radius: 10px;
	        background: #EDEDED;
	    }
		
</style>
