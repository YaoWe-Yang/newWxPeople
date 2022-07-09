<template>
	<div class="page" v-if="user && config">
		<div class="header">
			<view class="goldView">
				<view class="goldData">
					{{user.gold}}
				</view>
				<view class="goldDes">
					积分明细 <i class="myfont">&#xe60f;</i>
				</view>
			</view>
			<view class="goldIcon" :style="'left:'+randomLeft(index)+'%;top:'+randomTop(index)+'rpx'"
				v-for="(item, index) in config.gold.charge" :key="index">
				<text class="goldNum">10</text>
				<view class="goldText">积分</view>
			</view>
			<!-- <div class="gold">
				<div class="value">{{user.gold}}</div>
				<div class="label">我的积分</div>
			</div>
			<div class="bottom">
				<div class="left">
					<div class="not-checkin">
						<div class="title">{{checkedin?'今天已签到':'今天还未签到'}}</div>
						<div class="desc">开通会员签到积分翻倍</div>
					</div>
				</div>
				<div class="btn checkedin" v-if="checkedin">已签到</div>
				<div class="btn" v-else @click="getGold('checkIn')">签到+{{today_gold}}积分</div>
			</div> -->
		</div>
		<view class="pageRow">
			<view class="tabsLine"></view>
			<view class="tabs">
				<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" bg-color="#ffffff00"
					:bold="false"></u-tabs>
			</view>

			<view class="tabsItem" v-if="current==0">
				<div class="bottom">
					<div class="left">
						<div class="not-checkin">
							<div class="title">{{checkedin?'今天已签到':'今天还未签到'}}</div>
							<div class="desc">开通会员签到积分翻倍</div>
						</div>
					</div>
					<div class="btn checkedin" v-if="checkedin">已签到</div>
					<div class="btn" v-else @click="getGold('checkIn')">签到+{{today_gold}}积分</div>
				</div>

				<view class="GoldFollow">
					<!-- <view class="GoldFollow" v-if="!user.wemp_openid || user.wemp_openid == null || user.wemp_openid == undefined"> -->
					<view class="FollowDes">
						<image src="/static/gold-follow.png" mode="widthFix"></image>
						<text></text>
						关注公众号可获得 {{config.gold.reward.wemp_follow}} 积分
					</view>
					<view class="FollowBot" @click="$follow()">立即关注</view>
				</view>

				<view class="GoldClockIn">
					<view class="GoldClockInItem">
						<view class="GoldClockInDay">1</view>
						<image src="/static/goldClock.png" mode="widthFix"></image>
						<view class="GoldClockInNum">+2</view>
					</view>
					<view class="GoldClockInItem">
						<view class="GoldClockInDay">2</view>
						<image src="/static/goldClock.png" mode="widthFix"></image>
						<view class="GoldClockInNum">+2</view>
					</view>
					<view class="GoldClockInItem">
						<view class="GoldClockInDay">3</view>
						<image src="/static/goldClock.png" mode="widthFix"></image>
						<view class="GoldClockInNum">+2</view>
					</view>
					<view class="GoldClockInItem">
						<view class="GoldClockInDay">4</view>
						<image src="/static/goldClockIn.png" mode="widthFix"></image>
						<!-- <view class="GoldClockInNum">+10</view> -->
					</view>
					<view class="GoldClockInItem">
						<view class="GoldClockInDay">5</view>
						<image src="/static/goldClockIn.png" mode="widthFix"></image>
						<!-- <view class="GoldClockInNum">+10</view> -->
					</view>
				</view>

				<view class="goldGame">
					<view class="goldGameItem">
						<image src="/static/gold-follow.png" mode="widthFix"></image>
						<view>去关注</view>
					</view>
					<view class="goldGameItem">
						<image src="/static/gold-clock.png" mode="widthFix"></image>
						<view>打卡</view>
					</view>
					<view class="goldGameItem" @click="$go('/components/uni-luck-draw/demo')">
						<image src="/static/gold-game1.png" mode="widthFix"></image>
						<view>大转盘</view>
					</view>
					<view class="goldGameItem" @click="$go('/components/uni-luck-draw/demo')">
						<image src="/static/gold-game3.png" mode="widthFix"></image>
						<view>抽奖</view>
					</view>
				</view>

			</view>

		</view>

		<div class="paybtn safe-area-inset-bottom" @click="$refs.goldRecharge.show()">充值积分</div>

		<gold-recharge ref="goldRecharge" title="积分充值"></gold-recharge>
		<u-modal v-model="show" :content="content"></u-modal>
	</div>
