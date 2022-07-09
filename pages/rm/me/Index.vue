<template>
	<view class="page">
		<view class="header">
			<view class="user">
				<view class="avatar">
					<image :src="user.avatar" mode="widthFix"></image>
				</view>
				<view class="info">
					<view class="top">
						<view class="attr">
							<i :class="{active:user.is_vip==1}" style="float:left">&#xe601;</i>
							<i :class="{active:user.is_agent==1}" style="float:left">&#xe62d;</i>
						</view>
						<view class="nickname">
							{{user.nickname}}
						</view>
					</view>
					<view class="bottom">
						UID:{{user.uid}}
					</view>
				</view>

				<view class="right">
					<u-button type="primary" size="medium" shape="square" :ripple="true" open-type="getPhoneNumber"
						@getphonenumber="getPhoneNumber" v-if="!user.phone&&user.phone == null">绑定手机号</u-button>
					<u-button type="success" size="mini" shape="square" :ripple="true" :plain="true" v-else>
						已绑定：{{user.phone | formatPhone}}</u-button>
				</view>
			</view>

			<view class="finance">
				<view class="item" @click="$go('/pages/rm/finance/Cashout')">
					<view class="value">{{user.wallet | formatPrice}}</view>
					<view class="label">我的佣金</view>
				</view>
				<view class="item" @click="$go('Gold')">
					<view class="value">{{user.gold}}</view>
					<view class="label">我的积分</view>
				</view>
				<view class="item" @click="$go('Friend?type=direct')">
					<view class="value">{{shareData.direct_friend_num?shareData.direct_friend_num:'0'}}</view>
					<view class="label">直邀好友</view>
				</view>
				<view class="item" @click="$go('Friend?type=indirect')">
					<view class="value">{{shareData.indirect_friend_num?shareData.indirect_friend_num:'0'}}</view>
					<view class="label">间邀好友</view>
				</view>
			</view>

			<view class="vip-wrap">
				<!-- <image class="icon"
					src="http://shiyinet-oss.oss-cn-shenzhen.aliyuncs.com/default/20200605/1591340118959351"
					mode="heightFix"></image> -->
				<u-image src="@/static/hy.png"
					mode="widthFix" width="64"></u-image>
				<view v-if="user.is_vip==1" class="info">
					<view class="state">已开通会员</view>
					<view v-if="user.vip_expires_time==9 || user.vip_expires_time==1" class="time">有效期至：永久
					</view>
					<view v-else class="time">有效期至：{{user.vip_expires_time|formatDate('yyyy-MM-dd')}}</view>
				</view>
				<view v-else class="info">
					<view class="state">未开通</view>
					<view class="time">开通会员免积分加群</view>
				</view>
				<u-button type="primary" shape="circle" size="medium" :ripple="true" :custom-style="btnStyle"
					@click="$refs.openVip.show()">{{user.is_vip==1?'续费会员':'开通会员'}}
				</u-button>
			</view>
		</view>


		<!-- 管理员 -->
		<view v-if="user.sysadmin == '1'">
			<view class="quick">

				<view class="sysItem" @click="$go('/admin/site/Index')">
					<u-icon name="moments" class="icon"></u-icon>
					<view>系统设置</view>
				</view>

				<view class="sysItem" @click="$go('/admin/jhm/Index')">
					<u-icon name="moments" class="icon"></u-icon>
					<view>激活码</view>
				</view>

				<view class="sysItem" @click="$go('/admin/user/Txlist')">
					<u-icon name="moments" class="icon"></u-icon>
					<view>提现处理</view>
					<view class="cosNum" v-if="cashoutNum">{{cashoutNum}}</view>
				</view>

				<view class="sysItem" @click="$go('/admin/user/Userlist')">
					<u-icon name="moments" class="icon"></u-icon>
					<view>用户列表</view>
				</view>

				<view class="sysItem" @click="$go('/admin/order/Index')">
					<u-icon name="moments" class="icon"></u-icon>
					<view>订单列表</view>
				</view>

				<view class="sysItem" @click="$go('/admin/qun/Index')">
					<u-icon name="moments" class="icon"></u-icon>
					<view>群列表</view>
				</view>

				<view class="sysItem" @click="$go('/admin/card/Index')">
					<u-icon name="moments" class="icon"></u-icon>
					<view>个人名片</view>
				</view>

				<view class="sysItem" @click="$go('/admin/ad/Mgr')">
					<u-icon name="moments" class="icon"></u-icon>
					<view>广告列表</view>
				</view>

			</view>

			<view class="dataView" @click="$go('/admin/data/Index')">
				<view class="data-wrap">
					<view class="info">
						<view class="state">「数据中心」</view>
					</view>
				</view>
			</view>

		</view>

		<view class="quick">
			<view class="item" @click="$go('Gold')">
				<i style="background:rgb(25, 137, 250)">&#xe7bd;</i>签到领积分
			</view>
			<view class="item" @click="$refs.goldRecharge.show()">
				<i style="background:rgb(79, 192, 141);font-size:12px;line-height:16px">&#xe7b5;</i>积分充值
			</view>
			<view class="item" @click="$go('Poster')">
				<i style="background:#ff976a;font-size:12px;line-height:16px">&#xe654;</i>邀请好友
			</view>
			<view class="item" @click="$go('/pages/rm/finance/Cashout')">
				<i style="background:#F56C6C;font-size:14px;line-height:14px">&#xe71a;</i>佣金提现
			</view>
			<!-- <view class="item">
				<i style="background:#F56C6C;font-size:12px;line-height:14px">&#xe7bc;</i>排行榜
			</view> -->
			<!-- <view class="item">
			</view> -->
		</view>

		<view class="gz" v-if="!user.wemp_openid">
			<view>
				<view class="text">
					<text>关注订阅，通知消息不遗漏</text>
				</view>

			</view>
			<view>
				<u-button type="warning" shape="circle" size="medium" :ripple="true" @click="$follow()">去关注</u-button>
			</view>
		</view>
		
		<view class="menu" v-if="config.adswitch">
			<ad-custom unit-id="adunit-ee658640adbfd4ea"></ad-custom>
		</view>

		<u-cell-group class="menu" :border="false">
			<u-cell-item title="广告代发" @click="$go('/pages/rm/ad/Mgr')"
				:value="count_data.ad_num>0?count_data.ad_num:''">
				<template #icon>
					<i class="leftIcon" style="color:#F56C6C">&#xe624;</i>
				</template>
			</u-cell-item>

			<u-cell-item title="我的微信群" @click="$go('/pages/rm/quncard/Mgr')">
				<template #icon>
					<i class="leftIcon" style="color:#1989fa">&#xe68f;</i>
				</template>
			</u-cell-item>

			<u-cell-item title="我的个人名片" @click="$go('/pages/rm/card/Mgr')">
				<template #icon>
					<i class="leftIcon" style="color:#4fc08d">&#xe660;</i>
				</template>
			</u-cell-item>
			<u-cell-item v-if="user.is_agent==0" is-link @click="$refs.openAgent.show()">
				<template #icon>
					<i class="leftIcon" style="color:#FF976A">&#xe611;</i>
				</template>
				<template #title>
					成为代理<text class="viptips">赠送永久VIP</text>
				</template>
			</u-cell-item>
			<u-cell-item title="代理后台" @click="$go('/pages/rm/agent/Index')">
				<template #icon>
					<i class="leftIcon" style="color:#FF976A">&#xe600;</i>
				</template>
			</u-cell-item>
			<u-cell-item v-if="false" title="帮助中心">
				<template #icon>
					<i class="leftIcon" style="color:#9266f9">&#xe6bc;</i>
				</template>
			</u-cell-item>
			<u-cell-item title="联系客服" is-link @click="showKf">
				<template #icon>
					<i class="leftIcon" style="color:rgb(81 95 109)">&#xe7ba;</i>
				</template>
			</u-cell-item>
			<!-- <u-cell-item title="关于我们">
				<template #icon>
					<i class="leftIcon" style="color:rgb(109 109 109)">&#xe651;</i>
				</template>
			</u-cell-item> -->

		</u-cell-group>
		<view class="footer">
			version:{{config.version}}
			<!-- <text style="color:#999;padding-left:8upx;" @click="recovery()">注销帐号</text> -->
		</view>

		<gold-recharge ref="goldRecharge" title="积分充值"></gold-recharge>
		<show-qrcode ref="kfQrcode" title="扫码联系客服" />
		<open-agent ref="openAgent" title="开通代理" />
		<OpenVip ref="openVip" title="开通会员">
			<template #tips>
				<a href="JavaScript:;" @click="closeVipOpenAgent()"
					style="float: left;color: #576b93;text-decoration: none;">开通代理</a>可享受永久VIP权限
			</template>
		</OpenVip>

		<!-- 消息 -->
		<!-- <pageIcon></pageIcon> -->


		<view class="container">
			<tabBar :currentPage="3"></tabBar>
		</view>
	</view>
