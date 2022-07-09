<template>
	<div class="page" v-if="user && config">
		<div class="header">
			<div class="left">
				<div class="title">我的收益</div>
				<div class="desc">
					<div class="label">可提现：</div>
					<div class="value">
						{{user.wallet | formatPrice}}元
						<div class="btn"  @click="$go('/pages/rm/finance/Cashout')">提现</div>
					</div>
				</div>
			</div>
			<div class="right">
				<div class="subprofit" v-if="config">
					<div class="title">
						<text>{{config.agent.agent_level[user.agent_level]?config.agent.agent_level[user.agent_level]:'普通用户'}}</text>

						<text class="updateBotton" @click="$refs.openAgent.show()">升级</text>
					</div>
					<div class="list">
						<div class="item">
							<div class="label">直邀好友</div>
							<div class="value" v-if="user.commission_ratio.direct>0">
								{{user.commission_ratio.direct*100}}%
							</div>
							<div class="value" v-else>-</div>
						</div>
						<div class="line"></div>
						<div class="item">
							<div class="label">二级好友</div>
							<div class="value" v-if="user.commission_ratio.indirect>0">
								{{user.commission_ratio.indirect*100}}%
							</div>
							<div class="value" v-else>-</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="count">
			<u-notice-bar :list="[config.agent_notice]" :is-circular="true" :speed="100"></u-notice-bar>
			<div class="friend">
				<div class="title">
					<span class="left">我的好友：{{last_users.total}}人</span>
					<span class="right" @click="$go('/pages/rm/me/Friend')">
						<u-lazy-load class="img" v-for="(item, key) in last_users.data" :key="key" :image="item.avatar"
							border-radius="22"></u-lazy-load>
						<i>&#xe780;</i>
					</span>
				</div>
				<div class="today_count">
					<div class="item">
						<div class="value">{{today_user.total}}<span>人</span></div>
						<div class="label">共邀请</div>
					</div>
					<div class="item">
						<div class="value">{{today_user.direct}}<span>人</span></div>
						<div class="label">直邀好友</div>
					</div>
					<div class="item">
						<div class="value">{{today_user.indirect}}<span>人</span></div>
						<div class="label">间邀好友</div>
					</div>
				</div>
				<div class="invite-type">
					<div class="title">可通过以下方式邀请好友</div>
					<div class="btns">
						<u-button type="success" class="btn" open-type="share" ripple="true">
							<i>&#xe7db;</i>转发链接
						</u-button>
						<u-button type="primary" class="btn" @click="showPoster()" :loading="poster_loading"
							loading-text="正在获取..." ripple="true">
							<i>&#xe63c;</i>转发海报
						</u-button>
					</div>
				</div>
			</div>
			<div class="tool">
				<div class="title">更多</div>
				<div class="btns">
					<u-button type="warning" class="btn" @click="joinAgentQun()" ripple="true">
						<i>&#xe68b;</i> 加入代理群
					</u-button>
					<div class="kf-btn-wrap">
						<div v-if="user.kf_qrcode != null" class="ok"><i>&#xe7be;</i></div>
						<u-button type="warning" class="btn" @click="setKfQrcode()" ripple="true">
							<i>&#xe7ba;</i> <text>设置客服二维码</text>
						</u-button>
					</div>
				</div>
			</div>
			<div class="profit">
				<div class="title">
					<span class="left">我的佣金：{{total_profit | formatPrice}}元</span>
					<span class="right" @click="$go('/agent/commission_note_list')">
						<!-- <text style="float: left;">详情</text><i style="float: left;">&#xe780;</i> -->
					</span>
				</div>
				<div class="today_count">
					<div class="item">
						<div class="value">{{today_profit.total | formatPrice}}<span>元</span></div>
						<div class="label">总佣金</div>
					</div>
					<div class="item">
						<div class="value">{{today_profit.gold | formatPrice}}<span>元</span></div>
						<div class="label">积分佣金</div>
					</div>
					<div class="item">
						<div class="value">{{today_profit.vip | formatPrice}}<span>元</span></div>
						<div class="label">会员佣金</div>
					</div>
					<div class="item">
						<div class="value">{{today_profit.ad | formatPrice}}<span>元</span></div>
						<div class="label">广告佣金</div>
					</div>
					<div class="item">
						<div class="value">{{today_profit.agent | formatPrice}}<span>元</span></div>
						<div class="label">代理佣金</div>
					</div>
					<div class="item">
						<div class="value">{{today_profit.other | formatPrice}}<span>元</span></div>
						<div class="label">其他</div>
					</div>
					<div class="item">
					</div>
					<div class="item">
					</div>
				</div>
			</div>
		</div>
		<div class="ranking" id="ranking" style="display: none;">
			<div class="title">
				<p class="name" @click="ranking.visible=true">{{ranking.actions_item.name}}<i>&#xe7c2;</i></p>
				<p class="time" v-if="ranking.actions_item.value=='last_week'">
					({{ranking.last_week_start_date}}-{{ranking.last_week_end_date}})</p>
				<p class="time" v-if="ranking.actions_item.value=='yesterday'">({{ranking.yesterday_date}})</p>
			</div>
			<van-tabs v-model="active">
				<van-tab title="佣金榜" name="commission">
					<list v-if="active=='commission'" type="commission" :date_type="ranking.actions_item.value"></list>
				</van-tab>
				<van-tab title="邀请榜" name="friend">
					<list v-if="active=='friend'" type="friend" :date_type="ranking.actions_item.value"></list>
				</van-tab>
			</van-tabs>
		</div>
		<van-action-sheet v-model="ranking.visible" :actions="ranking.actions" cancel-text="取消" close-on-click-action
			@select="item=>ranking.actions_item=item" />
		<join-wework ref="joinWework" />
		<open-agent ref="openAgent" title="开通代理" />
		<show-qrcode ref="showQrcode" title="长按扫码添加群主微信" :tips="'添加群主微信请备注:'+user.uid+'，否则不通过。'" />
	</div>