</template>

<script>
	var videoAd = null;
	import GoldRecharge from '@/pages/rm/components/GoldRecharge.vue';
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			GoldRecharge
		},
		data() {
			return {
				checkedin: false,
				today_gold: 0,
				show: false,
				content: '',
				day_clock_num: 0,
				goldType: '',
				list: [{
						name: '赚积分'
					},
					{
						name: '花积分'
					},
				],
				current: 0,
			};
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			config() {
				return this.$store.state.config;
			},
		},
		created() {
			this.getPageData();
		},
		onLoad() {
			// #ifdef MP
			this.adLoad()
			// #endif
		},
		methods: {
			change(index) {
				this.current = index;
			},
			randomLeft(i) {
				let left = (Math.floor(Math.random() * (80 - i + 1)) + i);
				console.log(i + '：' + left + ' - ' + ((left > 30 && left < 60) ? false : true));
				if (left > 30 && left < 60) {
					// console.log(false);
					left = this.randomLeft(i);
				}
				return left;
			},
			randomTop(i) {
				return Math.floor(Math.random() * ('28' + i - 10 + 1)) + 10;
			},
			getPageData() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'pageGold',
					sCallBack: function(res) {
						self.checkedin = res.checkedin;
						self.today_gold = res.today_gold;
						self.day_clock_num = res.day_clock_num;
					}
				}
				base.request(params);
			},

			// 签到
			checkIn() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'checkin',
					type: 'post',
					sCallBack: function(res) {
						if (res.code == 0) {
							self.checkedin = true;
							self.content = "签到成功，获得" + res.gold + "积分";
							self.show = true;
						} else {
							self.content = res.msg;
							self.show = true;
						}
					}
				}
				base.request(params);
			},

			// 打卡
			clockIn() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'clockIn',
					type: 'post',
					sCallBack: function(res) {
						if (res.code == 0) {
							self.day_clock_num = self.day_clock_num - 1;
							self.content = "打卡成功，获得" + res.gold + "积分";
							self.show = true;
						} else {
							self.content = res.msg;
							self.show = true;
						}
					}
				}
				base.request(params);
			},


			adLoad: function() {
				if (uni.createRewardedVideoAd) {

					videoAd = uni.createRewardedVideoAd({
						adUnitId: "adunit-c0baa9911cdbfba3" //你的广告key
					})

					videoAd.onError(err => {})
					videoAd.onClose((status) => {
						if (status && status.isEnded || status === undefined) {
							//这里写广告播放完成后的事件
							if (this.goldType == 'clockIn') {
								this.clockIn();
							}
							if (this.goldType == 'chenkIn') {
								this.checkIn();
							}
						} else {}
					})

				}
			},
			getGold: function(Type) {
				uni.showLoading();
				this.goldType = Type;
				if (videoAd) {
					uni.hideLoading()
					videoAd.show().catch(err => {
						// 失败重试
						// console.log("广告拉去失败")
						videoAd.load().then(() => videoAd.show())
					})
				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.page {
		padding-bottom: 200rpx;
	}

	.header {
		height: 400rpx;
		background-image: linear-gradient(180deg, #2f6dfd 0%, #0045a2 100%);
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 40rpx;
		position: fixed;
		width: 100%;

		.goldView {
			width: 300rpx;
			height: 300rpx;
			background: linear-gradient(180deg, #ffffff5e 0%, #ffffff 100%);
			border-radius: 500px;
			box-shadow: 0 0 36rpx 12rpx #ffffff94;
			display: flex;
			align-items: center;
			flex-direction: column;
			color: #003fd2;

			.goldData {
				padding-top: 80rpx;
				font-size: 80rpx;
				font-weight: bold;
			}

			.goldDes {
				font-size: 22rpx;
				height: 24rpx;
				padding-top: 10rpx;

				i {
					font-size: 15rpx;
					line-height: 24rpx;
					font-weight: 600;
					position: relative;
					left: 106rpx;
					top: -26rpx;
				}
			}
		}

		.goldIcon {
			text-align: center;
			color: #006ddeeb;
			width: 70rpx;
			height: 70rpx;
			position: absolute;
			// left: 120rpx;
			background-image: linear-gradient(180deg, #ffffff3b 0%, #ffffff00 100%);
			border-radius: 100rpx;
			box-shadow: -4rpx -12rpx 34rpx 10rpx #ffffffa6 inset;
			border: 1rpx #ffffff9e solid;
			-webkit-animation: bounce-down 2.5s linear infinite;
			animation: bounce-down 2.5s linear infinite;

			.goldNum {
				font-size: 30rpx;
				font-weight: 600;
			}

			.goldText {
				font-size: 18rpx;
			}
		}

	}

	.pageRow {
		position: absolute;
		width: 100%;
		margin-top: 380rpx;
		border-radius: 20rpx;
		background-color: #fff;

		.tabsLine {
			width: 100rpx;
			height: 8rpx;
			background-color: #a0a0a0;
			border-radius: 50rpx;
			margin: 12rpx auto;
		}

		.tabs {
			margin-top: -24rpx;
		}

		.tabsItem {
			width: 90%;
			margin: 0 auto;

			.bottom {
				display: flex;
				background: #f5f5f5;
				padding: 30rpx;
				border-radius: 16rpx;
				justify-content: space-between;
				margin: 20rpx auto;
				box-shadow: 2rpx 2rpx 2rpx #f1f1f1;

				.title {
					font-size: 20px;
				}

				.desc {
					font-size: 26rpx;
					color: #909399;
					margin-top: 8rpx;
				}

				.btn {
					background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
					box-shadow: 0px 0px 10rpx #f1f1f1;
					color: #fff;
					text-align: center;
					font-size: 28rpx;
					padding: 0 32rpx;
					height: 76rpx;
					line-height: 76rpx;
					border-radius: 76rpx;
				}

				.btn.checkedin {
					opacity: 0.5;
				}
			}

			.GoldFollow {
				display: flex;
				position: relative;
				height: 94rpx;
				margin: 20rpx auto;

				.FollowDes {
					background-color: #2979ff;
					width: 100%;
					padding: 30rpx;
					border-radius: 100rpx;
					color: #fff;
					position: absolute;

					image {
						position: absolute;
						margin-top: -10rpx;
						width: 48rpx;
					}

					text {
						padding-left: 50rpx;
					}
				}

				.FollowBot {
					background-color: #fff;
					position: absolute;
					padding: 20rpx;
					border: 10rpx #2979ff solid;
					border-radius: 100px;
					text-align: center;
					right: 0;
					color: #2979ff;
					font-weight: bold;
				}
			}

			.GoldClockIn {
				display: flex;
				border: 1rpx #f09819 solid;
				border-radius: 12rpx;
				background-color: #f098192e;
				padding: 12rpx;
				.GoldClockInItem {
					width: 14.285%;
					text-align: center;
					.GoldClockInDay{
						    font-size: 16rpx;
						    position: absolute;
						    padding-top: 15rpx;
						    padding-left: 43rpx;
						    z-index: 1;
						    color: #ff7600;
					}
					image {
						width: 50rpx;
					}
					.GoldClockInNum{
						font-size: 20rpx;
						color: red;
					}
				}
			}

			.goldGame {
				display: flex;
				// border: 1rpx #2979ff solid;
				border-radius: 12rpx;

				.goldGameItem {
					width: 25%;
					text-align: center;
					margin: 8rpx;
					padding: 8rpx;
					font-size: 24rpx;

					image {
						width: 60%;
					}

					view {
						padding: 8rpx 0;
					}
				}
			}
		}

	}

	@-webkit-keyframes bounce-down {
		25% {
			-webkit-transform: translateY(-8rpx);
		}

		50%,
		100% {
			-webkit-transform: translateY(0);
		}

		75% {
			-webkit-transform: translateY(8rpx);
		}
	}

	@keyframes bounce-down {
		25% {
			transform: translateY(-8rpx);
		}

		50%,
		100% {
			transform: translateY(0);
		}

		75% {
			transform: translateY(8rpx);
		}
	}

	.btn {
		background-image: linear-gradient(-60deg, #2f6dfd 0%, #065ed4 100%);
		background-blend-mode: normal, color-burn;
		box-shadow: 0 0 10rpx #f1f1f1;
		color: #fff;
		text-align: center;
		padding: 0 32rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 64rpx;
		font-size: 26rpx;
	}

	.paybtn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
		box-shadow: 0 0 10rpx #f1f1f1;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 100rpx;
		line-height: 100rpx;
	}
</style>
