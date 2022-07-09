<template>
	<div class="page">
		<u-sticky>
			<u-tabs ref="tabs" :list="tabList" :current="current" :is-scroll="false" font-size="28"
				inactive-color="#323233" bar-width="80" @change="change">
			</u-tabs>
		</u-sticky>

		<div class="list">

			<list v-model="list.loading" :finished="list.finished" @load="$getList('adAdd', list)">
				<div class="item" v-for="(item, key) in list.data" :key="key">
					<div class="attr">
						<div class="item">
							<div class="label">粉丝地区：</div>
							<div class="value">{{item.region}}</div>
						</div>
						<div class="item">
							<div class="label">粉丝性别：</div>
							<div class="value">{{item.sex}}</div>
						</div>
						<div class="item">
							<div class="label">已投放：</div>
							<div class="value">{{item.showed_num}}/{{item.show_num}}</div>
						</div>
					</div>
					<div class="ad">
						<div class="image">
							<u-image :src="item.ad_image" mode="widthFix" width="140"
								@click="$imagePreview([item.ad_image])"></u-image>
						</div>
						<div class="text">{{item.ad_text}}</div>
					</div>
					<div class="bottom">
						<div class="left">
							<template v-if="item.status==1 && item.is_hidden==0"><text style="color: #ff9900;">审核中</text></template>
							<template v-if="item.status==2 && item.is_hidden==0"><text style="color: #19be6b;">代发中</text></template>
							<template v-if="item.status==3 && item.is_hidden==0"><text style="color: #fa3534;">已结束</text></template>
							<template v-if="item.is_hidden==1"><text style="color: #fa3534;">已被管理员隐藏</text></template>
						</div>
						<div class="btns">
							<u-button type="primary" size="mini" @click="showNote(item.id)">查看详情</u-button>
						</div>
					</div>
				</div>
				<view class="dfAd" @click="$go('Add')">代发广告</view>
			</list>
			<empty class="tips" description="暂无数据" error="true" v-if="list.data.length==0">
				<template #tips>
					<u-button class="btn-add" type="success" @click="$go('Add')" :ripple="true">代发广告</u-button>
				</template>
			</empty>


			<u-popup v-model="note_dialog.visible" title="已向以下用户推送了你的广告" mode="bottom" border-radius="32"
				closeable="true" height="600rpx">
				<div class="users">
					<div class="item" v-for="(item, key) in note_dialog.list.data" :key="key">
						<div class="user">
							<div class="avatar">
								<u-image :src="item.user.avatar" mode="widthFix" width="76"
									@click="$imagePreview([item.user.avatar])"></u-image>
							</div>
							<div class="info">
								<div class="nickname">{{item.user.nickname}}</div>
								<div class="time">{{item.create_time | formatDate}}</div>
							</div>
						</div>
					</div>
					<!-- <empty image-size="90px"
						v-if="!note_dialog.list.loading && note_dialog.list.finished && note_dialog.list.data.length==0">
						<template #description>
							<p>暂无数据</p>
						</template>
					</empty> -->
					<empty class="tips" v-if="note_dialog.list.data.length==0" description="暂无数据">
					</empty>
				</div>
			</u-popup>

		</div>
	</div>
</template>

