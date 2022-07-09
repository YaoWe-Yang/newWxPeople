<template>
	<view class="page-login">
		<view v-if="canIUse||canIGetUserProfile">
			<view class="login-top-img">
				<image src="../../static/login.jpg" mode="widthFix" class="login-topimg" v-if="config.cs == 0"></image>
				<image src="../../static/login.png" mode="widthFix" class="login-topimg" v-else></image>
			</view>
			<view class="login-box">
				<!-- #ifdef MP-WEIXIN -->
				<view v-if="config.cs == 0">
					<!--新版登录方式-->
					<u-button v-if="canIGetUserProfile" @click="bindGetUserInfo" lang='zh_CN' type="primary"
						shape="circle" ripple="true"> 微信用户快捷登陆 </u-button>
					<!--旧版登录方式-->
					<button v-else class='login-btn' open-type="getUserInfo" withCredentials="true" lang="zh_CN"
						@getuserinfo="bindGetUserInfo"> 微信用户快捷登陆 </button>
				</view>
				<view v-else>
					<view class="bspan">免费领加群次数</view>
					<!--新版登录方式-->
					<u-button v-if="canIGetUserProfile" @click="bindGetUserInfo" lang='zh_CN' type="warning"
						shape="circle" ripple="true"> 微信快捷登陆 </u-button>
					<!--旧版登录方式-->
					<button v-else class='login-btn' open-type="getUserInfo" withCredentials="true" lang="zh_CN"
						@getuserinfo="bindGetUserInfo"> 微信快捷登陆 </button>
				</view>

				<!-- #endif -->

				<!-- #ifdef H5 -->
				<u-button @click="bindGetUserInfo" lang='zh_CN' type="primary" shape="circle" ripple="true"> 微信H5快捷登陆
				</u-button>
				<!-- #endif -->

				<!-- #ifdef APP-PLUS -->
				<u-button @click="bindGetUserInfo" lang='zh_CN' type="primary" shape="circle" ripple="true">
					APP-PLUS快捷登陆 </u-button>
				<!-- #endif -->

				<view class="log-des">
					登录即同意<text>《用户隐私政策》</text>和<text>《用户服务协议》</text>
				</view>
			</view>
		</view>
		<view v-else class="text-center">
			请升级微信版本
		</view>
		
		<view class="adFooter">
			<ad v-if="sysInfo.ad_grid != 0" unit-id="adunit-b9872e21c5d0eadd" ad-type="banner" ad-theme="white" ad-intervals="30" @error="adError"></ad>
		</view>

		<u-divider bg-color="" class="bottom-version">Version：{{config.version?config.version:'升级中'}}</u-divider>
	</view>
