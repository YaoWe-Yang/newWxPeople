<template>
	<div class="page">
		<div class="header">
			<div class="top">
				<div class="left">
					<div class="type" @click="type_action_sheet.visible=true">
						<text style="float: left;">{{type_str}}</text>
						<i style="float: left;">&#xe7c2;</i>
					</div>
					<u-action-sheet v-model="type_action_sheet.visible" :list="type_action_sheet.actions"
						cancel-text="取消" description="排序类型" close-on-click-action
						@click="item=>{type_action_sheet.item=item; list.query.order=type_action_sheet.actions[item].value;type_str=type_action_sheet.actions[item].text}" />
				</div>
				<div class="right">
					<u-search background="#fff" v-model="list.query.words" placeholder="搜索UID，昵称" animation="false" />
				</div>
			</div>
		</div>
		<div class="list">
			<list class="van-list" v-model="list.loading" :finished="list.finished"
				@load="$getList('getSysUserList', list)">
				<div v-for="(item, key) in list.data" class="item" :key="key" @click="$refs.commissionNote.show(item)">

					<div class="top">
						<div class="left">
							<div class="userinfo">
								<scroll-view class="avatar" v-if="item.avatar">
									<i class="myfont mp" v-if="item.wemp_openid">&#xe623;</i>
									<u-lazy-load :image="item.avatar" mode="widthFix" border-radius="12"
										@click="$imagePreview([item.avatar])"></u-lazy-load>
								</scroll-view>

								<div class="nickname">
									<span class="uid">{{item.uid}}</span>
									{{item.avatar == null ? '游客':item.nickname}}
									<div>
										<span>积分:{{item.gold}}</span>
										<span
											:class="[item.is_agent ? '':'uid']">{{item.is_agent?item.agent_level=='1'?'普通代理':item.agent_level=='2'?'黄金代理':item.agent_level=='3'?'钻石代理':'非代理':'非代理'}}</span>
										<span :class="[item.is_vip ? '':'uid']">{{item.is_vip?'会员':'非会员'}}</span>
									</div>
								</div>
							</div>
							<div class="time">
								<span :class="[item.phone ? '':'uid']">{{item.phone?'tel:'+item.phone:'未绑定'}}</span>
								<span
									:class="[item.wx_version ? '':'uid']">{{item.wx_version?item.wx_version.system+' / '+item.wx_version.brand+' / wx:'+item.wx_version.version:'未知'}}</span>
							</div>
							<div class="time">
								<div class="create_time">{{item.create_time | formatDiffDate}}注册</div>
								<div v-if="item.online_time>0" class="online_time">
									{{item.online_time | formatDiffDate}}在线
								</div>
							</div>
						</div>
						<div class="right">
							<div class="commission">{{item.quncard_notes_count}}</div>
							<div class="order_num">看群次数</div>
						</div>

					</div>
					<div class="invite-info" v-if="item.directUser">
						<span>直邀</span>{{item.directUser.nickname}}（UID:{{item.directUser.uid}}）
					</div>
					<div class="invite-info" v-if="item.indirectUser">
						<span>间邀</span>{{item.indirectUser.nickname}}（UID:{{item.indirectUser.uid}}）
					</div>
					<div class="bottom">
						<div class="item">
							<div class="value">{{item.wallet | formatPrice}}</div>
							<div class="label">总收益</div>
						</div>
						<div class="item">
							<div class="value">{{item.pay_count?item.pay_count:0}}</div>
							<div class="label">消费次数</div>
						</div>
						<div class="item arrow">
							<i>&#xe780;</i>
						</div>
					</div>
				</div>
			</list>
			<u-empty description="暂无数据" image-size="90px"
				v-if="!list.loading && list.finished && list.data.length==0" />
		</div>
		<commission-note ref="commissionNote" />
	</div>
</template>

