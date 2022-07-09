import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({

	state: {
		// token 有些接口可以为空
		token: null,
		// 系统信息
		config: '',
		// 用户信息
		user: '',

		/**
		 * 示例中为每个tabbar页面都写了一遍tabbar变量，您可以将tabbar数组写入到vuex中，这样可以全局引用
		 */
		tabbar: [{
				iconPath: "/static/index.png",
				selectedIconPath: "/static/index-selected.png",
				text: '营销',
				isDot: true,
				pagePath: "/pages/index/index"
			},
			{
				iconPath: "/static/min_button.png",
				selectedIconPath: "/static/min_button_select.png",
				text: '工具',
				midButton: true,
				pagePath: "/pages/tool/index"
			},
			{
				iconPath: "/static/center.png",
				selectedIconPath: "/static/center-selected.png",
				text: '我的',
				pagePath: "/pages/user/index"
			},
		],

		wxTabBar: [{
				iconPath: "/static/wxtabbar/index.png",
				selectedIconPath: "/static/wxtabbar/index.png",
				text: '微信群',
				isDot: true,
				pagePath: "/pages/rm/q"
			},
			{
				iconPath: "/static/wxtabbar/card.png",
				selectedIconPath: "/static/wxtabbar/card.png",
				text: '个人名片',
				pagePath: "/pages/rm/r"
			},
			{
				iconPath: "/static/wxtabbar/user.png",
				selectedIconPath: "/static/wxtabbar/user1.png",
				text: '我的',
				customIcon: true,
				pagePath: "/pages/rm/u"
			},

		],

	},
	mutations: {
		setUser(state, user) {
		  state.user = user;
		},
		setConfig(state, config) {
		  state.config = config;
		}
	},
	actions: {

	},



})
export default store
