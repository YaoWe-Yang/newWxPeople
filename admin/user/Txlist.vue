<template>
	<div class="page">
		<div class="header">
			<div class="top">
				<div class="right">
					<u-search background="#fff" v-model="list.query.words" placeholder="搜索UID，昵称" animation="false" />
				</div>
			</div>
		</div>
		<div class="list">
			<list class="van-list" v-model="list.loading" :finished="list.finished"
				@load="$getList('/Me/getCashoutList', list)">
				<div v-for="(item, key) in list.data" class="item" :key="key" @click="showInfo(item)">
					<div class="invite-info" v-if="item.directUser">
						邀请人：{{item.directUser.nickname}}（UID:{{item.directUser.uid}}）
					</div>
					<div class="top">
						<div class="left">
							<div class="userinfo">
								<scroll-view class="avatar" v-if="item.user.avatar">
									<u-lazy-load :image="item.user.avatar" mode="widthFix" border-radius="12"
										@click="$imagePreview([item.user.avatar])"></u-lazy-load>
								</scroll-view>

								<div class="nickname">
									{{item.user.nickname}}
									<p class="uid">UID:{{item.user.uid}}</p>
								</div>
							</div>
							<div class="time">
								<div class="create_time">{{item.user.create_time | formatDiffDate}}注册</div>
								<div v-if="item.user.online_time>0" class="online_time">
									{{item.user.online_time | formatDiffDate}}在线
								</div>
							</div>
						</div>
						<div class="right">
							<div class="type success" v-if="item.status == '1'">已打款</div>
							<div class="type error" v-else-if="item.status == '2'">已驳回</div>
							<div class="type default" v-else>未打款</div>
							<div class="commission">{{item.amount | formatPrice}}元</div>
							<div class="order_num">{{$u.timeFormat(item.create_time, 'yyyy-mm-dd hh:MM:ss')}}</div>
						</div>
					</div>
				</div>
			</list>
			<empty class="tips" v-if="list.data.length==0" description="暂无数据">
			</empty>
		</div>
		<u-popup v-model="visible" title="提现明细" mode="center" border-radius="14" closeable="true">
			<view class="showInfo">
				<view class="paymentQrcode">
					<u-lazy-load :image="'https://wqrm.oss-cn-shenzhen.aliyuncs.com/'+info.payment_qrcode"
						mode="widthFix" border-radius="12"
						@click="$imagePreview(['https://wqrm.oss-cn-shenzhen.aliyuncs.com/'+info.payment_qrcode])">
					</u-lazy-load>
				</view>
				<view class="txAmount">提现金额：<text>{{info.amount | formatPrice}}</text>元</view>
				<view class="txButton" v-if="info.status == '0'">
					<u-button type="primary" size="medium" :custom-style="customStyle" @click="subPost(info,1)">打 款
					</u-button>
					<u-button type="error" size="medium" :custom-style="customStyle" @click="subPost(info,2)">驳 回
					</u-button>
				</view>
			</view>
		</u-popup>
	</div>
</template>

<script>
	import Empty from '@/pages/rm/components/Empty.vue'

	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			Empty
		},
		data() {
			return {
				visible: false,
				info: '',
				customStyle: {
					padding: '0 30rpx',
					margin: '0 20rpx',
				},
				list: {
					loading: false,
					finished: false,
					page: 1,
					query: {
						words: ''
					},
					total: 0,
					data: []
				},
			};
		},
		watch: {
			'list.query': {
				handler() {
					this.list.loading = false;
					this.list.finished = false;
					this.list.query.page = 1;
					this.list.total = 0;
					this.list.data = [];
					this.$getList('getCashoutList', this.list);
				},
				deep: true
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
		},
		created() {
			// if (this.$route.query.type) {
			// 	this.list.query.type = this.$route.query.type;
			// }
			this.$getList('getCashoutList', this.list);
		},
		methods: {
			showInfo(item) {
				this.visible = true;
				this.info = item;
			},

			subPost(info, status) {

				var base = new Base();
				var that = this;
				var params = {
					url: 'SysCashout',
					type: 'post',
					data: {
						id: info.id,
						status: status,
					},
					sCallBack: function(res) {
						if (res.code !== 0) {
							that.$toast(res.msg);
						} else {
							that.visible = false;
							that.info.status = status;
						}
					}
				}
				base.request(params);
			}
		}
	};
