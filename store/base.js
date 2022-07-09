import {
	Token
} from '@/store/token.js';
import {
	Config
} from '@/store/config.js';

//引入vuex
import store from '@/store';

class Base {
	constructor() {
		this.baseRequestUrl = Config.restUrl;
	}


	//当noRefetch为true时，不做未授权重试机制
	request(params = {}, noRefetch, isLoading = true) {
		if (isLoading) {
			uni.showLoading({
				title: '加载中'
			});
		}
		
		// 验证游客
		if (store.state.user) {
			this._isUserTourist(store.state.user)
		}

		var that = this;
		var url = this.baseRequestUrl + params.url;

		if (!params.type) {
			params.type = 'GET';
		}

		uni.request({
			header: {
				'content-type': 'application/json',
				'token': wx.getStorageSync('token')
			},
			url: url,
			method: params.type,
			data: params.data,
			success: function(res) {

				uni.hideLoading();
				// console.log(res);
				// if(params.sCallBack){
				//   params.sCallBack(res);
				// }
				var user = res.data.user;
				var config = res.data.config;

				if (res.data.user) {
					store.commit('setUser', res.data.user)
				}
				if (res.data.config) {
					store.commit('setConfig', res.data.config)
					if (res.data.config.cs == 0) {
						uni.showToast({
							title: res.data.msg,
							icon: 'error',
							duration: 2000,
						})
					}
				}

				var code = res.statusCode.toString();
				var startChar = code.charAt(0);

				if (startChar == '2') {
					params.sCallBack && params.sCallBack(res.data);
				} else {
					if (code == '401') {
						if (!noRefetch) {
							that._refetch(params);
						}
					}
					that._processError(res);
					params.eCallBack && params.eCallBack(res.data);
				}
			},
			fail: function(err) {
				console.log(err);
			}
		})

	}


	_processError(err) {
		console.log(err);
	}


	_refetch(params) {
		var token = new Token();
		token.getTokenFromServer((token) => {
			this.request(params, true);
		});
	}

	// 验证游客
	_isUserTourist(user) {
		console.log('开始验证游客身份')
		
		if (user) {

			console.log('已传入身份信息')
			if (user.nickname == null && user.avatar == null && user.sex == null) {
				console.log('【游客】')
				uni.redirectTo({
					url: '/pages/user/login'
				});
			} else {
				console.log('【真实用户】')
			}
			
		} else {
			console.log('未传入身份信息')
		}

	}


	// 图片放大
	_previewImage(image, id) {
		console.log(id);
		// let imgArr = [];
		// imgArr.push(image); 
		let imgArr = image.split(',');

		console.log(imgArr);
		//预览图片
		if (id) {
			var id = id;
		} else {
			var id = 0;
		}
		uni.previewImage({
			urls: imgArr,
			current: imgArr[id]
		});

	}






}
export {
	Base
};
