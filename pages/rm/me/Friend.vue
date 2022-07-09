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
						cancel-text="取消" description="选择好友类型" close-on-click-action
						@click="item=>{type_action_sheet.item=item; list.query.type=type_action_sheet.actions[item].value}" />


					<div class="order" @click="order_action_sheet.visible=true">
						<text style="float: left;">{{order_str}}</text>
						<i style="float: left;">&#xe7c2;</i>
					</div>
					<u-action-sheet v-model="order_action_sheet.visible" :list="order_action_sheet.actions"
						cancel-text="取消" description="选择排序" close-on-click-action
						@click="item=>{order_action_sheet.item=item; list.query.order=order_action_sheet.actions[item].value}" />
				</div>
				<div class="right">
					<u-search background="#fff" v-model="list.query.words" placeholder="搜索UID，昵称" animation="false" />
				</div>
			</div>
			<div class="bottom">
				<div class="left">
					<div class="date" @click="date_action_sheet.visible=true">
						<text style="float: left;">{{date_str}}</text>
						<i style="float: left;">&#xe77f;</i>
					</div>
					<u-picker @cancel="date_action_sheet.visible=false"
						@confirm="item=>{date_action_sheet.visible=false;list.query.dateAction=item}"
						v-model="date_action_sheet.visible" :params="date_action_sheet.current_date" type="year-month"
						title="选择年月" mode="time"></u-picker>


					<div class="day" @click="day_sheet.visible=true">
						<text style="float: left;">{{day_str}}</text>
						<i style="float: left;">&#xe77f;</i>
					</div>
						<u-picker @cancel="day_sheet.visible=false"
							@confirm="value=>{day_sheet.visible=false;list.query.day=value;}"
							title="选择日期" show-toolbar :range="days" :default-selector="[dayIndex]" mode="selector" v-model="day_sheet.visible"/>
				</div>
				<div class="right">
					共邀请{{list.total}}人
				</div>
			</div>
		</div>
		<div class="list">
			<list class="van-list" v-model="list.loading" :finished="list.finished" @load="$getList('/Me/getFriendList', list)">
				<div v-for="(item, key) in list.data" class="item" :key="key">
					<div class="invite-info" v-if="item.directUser">
						邀请人：{{item.directUser.nickname}}（UID:{{item.directUser.uid}}）
						</div>
					<div class="top">
						<div class="left">
							<div class="userinfo">
								<scroll-view class="avatar" v-if="item.avatar">
										<u-lazy-load :image="item.avatar" mode="widthFix" border-radius="12"
											@click="$imagePreview([item.avatar])"></u-lazy-load>
								</scroll-view>
								
								
								<div class="nickname">
									<span>{{item.direct_user_id==user.uid?'直邀':'间邀'}}</span>
									{{item.nickname == null ? '游客':item.nickname}}
									<p class="uid">UID:{{item.uid}}</p>
								</div>
							</div>
							<div class="time">
								<div class="create_time">{{item.create_time | formatDiffDate}}注册</div>
								<div v-if="item.online_time>0" class="online_time">
									{{item.online_time | formatDiffDate}}在线
								</div>
							</div>
						</div>
						<div class="right">
							<div class="commission">{{item.commission | formatPrice}}元</div>
							<div class="order_num">消费{{item.order_num?item.order_num:0}}笔</div>
						</div>
					</div>
					<div class="bottom" @click="$refs.commissionNote.show(item)">
						<div class="item">
							<div class="value">{{item.vip_order_num?item.vip_order_num:0}}笔</div>
							<div class="label">开会员</div>
						</div>
						<div class="item">
							<div class="value">{{item.ad_order_num?item.ad_order_num:0}}笔</div>
							<div class="label">发广告</div>
						</div>
						<div class="item">
							<div class="value">{{item.other_order_num?item.other_order_num:0}}笔</div>
							<div class="label">其他</div>
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
	import CommissionNote from '@/pages/rm/components/CommissionNote.vue';
	export default {
		components: {
			CommissionNote
		},
		data() {
			return {
				type_action_sheet: {
					visible: false,
					actions: [{
						text: '直邀好友',
						value: 'direct'
					}, {
						text: '间邀好友',
						value: 'indirect'
					}, {
						text: '有佣金的好友',
						value: 'has_commission'
					}],
					item: null,
				},
				order_action_sheet: {
					visible: false,
					actions: [{
						text: '注册时间',
						value: 'id'
					}, {
						text: '在线时间',
						value: 'online_time'
					}],
					item: null,
				},
				date_action_sheet: {
					visible: false,
					// current_date: new Date()
					current_date: {
						year: true,
						month: true,
						day: false,
					}
				},
				day_sheet: {
					visible: false,
				},
				list: {
					loading: false,
					finished: false,
					page: 1,
					query: {
						type: 'direct',
						order: 'online_time',
						date: new Date(),
						dateAction: '',
						day: 0,
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
					this.$getList('getFriendList', this.list);
				},
				deep: true
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			date_str() {
				let date = this.list.query.date;

				if (this.list.query.dateAction) {
					date.setFullYear(this.list.query.dateAction.year);
					date.setMonth(this.list.query.dateAction.month - 1);
				}
				return date.getFullYear() + "年" + (date.getMonth() + 1) + '月';
			},
			day_str() {
				let day = this.list.query.day;
				return day > 0 ? day + '号' : '整月';
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
			order_str() {
				let order = this.list.query.order;
				let actions = this.order_action_sheet.actions;
				let str = '';
				for (let i = 0; i < actions.length; i++) {
					const action = actions[i];
					if (action.value == order) {
						str = action.text;
						break;
					}
				}
				return str;
			},
			days() {
				let days = ['全部'];
				let daysNum = new Date(this.list.query.date.getFullYear(), this.list.query.date.getMonth() + 1, 0)
					.getDate();
				for (let index = 0; index < daysNum; index++) {
					days.push((index + 1) + '号');
				}
				return days;
			},
			dayIndex() {
				let index = this.days.indexOf(this.day + '号');
				index = index < 0 ? 0 : index;
				return index;
			}
		},
		created() {
			// if (this.$route.query.type) {
			// 	this.list.query.type = this.$route.query.type;
			// }
			this.$getList('getFriendList', this.list);
		},
		methods: {}
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
				width: 54%;

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
				width: 48%;
				padding-right: 12upx;
			}
		}

		.bottom {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			padding: 16px;
			background: #fff;

			.left {
				display: flex;

				.day {
					margin-left: 10px;
				}

				i {
					margin-left: 4px;
					font-size: 12px;
					font-weight: 700;
					color: #c2c2c2;
				}
			}

			.right {
				font-size: 12px;
			}
		}
	}

	.list {
		padding: 14px;
		margin-top: 94px;

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
							}

							.uid {
								margin-top: 2px;
								font-size: 12px;
								color: #909399;
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
					.commission {
						font-size: 20px;
						color: #f56c6c;
						margin-bottom: 5px;
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
</style>
