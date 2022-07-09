import {
	Config
} from '@/store/config.js';

//引入vuex
import store from '@/store';
class Token {
	constructor() {
		this.verifyUrl = Config.restUrl + 'token/verify';
		this.tokenUrl = Config.restUrl + 'token/user';
		this.saveUserUrl = Config.restUrl + 'saveuser';
	}

	verify() {
		var token = uni.getStorageSync('token');
		// console.log(token);
		if (!token) {
			this.getTokenFromServer();
		} else {
			this._veirfyFromServer(token);
		}
	}

	//携带令牌去服务器校验令牌
	_veirfyFromServer(token) {
		var that = this;

		uni.request({
			url: that.verifyUrl,
			method: 'POST',
			data: {
				token: token,
				system: uni.getStorageSync('system')
			},
			success: function(res) {
				var user = res.data.user;
				var config = res.data.config;
				if (user) {
					store.commit('setUser', user)
				}
				if (config) {
					store.commit('setConfig', config)
				}
				
				var valid = res.data.isValid;
				if (!valid) {
					that.getTokenFromServer();
				}

			}
		})
	}

	//从服务器获取token
	getTokenFromServer(callBack) {
		var that = this;
		uni.login({
			provider: 'weixin',
			success: function(res) {
				console.log(res);
				uni.request({
					url: that.tokenUrl,
					method: 'POST',
					data: {
						code: res.code,
						share_id: uni.getStorageSync('share_id'),
						system: uni.getStorageSync('system')
					},
					success: function(res) {
						uni.setStorageSync('token', res.data.token);
						callBack && callBack(res.data.token);

					}
				})

			}
		})
	}


	//保存用户信息到服务器
	_saveUser(userInfo) {
		var that = this;
		var token = wx.getStorageSync('token');
		// console.log(token);
		uni.request({
			url: that.saveUserUrl,
			method: 'POST',
			data: [{
				data: userInfo,
				token: token
			}],
			success: function(res) {
				//

			}
		})
	}

	_loadUser() {
		// console.log('onLoad')
		var that = this
		var app = getApp();
		//调用应用实例的方法获取全局数据
		app.getUserInfo(function(userInfo) {
			//保存用户信息到服务器
			// console.log(userInfo);
			//更新数据
			that._saveUser(userInfo);

			// this.setData({
			//   userInfo: userInfo
			// })
		})
	}

}

export {
	Token
};