</template>
<script>
	import {
		Config
	} from '@/store/config.js';
	import {
		Base
	} from '@/store/base.js';
	export default {
		data() {
			return {
				sessionKey: '',
				openId: '',
				nickName: null,
				avatarUrl: null,
				userInfo: this.$store.state.user,
				canIUse: uni.canIUse('button.open-type.getUserInfo'),
				canIGetUserProfile: false,
			};
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			config() {
				return this.$store.state.config;
			}
		},
		onLoad() {
			var _this = this;
			if (uni.getUserProfile) {
				_this.canIGetUserProfile = true;
			}
			//判断若是版本不支持新版则采用旧版登录方式
			//查看是否授权
			if (!_this.canIGetUserProfile) {
				uni.getSetting({
					success: function(res) {
						if (res.authSetting['scope.userInfo']) {
							uni.getUserInfo({
								provider: 'weixin',
								success: function(res) {
									console.log(res);
									_this.userInfo = res.userInfo;
									try {
										_this.login();
									} catch (e) {}
								},
								fail(res) {}
							});
						} else {
							// 用户没有授权
							console.log('用户还没有授权');
						}
					}
				});
			}
		},
		onShow() {
		},
		methods: {
			//登录授权
			bindGetUserInfo(e) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				var _this = this;
				if (_this.canIGetUserProfile) {
					//新版登录方式
					uni.getUserProfile({
						desc: '登录',
						lang: 'zh_CN',
						success: (res) => {
							console.log(res);
							_this.userInfo = res.userInfo;
							try {
								_this.login();
							} catch (e) {}
						},
						fail: (res) => {
							console.log(res)
						}
					});
				} else {
					//旧版登录方式
					if (e.detail.userInfo) {
						//用户按了允许授权按钮
						console.log('手动');
						console.log(e.detail.userInfo);
						_this.userInfo = e.detail.userInfo;
						try {
							_this.login();
						} catch (e) {}
					} else {
						console.log('用户拒绝了授权');
						//用户按了拒绝按钮
					}
				}
			},
			//登录
			login() {

				uni.showLoading({
					title: '登录中...',
					mask: true
				});
				let _this = this;
				// 获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(res) {
						console.log(res);
						if (res.code) {
							let code = res.code;
							//将用户登录code传递到后台置换用户SessionKey、OpenId等信息
							//...写用code置换SessionKey、OpenId的接口
							uni.request({
								url: Config.restUrl + 'token/user',
								method: 'POST',
								data: {
									code: res.code,
									share_id: uni.getStorageSync('share_id'),
									system: _this.$u.sys()
								},
								success: function(res) {
									console.log(res.data)
									uni.setStorageSync('token', res.data.token);
									_this.updateUserInfo();	


								}
							})
							//置换成功调用登录方法_this.updateUserInfo();
						} else {
							uni.showToast({
								title: '登录失败！',
								duration: 2000
							});
							console.log('登录失败！' + res.errMsg)
						}
					},
				});
			},
			//向后台更新信息
			updateUserInfo() {
				let _this = this;
				var params = {
					nickName: _this.userInfo.nickName,
					avatarUrl: _this.userInfo.avatarUrl,
					gender: _this.userInfo.gender,
					city: _this.userInfo.city,
					province: _this.userInfo.province,
					country: _this.userInfo.country,
					token: uni.getStorageSync('token'),
					system: this.$u.sys()
				}
				console.log('登录');
				console.log(params);
				//...后台登录的接口
				uni.request({
					url: Config.restUrl + 'saveuser',
					method: 'POST',
					data: {
						data: params,
					},
					success: function(res) {
						uni.showLoading({
							title: '登录成功',
							mask: true,
							success() {
								uni.reLaunch({
									url: '../rm/quncard/Index',
								});
							}
						});
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	button {
		position: relative;
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding-left: 14px;
		padding-right: 14px;
		box-sizing: border-box;
		font-size: 18px;
		text-align: center;
		text-decoration: none;
		line-height: 2.55555556;
		border-radius: 5px;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		cursor: pointer;
	}

	.login-top-img {
		
	}

	.login-topimg {
		width: 100%;
		border-radius: 0% 0% 50% 50% / 0% 0% 10% 10%;
	}

	.login-box {
		padding: 0 80upx;
		padding-top: 80upx;
	}



	.login-btn {
		overflow: visible;
		color: #ffffff;
		border-color: #2979ff;
		background-color: #2979ff;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		position: relative;
		border: 0;
		display: -webkit-inline-box;
		display: -webkit-inline-flex;
		display: inline-flex;
		overflow: visible;
		line-height: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0 40rpx;
		z-index: 1;
		box-sizing: border-box;
		-webkit-transition: all 0.15s;
		transition: all 0.15s;
	}

	.log-des {
		font-size: 26upx;
		padding: 20upx 0;
		margin: 0 auto;
		text-align: center;
	}

	.bspan {
		font-size: 22rpx;
		padding: 8rpx;
		background-color: red;
		position: absolute;
		z-index: 2;
		color: #fff;
		border-radius: 40rpx 40rpx 40rpx 0;
		right: 80rpx;
		margin-top: -26rpx;
	}

	text {
		color: #2979FF;
	}

	.bottom-version {
		position: absolute;
		bottom: 40upx;
		width: 100%;
	}
	
	.adFooter{
		position: absolute;
		bottom: 100rpx;
		width: 100%;
	}
</style>