</template>

<script>
	// import JoinWework from '../../components/JoinWework.vue';
	import OpenAgent from '@/pages/rm/components/OpenAgent.vue';
	import ShowQrcode from "@/pages/rm/components/ShowQrcode.vue";
	// import list from './_index_ranking_list.vue';
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			// JoinWework,  
			OpenAgent,
			// list, 
			ShowQrcode
		},
		data() {
			return {
				last_users: {
					total: 0,
					data: []
				},
				today_user: {
					total: 0,
					active: 0,
					not_active: 0,
					direct: 0,
					indirect: 0,
				},
				today_profit: {
					gold: 0,
					vip: 0,
					agent: 0,
					ad: 0,
					total: 0,
					other: 0
				},
				total_profit: 0,
				poster_loading: false,
				active: 'commission',
				ranking: {
					visible: false,
					actions: [{
						name: '上周排行榜',
						value: 'last_week'
					}, {
						name: '昨日排行榜',
						value: 'yesterday'
					}],
					actions_item: {
						name: '上周排行榜',
						value: 'last_week'
					},
					last_week_start_date: '',
					last_week_end_date: '',
					yesterday_date: ''
				}
			};
		},
		computed: {
			user(){
				return this.$store.state.user
			},
			config() {
				return this.$store.state.config;
			}
		},
		created() {
			this.pageAgent();
			this.getRankingDate();
			// if (this.$route.query.p == 'ranking') {
			// 	this.$nextTick(() => {
			// 		document.getElementById('ranking').scrollIntoView();
			// 	})
			// }
		},
		methods: {
			pageAgent() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'pageAgent',
					sCallBack: function(res) {
						self.last_users = res.last_users;
						self.today_user = res.today_user;
						self.today_profit = res.today_profit;
						self.total_profit = res.total_profit;
					}
				}
				base.request(params);
			},
			showNotActiveTips() {
				uni.showModal({
					title: '无效邀请',
					content: '未点进平台的用户或已是别的代理的用户',
					confirmText: '知道了',
				});
			},
			showPoster() {
				this.poster_loading = true;
				var self = this;
				var base = new Base();
				var params = {
					url: 'getPoster',
					sCallBack: function(res) {
						if (res.code == 0) {
							self.$imagePreview(res.list);
							self.poster_loading = false;
						}
					}
				}
				base.request(params);
			},
			getRankingDate() {
				var self = this;
				var base = new Base();
				var params = {
					url: 'getRankingDate',
					sCallBack: function(res) {
					self.ranking.last_week_start_date = res.last_week_start_date;
					self.ranking.last_week_end_date = res.last_week_end_date;
					self.ranking.yesterday_date = res.yesterday_date;
					}
				}
				base.request(params);
			},
			joinAgentQun() {
				var self = this;
				if (self.user.is_agent == 0) {
					uni.showModal({
						title: '提示',
						content: '您还不是代理，无法加入代理群',
						confirmText: '开通代理',
						confirmColor: 'red',
						showCancel: true,
						cancelText: '暂不开通',
						success: function(res) {
							if (res.confirm) {
								self.$refs.openAgent.show();
							}
						}
					});
				} else {
					uni.showModal({
						title: '进群提示',
						content: '进群后请遵守相关法律法规，请勿发跟平台无关的广告，一经发现无任何告知移出代理群并取消代理资格。',
						contentAlign: 'left',
						confirmText: '我能做到',
						confirmColor: 'red',
						showCancel: true,
						cancelText: '我做不到',
						success: function(res) {
							if (res.confirm) {
								self.$refs.showQrcode.show(self.config.dailiqun_qrcode);
							}
						}
					});
				}
			},
			setKfQrcode() {
				var self = this;
				var base = new Base();
				if (self.user.agent_level != 3) {
					uni.showModal({
						title: '您不是钻石代理，无法设置客服二维码',
						content: '上传我的个人微信二维码，您的下级(限直邀)好友联系平台客服(我的->联系客服)即可联系到您。',
						confirmText: '开通钻石',
						confirmColor: 'red',
						showCancel: true,
						cancelText: '暂不开通',
						success: function(res) {
							if (res.confirm) {
								self.$refs.openAgent.show();
							}
						}
					});
					return;
				}

				uni.showModal({
					title: '提示',
					content: '上传我的个人微信二维码，您的下级(限直邀)好友联系平台客服(我的->联系客服)即可联系到您。',
					confirmText: '上传',
					confirmColor: 'red',
					showCancel: true,
					cancelText: '暂不上传',
					contentAlign: 'left',
					success: function(res) {
						if (res.confirm) {
							uni.chooseImage({
								count: 1,
								sizeType: ['compressed'],
								sourceType: ['album'],
								success: (res) => {
									console.log('chooseImage:');
									console.log(res);
									var tempFilePaths = res.tempFilePaths;
									uni.uploadFile({
										url: base.baseRequestUrl + 'uploader',
										filePath: tempFilePaths[0],
										name: 'file',
										formData: {
											'type': "file"
										},
										success: (item) => {
											console.log('uploadFile:');
											let path = JSON.parse(item.data);
											console.log(path);
											var params = {
												url: 'setKfQrcode',
												data: {
													kf_qrcode_pic: path.url
												},
												sCallBack: function(res) {
													console.log('request:');
													console.log(res);
													if (res.code == 1) {
														self.$u.toast(res.msg);
													} else {
														self.$u.toast('设置成功');
														
														self.$userInfo(res => {
															self.user = res
														});
														self.$notify({
															type: 'success',
															message: '设置成功'
														});
													}

												}
											}
											base.request(params);
										}

									})
								}
							});
						}
					}
				});
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
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		background-image: url("http://shiyinet-oss.oss-cn-shenzhen.aliyuncs.com/default/20201108/1604841646893428");
		background-repeat: no-repeat;
		background-size: contain;
		padding-bottom: 100upx;
	}

	.header {
		color: #fae4e0;
		padding: 0 32upx;
		padding-top: 60upx;
		display: flex;
		justify-content: space-between;

		.left {
			flex: 1;

			.title {
				font-size: 26px;
			}

			.desc {
				margin-top: 3px;
				font-size: 13px;
				display: flex;
				flex-direction: column;

				.value {
					margin-top: 3px;
					display: flex;

					.btn {
						border-radius: 3px;
						border: 1px solid #fae4e0;
						padding: 0px 6px;
						height: 40upx;
						line-height: 40upx;
						margin-left: 6px;
					}
				}
			}
		}

		.subprofit {
			text-align: center;
			border: 1px solid #fae4e0;
			font-size: 13px;
			border-radius: 3px;
			flex: 1;

			.title {
				border-bottom: 1px solid #fae4e0;
				padding: 5px 0;

				i {
					font-size: 12px;
					margin-left: 4px;
				}

				.updateBotton {
					margin-left: 12upx;
					border-radius: 6upx;
					border: 1upx solid #fae4e0;
					padding: 0 12upx;
					color: #fff;
					width: 64upx;
					height: 36upx;
					line-height: 36upx;
				}

			}

			.list {
				display: flex;

				.line {
					border-left: 1px solid #fae4e0;
				}

				.item {
					flex: 1;
					padding: 5px 3px;
				}
			}
		}
	}

	.count {
		background: #fff;
		margin: 0 16px;
		margin-top: 16px;
		padding: 16px 16px;
		border-radius: 8px;

		.friend {
			margin-top: 20upx;
			border-bottom: 1px dashed #f1f1f1;

			.title {
				font-weight: 700;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-size: 13px;
				}

				.right {
					font-weight: 500;
					color: #d64431;
					display: flex;
					align-items: center;

					.img {
						border: 1px solid #f1f1f1;
						width: 1;
						width: 22px;
						height: 22px;
						border-radius: 22px;
						margin-right: 2px;
						vertical-align: middle;
					}
				}
			}

			.today_count {
				display: flex;
				justify-content: space-around;
				background: #f9f9f9;
				border-radius: 3px;
				padding: 10px 0;
				margin-top: 10px;
				position: relative;
				overflow: hidden;

				.value {
					font-size: 22px;
					color: #d64431;
					font-weight: 500;

					span {
						font-size: 12px;
						margin-left: 3px;
					}
				}

				.label {
					color: #595959;
					margin-top: 8px;
					display: flex;
					align-items: center;

					i {
						margin-left: 3px;
						font-size: 12px;
					}
				}
			}

			.today_count::after {
				content: "今日";
				position: absolute;
				top: -3px;
				left: -26px;
				width: 70px;
				height: 24px;
				line-height: 29px;
				background: #f6e488;
				transform: rotate(-45deg);
				text-align: center;
				font-size: 12px;
				color: #d64431;
			}

			.invite-type {
				margin-top: 10px;

				.title {}

				.btns {
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					padding: 10px 0;

					.btn {
						width: 49%;

						i {
							margin-right: 6px;
							font-size: 16px;
						}
					}
				}
			}
		}

		.tool {
			margin-top: 16px;
			border-bottom: 1px dashed #f1f1f1;
			padding-bottom: 10px;

			.title {
				font-weight: 700;
				display: flex;
				justify-content: space-between;

				.right {
					font-weight: 500;
					color: #d64431;
				}
			}

			.btns {
				margin-top: 10px;
				display: flex;
				justify-content: space-between;

				.btn {
					width: 49%;
				}

				.kf-btn-wrap {
					position: relative;
					overflow: hidden;
					border-radius: 4px;

					.btn {
						width: 100%;
					}

					.ok {
						position: absolute;
						top: 0;
						left: 0;
						background: #07c160;
						color: #fff;
						padding: 0 6px;
						border-bottom-right-radius: 4px;
						z-index: 2;
					}
				}
			}
		}

		.profit {
			margin-top: 16px;

			.title {
				font-weight: 700;
				display: flex;
				justify-content: space-between;

				.right {
					font-weight: 500;
					color: #d64431;
				}
			}

			.today_count {
				display: flex;
				justify-content: space-around;
				background: #f9f9f9;
				border-radius: 3px;
				padding: 3px 0;
				padding-top: 0;
				margin-top: 10px;
				position: relative;
				overflow: hidden;
				flex-wrap: wrap;

				.item {
					width: 33.333%;
					text-align: center;
					padding-top: 16px;
					position: relative;
				}

				.value {
					font-size: 22px;
					color: #d64431;
					font-weight: 500;

					span {
						font-size: 13px;
						margin-left: 3px;
					}

					span.subprofit {
						color: green;
						position: absolute;
						top: 3px;
						right: 0;
						font-weight: 400;

						i {
							font-size: 12px;
							margin-left: 3px;
							color: #999;
						}
					}
				}

				.label {
					color: #595959;
					margin-top: 3px;
				}
			}

			.today_count::after {
				content: "今日";
				position: absolute;
				top: -3px;
				left: -26px;
				width: 70px;
				height: 24px;
				line-height: 29px;
				background: #f6e488;
				transform: rotate(-45deg);
				text-align: center;
				font-size: 12px;
				color: #d64431;
			}
		}
	}

	.activity {
		background: #fff;
		margin: 0 16px;
		margin-top: 16px;
		padding: 12px 16px;
		border-radius: 6px;

		.title {
			font-weight: 700;
			display: flex;
			align-items: center;

			.left {
				flex: 1;
			}

			.right {
				font-size: 12px;
				font-weight: 400;
				color: #999;

				i {
					margin-right: 3px;
					color: #ccc;
				}
			}
		}

		.notify-swipe {
			height: 30px;
			line-height: 34px;
			font-size: 12px;
			padding: 0 10px;
			background: #fdf6ec;
			margin-top: 10px;
			border-radius: 4px;
			overflow: hidden;
			color: #d64431;

			.item {
				text-align: center;
				word-break: keep-all;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.list {
			background: #f9f9f9;
			margin-top: 10px;
			border-radius: 4px;
			height: 200px;
			overflow: auto;

			.item {
				display: flex;
				align-items: center;
				padding: 8px 10px 0px 10px;

				.time {
					font-size: 12px;
					color: #909399;
				}

				.nickname {
					flex: 1;
					text-align: left;
					padding: 0 10px;
					font-size: 14px;
					word-break: keep-all;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.btn {
					border-radius: 3px;
				}
			}
		}
	}

	.dialog-qyqrcode {
		.tips {
			padding: 16px;
			background: #fdf6ec;
			color: #f56c6c;
		}

		.qrcode {
			height: 300px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			a {
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.qrcodeImg {
				width: 60%;
			}
		}
	}

	.vipKf {
		width: 100%;
		color: #999;
		font-size: 13px;
		margin-top: 12px;
		background: #f6e488;
		padding: 3px 6px;
		color: red;
	}

	.ranking {
		margin: 16px;
		background: #fff;
		padding: 16px 0;
		border-radius: 8px;

		.title {
			font-weight: 700;
			text-align: center;

			.name {
				i {
					margin-left: 5px;
					font-size: 12px;
					color: #7b7b7b;
				}
			}

			.time {
				color: #909399;
				font-weight: 400;
				margin-top: 3px;
				font-size: 12px;
			}
		}
	}
</style>