<script>
	// import list from '@/pages/rm/ad/_Mgr_list.vue'
	import Empty from '@/pages/rm/components/Empty.vue'
	import {
		Base
	} from '@/store/base.js';

	export default {
		components: {
			Empty,
			// list
		},
		data() {
			return {
				note_dialog: {
					visible: false,
					ad_id: 0,
					list: {
						loading: false,
						finished: false,
						page: 1,
						query: {},
						total: 0,
						data: []
					}
				},
				list: {
					loading: false,
					finished: false,
					page: 1,
					query: {
						type: 'all'
					},
					total: 0,
					data: []
				},
				tabList: [{
					name: '全部',
					type: 'all'
				}, {
					name: '代发中',
					type: 'showing'
				}, {
					name: '已结束',
					type: 'finished'
				}],
				current: 0,
				type: 'all',
			};
		},
		created() {
			// let query = this.$route.query;
			// this.type = query.type ? query.type : 'all';
			this.list.query.type = this.type;
			this.showAd();
		},
		methods: {
			showAd() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'getAdList',
					data: {
						type: that.type
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							that.list.data = res.list.data;
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
			},
			onNavBarRightBtnClick() {
				this.$go('/ad/add')
			},
			change(index) {
				this.current = index;
				this.type = this.tabList[index].type;
				this.showAd();
			},
			showNote(ad_id) {
				this.note_dialog.list = {
					loading: false,
					finished: false,
					page: 1,
					query: {},
					total: 0,
					data: []
				};
				this.note_dialog.ad_id = ad_id;
				this.note_dialog.visible = true;
				var base = new Base();
				var that = this;
				var params = {
					url: 'getNoteList',
					data: {
						id: ad_id
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							that.note_dialog.list.data = res.list.data;
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
			}
		},
	};
</script>


<style lang="scss" scoped>
	.van-tabs {}

	.list {
		display: flex;
		flex-direction: column;
		background: #f8f8f8;
		min-height: 100vh;
		padding: 10px;

		.item {
			border-radius: 8px;
			padding: 8px 8px;
			border-radius: 8px;
			background: #fff;
			margin-bottom: 8px;
			box-shadow: 0px 0 3px #ebedf0;
			position: relative;
			overflow: hidden;

			.attr {
				display: flex;
				justify-content: space-between;
				color: #909399;
				font-size: 14px;
				padding: 0 2px;

				.item {
					display: flex;
					flex-wrap: wrap;
					margin: 0 1px;
					align-items: center;

					.amount {
						color: #ee0a24;
						font-weight: 700;
					}
				}
			}

			.ad {
				display: flex;
				background: #f8f8f8;
				padding: 10px;
				margin-top: 5px;

				.image {
					border-radius: 2px;
					overflow: hidden;
					width: 70px;
					height: 70px;

					img {
						width: 100%;
					}
				}

				.text {
					flex: 1;
					margin-left: 6px;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					height: 70px;
					line-height: 1.8;
					color: #333;
				}
			}

			.bottom {
				margin-top: 5px;
				display: flex;
				justify-content: space-between;

				.left {
					display: flex;
					align-items: center;
					color: #909399;
				}

				.btns {
					display: flex;
					justify-content: flex-end;
				}
			}

			.top {
				position: absolute;
				top: -3px;
				left: -26px;
				width: 70px;
				height: 27px;
				line-height: 34px;
				background: #f6e488;
				transform: rotate(-45deg);
				text-align: center;
				font-size: 12px;
				color: #d64431;
			}
		}

		.btn-ac {
			margin-left: 10px;
		}

		.btn-add {
			margin-top: 30px;
			width: 60%;
		}
	}

	.users {
		overflow: auto;
		padding: 40rpx;

		.user {
			display: flex;
			margin: 0 10px;
			margin-bottom: 10px;
			padding: 5px 0;
			position: relative;

			.avatar {
				width: 40px;
				height: 40px;
				overflow: hidden;
				border: 1px solid #f1f1f1;
				border-radius: 4px;

				img {
					width: 100%;
				}
			}

			.info {
				padding: 0 10px;

				.time {
					font-size: 12px;
					color: #909399;
					margin-top: 4px;
				}
			}
		}

		.user::after {
			content: "";
			position: absolute;
			left: 50px;
			right: 0;
			bottom: 0;
			border-bottom: 1px solid #f8f8f8;
		}
	}
	
	.dfAd{
			    position: fixed;
			    bottom: 20%;
			    right: 8%;
			    width: 40px;
			    height: 40px;
			    background-color: #19be6b;
			    padding: 6px;
			    font-size: 11px;
			    border-radius: 50%;
			    text-align: center;
			    line-height: 14px;
			    color: #ffffff;
				z-index: 2;
	}
</style>
