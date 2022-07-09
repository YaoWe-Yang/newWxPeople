import Vue from 'vue'
import App from './App'
//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store


import {
	Token
} from '@/store/token.js';

import {
	Base
} from '@/store/base.js';
var base = new Base();

// 引入公共组件
import pageIcon from '@/components/userMsg/pageIcon.vue';
Vue.component('pageIcon',pageIcon)

Vue.config.productionTip = false



// // http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
// import httpInterceptor from '@/common/http.interceptor.js'
// Vue.use(httpInterceptor, app)

// // http接口API集中管理引入部分
// import httpApi from '@/common/http.api.js'
// Vue.use(httpApi, app)

var params = {
	url: 'getSysInfo',
	sCallBack: function(res) {
		// console.log(res);
		store.commit('setConfig', res)
		if (res.cs == 1) {
			// console.log('验证token：' + uni.getStorageSync('token'));
			if (uni.getStorageSync('token') && uni.getStorageSync('token') !== undefined && uni.getStorageSync(
					'token') !== null) {

				var param = {
					url: 'userInfo',
					sCallBack: function(ress) {
						// console.log(ress);
						store.commit('setUser', ress)
					}
				}
				base.request(param);
			
			} else {
				// #ifdef H5
				uni.redirectTo({
					url: '/pages/rm/quncard/Index'
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/user/login'
				});
				// #endif
			}
		}
	}
}
base.request(params);






Vue.filter("formatPrice", (amount, fixed = 2) => {
	if (isNaN(amount)) {
		return "";
	}
	amount = amount / 100;
	return amount.toFixed(fixed);
});
Vue.filter("formatDiffDate", (time) => {
	let now = new Date().getTime();
	let diffValue = now - time * 1000;
	let result = '';

	let minute = 1000 * 60;
	let hour = minute * 60;
	let day = hour * 24;
	let month = day * 30;
	let year = month * 12;

	let _year = diffValue / year;
	let _month = diffValue / month;
	let _week = diffValue / (7 * day);
	let _day = diffValue / day;
	let _hour = diffValue / hour;
	let _min = diffValue / minute;

	if (_year >= 1) result = parseInt(_year) + "年前";
	else if (_month >= 1) result = parseInt(_month) + "个月前";
	else if (_week >= 1) result = parseInt(_week) + "周前";
	else if (_day >= 1) result = parseInt(_day) + "天前";
	else if (_hour >= 1) result = parseInt(_hour) + "个小时前";
	else if (_min >= 1) result = parseInt(_min) + "分钟前";
	else result = "刚刚";

	return result;
});

Vue.filter("formatDate", (time, fmt = "MM-dd hh:mm") => {
	if (time < 1) {
		return "";
	}
	let date = new Date(time * 1000);
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	}
	let o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + "";
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
			);
		}
	}

	return fmt;
});

Vue.filter("formatPhone", (phone) => {
	let result = phone.substring(0, 3) + '****' + phone.substring(7);
	return result;
});


// 公众号关注follow
Vue.prototype.$follow = () =>{
	uni.navigateTo({
		url: "/components/linkOthers/linkOthers?url=" + encodeURIComponent('http://mp.weixin.qq.com/s?__biz=Mzg4NTYwMTY4Nw==&mid=100000074&idx=1&sn=608e2636a7b50ca3910b39a162eae97e&chksm=4fa725b278d0aca4083d208786256cba3cea61222db4b4f8aacd9ef0bd59c7b4b2af5930d402#rd')+"&title=关注公众号"
	});
}

//toast
Vue.prototype.$toast = (msg) => {
	Vue.prototype.$u.toast(msg);
}

//go
Vue.prototype.$go = (path) => {
	console.log('页面跳转前判断');
	if(uni.getStorageSync('token') && uni.getStorageSync('token') !== undefined && uni.getStorageSync('token') !== null){
		console.log('条件成功跳转：' + path);
		uni.navigateTo({
			url: path
		})
	}else{
		console.log('条件失败跳转');
		uni.navigateTo({
			url: '/pages/user/login'
		})
	}
	
}

Vue.prototype.$imagePreview = (image, id) => {
	console.log(image);
	//预览图片
	if (id) {
		var id = id;
	} else {
		var id = 0;
	}
	uni.previewImage({
		urls: image,
		current: image[id]
	});
}

// 列表插入广告
Vue.prototype.$isAdDisplay = (index,num) => {
	let id = String(index + 1);
	let length = id.charAt(id.length - 1);
	if(length == 0){
		length = '10';
	}
	return (length == num)?true:false;
}


Vue.prototype.$getList = (path, list) => {
	list.loading = true;
	var param = {
		url: path,
		data: {
			page: list.page,
			type: list.query.type,
			order: list.query.order,
			date: list.query.date,
			day: list.query.day,
			words: list.query.words,
		},
		sCallBack: function(res) {
			if (res.code == 0) {
				list.finished = res.list.last_page == 0 || res.list.current_page == res.list.last_page;
				list.data = list.data.concat(res.list.data);
				list.total = res.list.total;
				// list.page++;
			}
		},
		eCallBack: function(res) {
			list.loading = false;
		}
	}
	base.request(param);
}

Vue.prototype.$get = (path, cb = function() {}, params = {}, ccb = function() {}) => {
	Vue.prototype.$u.get(path, {
		params: params
	}).then(res => {
		if (res.data.code != 1) {
			cb(res.data);
		}
		ccb(res.data);
	}).catch((res) => {
		console.error(res);
		Vue.prototype.$u.toast('系统繁忙，请稍后再试');
		ccb({});
	})
}


// 弃用
Vue.prototype.$request = (path, type = 'get', data = {}, cb = function() {}, ccb = function() {}, show_loading =
	true) => {
	// if (show_loading) {
	//   vm.$u.loading({ message: '请稍等...', overlay: true, forbidClick: true, duration: 0 });
	// }
	var params = {
		url: path,
		type: type,
		data: data,
		sCallBack: function(res) {
			if (res.code != 1) {
				if (res) {
					// Toast.clear();
				}
				cb(res);
			}
			ccb(res);
		},
		eCallBack: function(res) {
			// if (show_loading) {
			//   Toast.clear();
			// }
			console.error(res);
			// Toast('系统繁忙，请稍后再试');
			ccb({});
		}
	}
	base.request(params);
}



// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)


App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

const app = new Vue({
	...App
})
app.$mount()
