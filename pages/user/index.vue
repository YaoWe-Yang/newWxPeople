<template>
	<view class="content">
		<view class="dy">
			<view class="gz">
				<view v-if="!sysInfo.cs || !userInfo.wemp_openid">
				<!-- <view > -->
						<u-button type="warning" shape="circle" size="mini" :ripple="true" @click="$follow()">关注公众号</u-button>
						<view class="text">
							<text v-if="!sysInfo.cs">系统升级中，关注获取最新动态</text>
							<text v-else>关注订阅，通知消息不遗漏</text>
						</view>
				</view>
			</view>
		</view>
		<view :class="[!sysInfo.cs?'body90':[userInfo.wemp_openid?'body40':'body90']]">
			
		
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-20 u-p-t-20">
			<view class="u-m-r-20 u-m-t-15">
				<u-avatar :src="userInfo.avatar" size="100"></u-avatar>
			</view>
			<view class="u-flex-1" v-if="userInfo.nickname && userInfo.avatar">
				<view class="u-font-18 u-p-b-20">{{userInfo.nickname?userInfo.nickname:'未登录'}}</view>
				<view class="u-font-14 u-tips-color">ID：{{userInfo.uid}}</view>

				<view class="right">
					<u-button type="success" size="medium" shape="square" :ripple="true" open-type="getPhoneNumber"
						@getphonenumber="getPhoneNumber" v-if="!userInfo.phone&&userInfo.phone == null">绑定手机号</u-button>
					<u-button type="primary" size="mini" shape="square" :ripple="true" :plain="true" v-else>
						已绑定：{{userInfo.phone | formatPhone}}</u-button>
				</view>
			</view>
			<view class="u-flex-1" v-else>
				<u-button type="success" size="medium" @click="login">登 录</u-button>
			</view>


			<view v-if="sysInfo.cs == '0'">
				<view class="u-m-l-10 u-p-10" style="float: left;">
					<u-icon name="scan" color="#969799" size="28"></u-icon>
				</view>
				<view class="u-m-l-10 u-p-10" style="float: right;">
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>

		</view>

		<view v-if="sysInfo.cs == '0'">
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="rmb-circle" title="支付"></u-cell-item>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="star" title="收藏"></u-cell-item>
					<u-cell-item icon="photo" title="相册"></u-cell-item>
					<u-cell-item icon="coupon" title="卡券"></u-cell-item>
					<u-cell-item icon="heart" title="关注"></u-cell-item>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="setting" title="设置"></u-cell-item>
				</u-cell-group>
			</view>
		</view>


		<view class="u-m-t-20" v-if="sysInfo.cs == '1' && userInfo.avatar" @click="navCsm">
			<u-cell-group>
				<u-cell-item icon="error" title="传送门"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
				<ad-custom unit-id="adunit-9a6b25a555f8b4be" v-if="sysInfo.adswitch"></ad-custom>
		</view>

		<view class="u-m-t-20" v-if="sysInfo.cs == '1' && userInfo.avatar" @click="navLoginOut">
			<u-cell-group>
				<u-cell-item icon="zhuanfa" title="安全退出"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="t20">
			<u-divider bg-color="">Version：{{sysInfo.version?sysInfo.version:'升级中'}}</u-divider>
		</view>
		
		</view>

		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	import {
		Token
	} from '@/store/token.js';
	export default {
		data() {
			return {
				tabbar: this.$store.state.tabbar,
				show: true,
				userInfo: this.$store.state.user,
				sysInfo: this.$store.state.config,
			}
		},
		computed: {
				user() {
					return this.$store.state.user;
				},
				config() {
					return this.$store.state.config;
				}
		},
		created() {
			this._userInfo();
			this._sysInfo();
		},
		onShow() {
			this._userInfo();
			this._sysInfo();
		},
		onLoad() {},
		methods: {
			adError(e) {
				console.log(e);
			},
			login() {
					uni.showModal({
						title: '登录提示',
						content: '跳转至登录页面',
						confirmText: '登陆',
						confirmColor: '#19be6b',
						showCancel: true,
						cancelText: '暂不登录',
						contentAlign: 'left',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: 'login'
								})
							}
					
						}
					})
			},
			navCsm() {
				uni.reLaunch({
					url: '/pages/rm/quncard/Index',
					animationType: 'zoom-fade-out',
					animationDuration: 300
				});
			},
			// 获取用户信息
			_userInfo() {
				const self = this
				var base = new Base();
				var params = {
					url: 'userInfo',
					sCallBack: function(res) {
						self.userInfo = res;
					}
				}
				base.request(params);
			},

			_sysInfo() {
				const self = this
				var base = new Base();
				var params = {
					url: 'getSysInfo',
					sCallBack: function(res) {
						self.sysInfo = res;
					}
				}
				base.request(params);
			},

			getPhoneNumber(e) {
				this.encryptedData = e.detail.encryptedData
				this.iv = e.detail.iv
				this.updateUserPhone()
			},

			updateUserPhone() { //向后台更新信息
				const self = this
				var base = new Base();
				var params = {
					url: 'saveUserPhone',
					type: 'post',
					data: {
						encryptedData: self.encryptedData,
						iv: self.iv
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							self.userInfo = res.user;
							self.$toast(res.msg);
						} else {
							self.$toast(res.msg);
						}
					}
				}
				base.request(params);
			},
			
			// 退出
			navLoginOut() {
				uni.clearStorageSync();
				uni.redirectTo({
					url: '/pages/user/login'
				});
			}

		},

		
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}
	
	.dy {
		position: fixed;
		z-index: 3;
		left: 0;
		right: 0;
		top: -20rpx;
	}
	
	.gz {
		padding: 20rpx;
		background-color: #2979ff;
		color: #fff;
		border-radius: 0 0 20% 20%;
	
		.text {
			float: right;
			padding-top: 12rpx;
		}
	}
	.body40{
		padding: 40rpx 0;
	}
	.body90 {
		padding: 90rpx 0;
	}
	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.right {
		position: absolute;
		right: 40rpx;
		margin-top: -80rpx;
	}
</style>
