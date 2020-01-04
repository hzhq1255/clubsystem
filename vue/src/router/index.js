import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
	routes: [
        {
            path: '/',
            redirect: '/systemhome',
        }, 
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { 
				title: '自述文件' ,
				requireAuth: true
				},
            children: [
                {
                    path: '/systemhome',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/SystemHome.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '' }
                },
				{
				    path: '/myclub',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/User/MyClub.vue'),
				    meta: { title: '我的社团' }
				},
				{
				    path: '/myevent',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/User/MyEvent.vue'),
				    meta: { title: '我的活动' }
				},
				{
				    path: '/mycomment',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/User/MyComment.vue'),
				    meta: { title: '我的评论' }
				},
                {
                    path: '/usermanage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/AdminManager/UserManage.vue'),
                    meta: { title: '用户管理' }
                },
				{
				    path: '/clubmember',
					name:'clubmember',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/ClubManager/ClubMember.vue'),
				    meta: { title: '社团成员' }
				},
				{
				    path: '/clubfinace',
					name:'clubfinace',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/ClubManager/ClubFinace.vue'),
				    meta: { title: '社团财务' }
				},
				{
				    path: '/clubevent',
					name:'clubevent',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/ClubManager/ClubEvent.vue'),
				    meta: { title: '社团活动' }
				},
				{
				    path: '/myclubnews',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/User/MyClubNews.vue'),
				    meta: { title: '社团新闻' }
				},
				{
				    path: '/clubnews',
					name:'clubnews',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/ClubManager/ClubNews.vue'),
				    meta: { title: '发布新闻' }
				},
				{
				    path: '/joinclub',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/User/JoinClub.vue'),
				    meta: { title: '参加社团' }
				},
				{
				    path: '/joinevent',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/User/JoinEvent.vue'),
				    meta: { title: '参加活动' }
				},
				{
				    path: '/eventmanage',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/AdminManager/EventManage.vue'),
				    meta: { title: '活动管理' }
				},
				
				{
				    path: '/clubmanage',
					name:'admin-club',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/AdminManager/ClubManage.vue'),
				    meta: { title: '社团管理' }				
				},
				{
				    path: '/clublist',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/ClubManager/ClubList.vue'),
				    meta: { title: '社长管理' }	
				},
				{
				    path: '/clubcreate',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/User/ClubCreate.vue'),
				    meta: { title: '创建社团' }
				},
				{
				    path: '/newsinfo',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/AdminManager/NewsInfo.vue'),
				    meta: { title: '新闻信息' }
				},
				{
				    path: '/newscreate',
				    component: () => import(/* webpackChunkName: "donate" */ '../components/page/AdminManager/NewsCreate.vue'),
				    meta: { title: '创建新闻' }
				},
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: '消息通知' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
		{
		    path: '/login',
		    component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
		    meta: { title: '登录' }
		},
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