</template>

<script>
	import tabBar from '@/pages/rm/tabBar/tabBar.vue';
	import GoldRecharge from '@/pages/rm/components/GoldRecharge.vue';
	import ShowQrcode from "@/pages/rm/components/ShowQrcode.vue";
	import OpenAgent from '@/pages/rm/components/OpenAgent.vue';
	import OpenVip from '@/pages/rm/components/OpenVip.vue';
	import {
		Base
	} from '@/store/base.js';
	import {
		Token
	} from '@/store/token.js';
	export default {
		components: {
			tabBar,
			GoldRecharge,
			ShowQrcode,
			OpenAgent,
			OpenVip,
		},
		data() {
			return {
				wxTabBar: this.$store.state.wxTabBar,
				shareData: '',
				encryptedData: '',
				iv: '',
				cashoutNum: 0,
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
		methods: {
			getCashoutNum() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'sys/getCashoutNum',
					type: 'post',
					sCallBack: function(res) {
						// console.log(res.cashoutNum)
						self.cashoutNum = res.cashoutNum;
					}
				}
				base.request(params);
			},
			getShareData() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'getShareData',
					sCallBack: function(res) {
						self.shareData = res;
					}
				}
				base.request(params);
			},
			closeVipOpenAgent() {
				this.$refs.openVip.hide();
				this.$refs.openAgent.show();
			},

			showKf() {
				console.log(this.$store.state.user)
				var qrcode = this.$store.state.config.kf_qrcode;
				if (this.$store.state.user.directUser && this.$store.state.user.directUser.kf_qrcode != null) {
					qrcode = this.$store.state.user.directUser.kf_qrcode;
				}
				console.log(qrcode)
				this.$refs.kfQrcode.show(qrcode);
			},
			// 获取用户信息
			_userInfo() {
				const self = this
				var base = new Base();
				var params = {
					url: 'userInfo',
					sCallBack: function(res) {
						self.user = res;
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
							self.$toast(res.msg);
						} else {
							self.$toast(res.msg);
						}
					}
				}
				base.request(params);
			}

		},
		onShow() {
			this.getCashoutNum();
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.config.title
			});
			this.getShareData();
				this.getCashoutNum();
		},
		// 这里如果写成onShareAppMessage: res => { ... }形式的箭头函数，在内部会无法获得this
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.$store.state.config.title,
				path: '/pages/index/index?id=' + this.$store.state.user.uid,
				imageUrl: this.$store.state.config.share_img
			}
		},
		onShareTimeline(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.$store.state.config.title,
				path: '/pages/index/index?id=' + this.$store.state.user.uid,
				imageUrl: this.$store.state.config.share_img
			}
		},
		onPullDownRefresh() {
			console.log('refresh');
			var token = new Token();
			token.verify()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>


<style scoped lang="scss">
	@font-face {
		font-family: "iconfont";
		/* project id 2295299 */
		src: url("//at.alicdn.com/t/font_2295299_j89jox4v6p.eot");
		src: url("//at.alicdn.com/t/font_2295299_j89jox4v6p.eot?#iefix") format("embedded-opentype"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.woff2") format("woff2"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.woff") format("woff"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.ttf") format("truetype"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.svg#iconfont") format("svg");
	}

	i {
		font-family: "iconfont";
		font-size: 28upx;
		font-style: normal;
	}

	body {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Segoe UI, Arial, Roboto, PingFang SC, miui, Hiragino Sans GB, Microsoft Yahei, sans-serif;
	}

	body {
		font-weight: 400;
		font-size: 28upx;
		background: #fff;
		color: #303133;
	}

	* {
		box-sizing: border-box;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	}


	.u-size-medium {
		height: 64rpx !important;
		line-height: 64rpx !important;
		padding: 0 16rpx !important;
		font-size: 24rpx !important;
	}

	.page {
		display: flex;
		flex-direction: column;
		background: #f8f8f8;
		min-height: 100vh;
	}

	.page {
		padding-bottom: 200upx;
	}

	.header {
		display: flex;
		flex-direction: column;
		background-image: linear-gradient(176deg, #4fc08d, #4fc08d);
		color: #fff;
		height: 360upx;
		margin-bottom: 60upx;
		padding-top: 20upx;
		position: relative;

		.user {
			display: flex;
			padding: 32upx;

			.avatar {
				width: 72upx;
				height: 72upx;
				margin-right: 16upx;
				overflow: hidden;
				border-radius: 8upx;
				border: 2upx solid hsla(0, 0%, 100%, .5);

				image {
					width: 100%;
				}
			}

			.info {
				display: flex;
				flex-direction: column;

				.top {
					display: flex;
					height: 32upx;
					line-height: 32upx;

					.attr {
						margin-right: 12upx;
						padding-right: 12upx;
						position: relative;

						i {
							margin-right: 6upx;
							font-size: 24upx;
							opacity: .5;
						}

						i.active {
							color: #ff0;
							opacity: 1;
						}
					}

					.attr:after {
						content: "";
						opacity: .5;
						border-right: 2upx solid #fff;
						position: absolute;
						right: 0;
						top: 6upx;
						height: 20upx;
					}

					.nickname {
						font-size: 32upx;
					}
				}

				.bottom {
					opacity: .8;
					font-size: 24upx;
					height: 32upx;
					line-height: 40upx;
					margin-top: 6upx;
				}
			}

			.right {
				position: absolute;
				right: 40upx;
			}
		}

		.finance {
			display: flex;
			justify-content: space-between;
			padding: 32upx;

			.item {
				text-align: center;
				position: relative;
				flex: 1;

				.value {
					font-size: 36upx;
				}

				.label {
					font-size: 24upx;
					margin-top: 6upx;
					opacity: .8;
				}
			}

			.item:after {
				content: "";
				opacity: .3;
				border-right: 2upx solid #fff;
				position: absolute;
				right: 0;
				top: 16upx;
				bottom: 16upx;
			}

			.item:last-child::after {
				border-right: 0;
			}
		}

		.vip-wrap {
			position: absolute;
			left: 20upx;
			right: 20upx;
			bottom: -60upx;
			height: 120upx;
			display: flex;
			background: #fff;
			padding: 20upx 40upx;
			box-sizing: border-box;
			border-radius: 16upx;
			align-items: center;
			box-shadow: 0 4upx 2upx #f1f1f1;

			.icon {
				height: 90%;
			}

			.info {
				flex: 1;
				margin: 0 30upx;

				.state {
					color: #000;
					font-size: 32upx;
				}

				.time {
					font-size: 24upx;
					color: #999;
					margin-top: 8upx;
				}
			}

		}


	}

	.quick {
		display: flex;
		justify-content: space-around;
		background: #fff;
		border-radius: 16upx;
		margin: 0 20upx;
		margin-top: 32upx;
		flex-wrap: wrap;

		.item {
			height: 90upx;
			display: flex;
			align-items: center;
			width: 50%;
			padding: 0 40upx;

			i {
				background: #1989fa;
				color: #fff;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24upx;
				width: 44upx;
				height: 44upx;
				margin-right: 16upx;
			}
		}
	}

	.menu {
		margin: 0 20upx;
		margin-top: 32upx;
		border-radius: 12upx;
		overflow: hidden;

		.leftIcon {
			font-size: 48upx;
			margin-right: 30upx;
			color: #4fc08d;
		}
	}

	.menu::after {
		border: 0;
	}

	.u-cell_title {
		font-size: 32upx;
	}

	.viptips {
		font-size: 24upx;
		margin-left: 24upx;
		background: rgb(245, 108, 108);
		color: #fff;
		padding: 0 16upx;
		height: 44upx;
		line-height: 44upx;
		border-radius: 12upx;
		display: inline-block;
		position: relative;
	}

	.viptips::after {
		content: "";
		position: absolute;
		left: -12upx;
		top: 8upx;
		border-top: 12upx solid transparent;
		border-right: 16upx solid rgb(245, 108, 108);
		border-bottom: 12upx solid transparent;
	}

	.footer {
		text-align: center;
		color: #ccc;
		line-height: 30px;
		font-size: 12px;
	}

	.sysItem {
		width: 25%;
		text-align: center;
		padding: 20upx;

		.icon {
			font-size: 48rpx;
			padding-bottom: 6upx;
			color: #4fc08d;
		}

		.cosNum {
			position: absolute;
			margin-top: -96upx;
			margin-left: 92upx;
			background-color: red;
			padding: 8upx;
			border-radius: 100upx;
			font-size: 22upx;
			line-height: 12upx;
			color: #fff;
		}
	}

	.dataView {
		display: flex;
		flex-direction: column;
		// background-image: linear-gradient(176deg, #4fc08d, #4fc08d);
		color: #fff;
		margin-bottom: 60upx;
		position: relative;
		display: flex;
		justify-content: space-between;
		padding: 40upx;

		.data-wrap {
			position: absolute;
			left: 20upx;
			right: 20upx;
			bottom: -60upx;
			height: 120upx;
			display: flex;
			background: linear-gradient(165deg, #2979ff, #ff0676);
			padding: 20upx 40upx;
			box-sizing: border-box;
			border-radius: 16upx;
			align-items: center;
			box-shadow: 0 4upx 2upx #f1f1f1;
			text-align: center;

			.info {
				flex: 1;
				margin: 0 30upx;

				.state {
					color: #FFFFFF;
					font-size: 32upx;
				}

			}

		}
	}

	.gz {
		display: flex;
		justify-content: space-around;
		background: #ffbc00;
		border-radius: 16rpx;
		margin: 0 20rpx;
		margin-top: 32rpx;
		flex-wrap: wrap;
		height: 100rpx;
		line-height: 100rpx;
		color: #fff;
		box-shadow: 0 10rpx 0 #FF9900;
	}
	
	
</style>
