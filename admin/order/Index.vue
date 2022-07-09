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
			<list class="van-list">
				<div v-for="(item, key) in list.data" class="item" :key="key">
					<div class="invite-info">
						ID:{{item.id}}
						<div style="float: right;">{{item.name}}</div>
					</div>
					<div class="top">
						<div class="left">
							<div class="userinfo">
								<scroll-view class="avatar" v-if="item.user.avatar">
									<u-lazy-load :image="item.user.avatar" mode="widthFix" border-radius="12"
										@click="$imagePreview([item.user.avatar])"></u-lazy-load>
								</scroll-view>
							
								<div class="nickname">
									<span class="uid">{{item.user.uid}}</span>
									{{item.user.avatar == null ? '游客':item.user.nickname}}
									<div>
										<span>积分:{{item.user.gold}}</span>
										<span
											:class="[item.user.is_agent ? '':'uid']">{{item.user.is_agent?item.user.agent_level=='1'?'普通代理':item.user.agent_level=='2'?'黄金代理':item.user.agent_level=='3'?'钻石代理':'非代理':'非代理'}}</span>
										<span :class="[item.user.is_vip ? '':'uid']">{{item.user.is_vip?'会员':'非会员'}}</span>
									</div>
								</div>
							</div>
							<div class="time" v-if="item.user">
								<div class="create_time">{{item.user.create_time | formatDiffDate}}注册</div>
								<div v-if="item.user.online_time>0" class="online_time">
									{{item.user.online_time | formatDiffDate}}在线
								</div>
							</div>
						</div>
						<div class="right">
							<div class="type success" v-if="item.status == '1'">支付成功</div>
							<div class="type default" v-else>待支付</div>
							<div class="commission">{{item.amount | formatPrice}}元</div>
							<div class="order_num">{{item.create_time | formatDiffDate}}</div>
						</div>
					</div>
				</div>
			</list>
			<empty class="tips" v-if="list.data.length==0" description="暂无数据">
			</empty>
		</div>
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
			// 		this.list.loading = false;
			// 		this.list.finished = false;
			// 		this.list.query.page = 1;
			// 		this.list.total = 0;
			// 		this.list.data = [];
					this.subPost();
			// 		// this.$getList('getSysUserList', this.list);
				},
				deep: true
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
		},
		onLoad() {
			this.subPost();
		},
		methods: {			
			subPost(){
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/getOrderList',
					type:'post',
					data: {
						page: that.list.page,
						order:'create_time',
						query_type:'user_id',
						query_value:that.list.query.words
					},
					sCallBack: function(res) {
						if (res.code !== 0) {
							that.$toast(res.msg);
						}else{
							var arr = new Array();
							if(that.list.query.page == 1){
								that.list.data = res.list.data
							}else{
								that.list.data = arr.concat(that.list.data, res.list.data)
							}
						}
					}
				}
				base.request(params);
			}
		},
		//下拉
		onReachBottom() {
			//避免多次触发
			// if (this.list.loading == false || this.list.finished == true) {
			// 	return;
			// }
			this.list.page = this.list.page + 1
			this.subPost();
		},
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
			height: 44px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #272727;
			font-size: 13px;

			.right {
				width: 100%;
				padding: 12upx;
			}
		}
	}

	.list {
		padding: 14px;
		margin-top: 44px;

		>.van-list>.item {
			position: relative;
			display: flex;
			padding: 0px 16px;
			margin-bottom: 16px;
			padding-bottom: 16px;
			align-items: center;
			flex-direction: column;
			border-bottom: 1px solid #f2f6fc;
			background: #fff;
			border-radius: 8px;
			overflow: hidden;

			.invite-info {
				width: 100%;
				font-size: 12px;
				color: #909399;
				height: 30px;
				line-height: 30px;
				border-bottom: 1px solid #f1f1f1;
			}

			.top {
				display: flex;
				justify-content: space-between;
				width: 100%;
				align-items: flex-end;
				margin-top: 10px;

				.left {
					flex: 1;
					margin-right: 10px;
					overflow: hidden;

					.userinfo {
						display: flex;
					
						.avatar {
							width: 42px;
							height: 42px;
							border-radius: 6px;
							margin-right: 10px;
						}
					
						.nickname {
							font-size: 15px;
							word-break: keep-all;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
					
							span {
								margin-bottom: 3px;
								padding: 0 4px;
								border-radius: 2px;
								font-size: 12px;
								display: inline-block;
								border: 1px solid #409eff;
								color: #409eff;
								margin-right: 10rpx;
								height: 34rpx;
								line-height: 36rpx;
							}
					
							.uid {
								margin-top: 2px;
								font-size: 12px;
								color: #909399;
								border: 1px solid #909399;
							}
						}
					}
					.time {
						display: flex;
						margin-top: 10px;
						color: #909399;
						font-size: 13px;

						.create_time {
							position: relative;
							margin-right: 10px;
						}

						.create_time::after {
							position: absolute;
							content: "";
							top: 5px;
							right: -5px;
							bottom: 5px;
							border-left: 1px solid #ebeef5;
						}

						.online_time {}
					}
				}

				.right {
					.type {
						margin-bottom: 6px;
						padding: 0 4px;
						border-radius: 2px;
						font-size: 12px;
						display: inline-block;
						height: 18px;
						line-height: 18px;
						float: right;
					}

					.default {
						border: 1px solid #409eff;
						color: #409eff;
					}

					.success {
						border: 1px solid #19be6b;
						color: #19be6b;
					}

					.error {
						border: 1px solid #ff0000;
						color: #ff0000;
					}

					.commission {
						font-size: 20px;
						color: #f56c6c;
						margin-bottom: 20rpx;
					}

					.order_num {
						font-size: 12px;
						color: #909399;
						float: right;
					}
				}
			}

			.bottom {
				width: 100%;
				padding: 16px 10px;
				margin-top: 10px;
				background: #f2f6fc;
				border-radius: 6px;
				text-align: right;

			}
		}
	}

	
</style>
