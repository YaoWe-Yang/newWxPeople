<template>
	<div class="page" v-if="user && config">
		<div class="header">
			<div class="gold">
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
			</div>
		</div>
		<div class="func">
			<div class="title">赚积分</div>
			<div class="list">
				<div class="item" v-if="!user.wemp_openid || user.wemp_openid == null || user.wemp_openid == undefined">
					<div class="left">
						<i class="myfont" style="color:rgb(0, 170, 0)">&#xe617;</i>
					</div>
					<div class="center">
						<div class="title">关注<span class="span">{{user.wemp_openid?'已关注':'未关注'}}</span></div>
						<div class="desc">
							关注公众号可获得{{config.gold.reward.wemp_follow}}积分
						</div>
					</div>
					<div class="right">
						<div class="dfbtn" @click="$follow()">去关注</div>
					</div>
				</div>
				
				<div class="item">
					<div class="left">
						<i class="myfont" style="color:rgb(85, 85, 255)">&#xf004;</i>
					</div>
					<div class="center">
						<div class="title">打卡<span class="span">剩余{{day_clock_num}}次</span></div>
						<div class="desc">
							打卡1次获得{{config.gold.reward.clock_in}}积分，每天可打卡{{config.gold.reward.day_clock_num}}次，连续打卡{{config.gold.reward.continuity_lock_day}}天赠送VIP
						</div>
					</div>
					<div class="right">
						<div class="dfbtn" @click="getGold('clockIn')">去打卡</div>
					</div>
				</div>

				<div class="item">
					<div class="left">
						<i style="color:rgb(245, 108, 108)">&#xe654;</i>
					</div>
					<div class="center">
						<div class="title">邀请好友</div>
						<div class="desc">邀请1个好友获得{{config.gold.reward.invite}}积分，开通会员积分翻倍</div>
					</div>
					<div class="right">
						<div class="dfbtn" @click="$go('Poster')">去邀请</div>
					</div>
				</div>
			</div>
		</div>
		<div class="func" style="margin-top:20px;">
			<div class="title">积分的用途</div>
			
			<div class="list">
				<div class="item">
					<div class="left">
						<i style="color:rgb(146, 102, 249)">&#xe80e;</i>
					</div>
					<div class="center">
						<div class="title">发布群</div>
						<div class="desc">发布需要消费{{config.quncard.add_require_gold}}积分</div>
					</div>
					<div class="right">
						<div class="btn" @click="$go('/pages/rm/quncard/Add')">去发布</div>
					</div>
				</div>
				<div class="item">
					<div class="left">
						<i style="color:rgb(255, 151, 106)">&#xe76f;</i>
					</div>
					<div class="center">
						<div class="title">置顶群</div>
						<div class="desc">10积分可置顶1分钟</div>
					</div>
					<div class="right">
						<div class="btn" @click="$go('/pages/rm/quncard/Mgr')">去置顶</div>
					</div>
				</div>
			</div>
		</div>
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
				day_clock_num:0,
				goldType:'',
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
			clockIn(){
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
							if(this.goldType == 'clockIn'){
								this.clockIn();
							}
							if(this.goldType == 'chenkIn'){
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
		padding-bottom: 100px;
	}

	.header {
		height: 200px;
		background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 20px;
		position: relative;

		.gold {
			text-align: center;

			.value {
				font-size: 60px;
			}
		}

		.bottom {
			position: absolute;
			left: 16px;
			right: 16px;
			bottom: -30px;
			display: flex;
			background: #fff;
			width: 90%;
			margin-top: 30px;
			padding: 20px;
			border-radius: 8px;
			justify-content: space-between;
			align-items: center;
			box-shadow: 1px 1px 1px #f1f1f1;

			.title {
				font-size: 20px;
			}

			.desc {
				font-size: 13px;
				color: #909399;
				margin-top: 4px;
			}

			.btn {
				background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
				box-shadow: 0px 0px 5px #f1f1f1;
				color: #fff;
				text-align: center;
				font-size: 14px;
				padding: 0 16px;
				height: 38px;
				line-height: 38px;
				border-radius: 38px;
			}

			.btn.checkedin {
				opacity: 0.5;
			}
		}
	}

	.func {
		margin-top: 50px;
		padding: 0 16px;

		.title {
			font-size: 18px;

			.span {
				font-size: 10px;
				position: absolute;
				margin-left: 8px;
				margin-top: 2px;
				padding: 0 8px;
				background-color: red;
				color: #fff;
				border-radius: 20px;
				line-height: 15px;
			}
		}

		.list {
			margin-top: 10px;

			.item {
				display: flex;
				justify-content: space-between;
				background: #fff;
				align-items: center;
				border-radius: 8px;
				padding: 12px 16px;

				.left {
					display: flex;
					padding: 8px;

					i {
						font-size: 30px;
						color: #67c23a;
					}
				}

				.center {
					flex: 1;
					padding: 0 16px;

					.desc {
						margin-top: 6px;
						color: #999;
					}
				}

				.right {
					.btn {
						background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
						background-blend-mode: normal, color-burn;
						box-shadow: 0px 0px 5px #f1f1f1;
						color: #fff;
						text-align: center;
						font-size: 16px;
						padding: 0 16px;
						height: 32px;
						line-height: 32px;
						border-radius: 32px;
						color: #333;
						font-size: 13px;
					}

					.dfbtn {
						background-image: linear-gradient(-60deg, #2f6dfd 0%, #065ed4 100%);
						background-blend-mode: normal, color-burn;
						box-shadow: 0px 0px 5px #f1f1f1;
						color: #fff;
						text-align: center;
						padding: 0 16px;
						height: 32px;
						line-height: 32px;
						border-radius: 32px;
						font-size: 13px;
					}
				}
			}
		}
	}

	.paybtn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
		box-shadow: 0px 0px 5px #f1f1f1;
		color: #fff;
		text-align: center;
		font-size: 14px;
		height: 50px;
		line-height: 50px;
	}
</style>