<script>
	import CommissionNote from '@/admin/user/CommissionNote.vue';
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			CommissionNote
		},
		data() {
			return {
				type_action_sheet: {
					visible: false,
					actions: [{
						text: '最近操作',
						value: 'online_time'
					}, {
						text: '最近注册',
						value: 'create_time'
					}],
					item: null,
				},
				type_str: '最近操作',
				list: {
					loading: false,
					finished: false,
					query: {
						page: 1,
						type: 'search',
						order: 'online_time',
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
					this.onInfo();
					// 		// this.$getList('getSysUserList', this.list);
				},
				deep: true
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			type_str() {
				let type = this.list.query.type;
				let actions = this.type_action_sheet.actions;
				let str = '';
				for (let i = 0; i < actions.length; i++) {
					const action = actions[i];
					if (action.value == type) {
						str = action.text;
						break;
					}
				}
				return str;
			},
		},
		created() {
			// if (this.$route.query.type) {
			// 	this.list.query.type = this.$route.query.type;
			// }
			// this.$getList('getSysUserList', this.list);
			this.onInfo();
		},
		methods: {
			onInfo() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'getSysUserList',
					data: {
						page: that.list.query.page,
						order: that.list.query.order,
						query_type: that.list.query.type,
						query_value: that.list.query.words,
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							var arr = new Array();
							if (that.list.query.page == 1) {
								that.list.data = res.list.data
							} else {
								that.list.data = arr.concat(that.list.data, res.list.data)
							}
							// if(that.list.data){
							// }else{
							// 	that.list.data = res.list.data
							// }
						}
					}
				}
				base.request(params);
			}
		},
		onPullDownRefresh() {
			console.log('refresh');

			// this.onInfo();

			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//下拉
		onReachBottom() {
			//避免多次触发
			// if (this.list.loading == false || this.list.finished == true) {
			// 	return;
			// }
			this.list.query.page = this.list.query.page + 1
			this.onInfo();
			// this.getUserCard();
			// this.swiperHeight = this.swiperHeight * 1 + this.swiperHRow * 1;
			// console.log(this.swiperHeight);
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
			height: 54px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #272727;
			font-size: 13px;

			.left {
				display: flex;
				white-space: nowrap;
				width: 40%;

				i {
					margin-left: 4px;
					font-size: 12px;
					color: #c2c2c2;
				}

				.type,
				.order {
					margin-left: 16px;
				}
			}

			.right {
				width: 100%;
				padding-right: 12upx;
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

						span {
							margin-bottom: 3px;
							padding: 0 4px;
							border-radius: 20px;
							font-size: 12px;
							display: inline-block;
							border: 1px solid #409eff;
							color: #409eff;
							margin-right: 10rpx;
							height: 34rpx;
							line-height: 36rpx;
						}

						.uid {
							color: #909399;
							border: 1px solid #909399;
						}
					}
				}

				.right {
					position: absolute;
					right: 20px;
					top: 20px;

					.commission {
						font-size: 20px;
						color: #f56c6c;
						margin-bottom: 5px;
						text-align: center;
					}

					.order_num {
						color: #909399;
					}
				}
			}

			.bottom {
				display: flex;
				width: 100%;
				padding: 16px 10px;
				margin-top: 10px;
				background: #f2f6fc;
				border-radius: 6px;

				.item {
					text-align: center;

					.value {
						font-size: 16px;
						color: #606266;
					}

					.label {
						color: #909399;
						margin-top: 6px;
					}
				}

				.item {
					flex: 1;
				}

				.arrow {
					display: flex;
					align-items: center;
					width: 30px;
					flex: none;

					i {
						font-size: 20px;
						color: #ccc;
					}
				}
			}
		}

		>.van-list>.item::after {
			content: "";
			position: absolute;
			bottom: 0px;
			left: 70px;
			right: 0;
			border-bottom: 1px solid #f9f9f9;
		}
	}

	.mp {
		position: absolute;
		z-index: 1;
		right: 0;
		bottom: 0;
		color: #06c503;
		background-color: #ffffffdb;
		border-radius: 4px 0;
	}
</style>
