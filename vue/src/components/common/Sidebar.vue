<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            text-color="#000000"
            active-text-color="#20a0ff"
            unique-opened
            router
        ><!-- background-color="#324157" text-color="#bfcbd9" -->
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [],
			admin: [
			    {
			        icon: 'el-icon-lx-home',
			        index: 'systemhome',
			        title: '系统首页'
			    },
				{
				    icon: 'el-icon-lx-group',
				    index: 'usermanage',
				    title: '用户管理'
				},
				{
				    icon: 'el-icon-lx-sort',
				    index: 'clubmanage',
				    title: '社团管理',
				},
				{
				    icon: 'el-icon-lx-sort',
				    index: 'eventmanage',
				    title: '活动管理',
				},
				{
				    icon: 'el-icon-lx-news',
				    index: 'news',
				    title: '新闻管理',
					subs:[
						{
							index:'newsinfo',
							title:'新闻信息',
						},
						{
							index:'newscreate',
							title:'创建新闻',
						}
					]
				},
			    {
			        icon: 'el-icon-lx-copy',
			        index: 'tabs',
			        title: '消息'
			    }
			],
			club_admin: [
			    {
			        icon: 'el-icon-lx-home',
			        index: 'systemhome',
			        title: '系统首页'
			    },
				{
				    icon: 'el-icon-menu',
				    index: 'myinfo',
				    title: '我的信息',
					subs:[
						{
							index: 'myclub',
							title: '我的社团'
						},
						{
							index: 'myevent',
							title: '我的活动'
						},
						{
							index: 'mycomment',
							title: '我的评论'
						}
					]
				},
				{
				    icon: 'el-icon-menu',
				    index: 'myclubnews',
				    title: '社团新闻'
				},
				{
				    icon: 'el-icon-lx-sort',
				    index: 'clublist',
				    title: '社长管理'
				},
				{
				    icon: 'el-icon-menu',
				    index: 'joinclub',
				    title: '加入社团'
				},
				{
				    icon: 'el-icon-menu',
				    index: 'joinevent',
				    title: '加入活动'
				},
				{
				    icon: 'el-icon-lx-add',
				    index: 'clubcreate',
				    title: '创建社团'
				
				},
			    {
			        icon: 'el-icon-lx-copy',
			        index: 'tabs',
			        title: '消息'
			    }
			],
			user: [
			    {
			        icon: 'el-icon-lx-home',
			        index: 'systemhome',
			        title: '系统首页'
			    },
				{
				    icon: 'el-icon-menu',
				    index: 'myinfo',
				    title: '我的信息',
					subs:[
						{
							index: 'myclub',
							title: '我的社团'
						},
						{
							index: 'myevent',
							title: '我的活动'
						},
						{
							index: 'mycomment',
							title: '我的评论'
						}
					]
				},
				{
				    icon: 'el-icon-menu',
				    index: 'myclubnews',
				    title: '社团新闻'
				},
				{
				    icon: 'el-icon-menu',
				    index: 'joinclub',
				    title: '加入社团'
				},
				{
				    icon: 'el-icon-menu',
				    index: 'joinevent',
				    title: '加入活动'
				},
			    {
			        icon: 'el-icon-lx-add',
			        index: 'clubcreate',
			        title: '创建社团'
				
			    },
				{
				    icon: 'el-icon-lx-copy',
				    index: 'tabs',
				    title: '消息'
				}
				
			]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
	   
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);

        });
		 this.getData();
    },
	methods:{
		getData(){
			var role = false;
			const userid = localStorage.getItem('userid');
			const type = localStorage.getItem('type');
			console.log(this.admin);
			if(type == '管理员' ){
				this.items = this.admin;
			}
			else{
				var url = userid+'/myrolestate';
				this.$axios.get(url)
				.then(response=>{
					for(var i in response.data){
						if(response.data[i].role == '社长'){
							role = true;
						}
					}
					if(role){
						this.items = this.club_admin
					}
					else{
						this.items = this.user;
					}
				})
				
			}
		}
	}
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