</script>


<style lang="scss" scoped>
	.page {
		background: #f2f2f2;
	}

	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: #fff;
		z-index: 2;

		.top {
			background: #fff;
			height: 88rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #272727;
			font-size: 26rpx;

			.right {
				width: 100%;
				padding: 12upx;
			}
		}
	}

	.list {
		padding: 28rpx;
		margin-top: 88rpx;

		>.van-list>.item {
			position: relative;
			display: flex;
			padding: 0px 32rpx;
			margin-bottom: 32rpx;
			padding-bottom: 32rpx;
			align-items: center;
			flex-direction: column;
			border-bottom: 1rpx solid #f2f6fc;
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;

			.invite-info {
				width: 100%;
				font-size: 24rpx;
				color: #909399;
				height: 60rpx;
				line-height: 60rpx;
				border-bottom: 1rpx solid #f1f1f1;
			}

			.top {
				display: flex;
				justify-content: space-between;
				width: 100%;
				align-items: flex-end;
				margin-top: 20rpx;

				.left {
					flex: 1;
					margin-right: 20rpx;
					overflow: hidden;

					.userinfo {
						display: flex;

						.avatar {
							width: 84rpx;
							height: 84rpx;
							border-radius: 12rpx;
							margin-right: 20rpx;
						}

						.nickname {
							font-size: 30rpx;
							word-break: keep-all;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;

							span {
								margin-bottom: 6rpx;
								padding: 0 8rpx;
								border-radius: 4rpx;
								font-size: 24rpx;
								display: inline-block;
								border: 1rpx solid #409eff;
								color: #409eff;
								margin-right: 10rpx;
							}

							.uid {
								margin-top: 4rpx;
								font-size: 24rpx;
								color: #909399;
							}
						}
					}

					.time {
						display: flex;
						margin-top: 20rpx;
						color: #909399;
						font-size: 26rpx;

						.create_time {
							position: relative;
							margin-right: 20rpx;
						}

						.create_time::after {
							position: absolute;
							content: "";
							top: 10rpx;
							right: -10rpx;
							bottom: 10rpx;
							border-left: 1rpx solid #ebeef5;
						}

						.online_time {}
					}
				}

				.right {
					.type {
						position: absolute;
						top: 20rpx;
						right: 40rpx;
						margin-bottom: 12rpx;
						padding: 0 8rpx;
						border-radius: 4rpx;
						font-size: 24rpx;
						display: inline-block;
						height: 36rpx;
						line-height: 36rpx;
					}

					.default {
						border: 1rpx solid #409eff;
						color: #409eff;
					}

					.success {
						border: 1rpx solid #19be6b;
						color: #19be6b;
					}

					.error {
						border: 1rpx solid #ff0000;
						color: #ff0000;
					}

					.commission {
						font-size: 40rpx;
						color: #f56c6c;
						margin-bottom: 10rpx;
						text-align: right;
					}

					.order_num {
						font-size: 24rpx;
						color: #909399;
						float: right;
					}
				}
			}

			.bottom {
				width: 100%;
				padding: 32rpx 20rpx;
				margin-top: 20rpx;
				background: #f2f6fc;
				border-radius: 12rpx;
				text-align: right;

			}
		}
	}

	.showInfo {
		padding: 40rpx;
		text-align: center;

		.paymentQrcode {
			width: 500rpx;
		}

		.txAmount {
			padding-top: 10rpx;

			text {
				color: red;
				font-size: 48rpx;
			}
		}

		.txButton {
			padding-top: 10rpx;

			.kg {
				width: 40rpx;
			}
		}
	}
</style>
