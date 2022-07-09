<template>
	<div class="page">

		<div class="list">
			<list v-model="list.loading" :finished="list.finished" @load="$getList('getMyQunList', list)">
				<div v-for="(item, key) in list.data" class="item" :key="key">
					<div class="avatar">
						<u-lazy-load :image="item.avatar" mode="widthFix"></u-lazy-load>
					</div>
					<div class="profile">
						<div class="nickname">{{item.name}}</div>
						<div class="summary">
							<span v-if="item.num>0"><i>&#xe6da;</i>{{item.num}}人</span>
						</div>
						<!-- <u-count-down class="top_time" v-if="item.is_top" :time="item.top_countdown*1000"
							format="置顶中：HH:mm:ss" /> -->
							<view v-if="item.is_top" class="top_time">
								置顶中：
								<u-count-down :timestamp="item.top_countdown" bg-color="" font-size="24rpx" color="#9a9a9a"
									separator-color="#9a9a9a"show-days="false"></u-count-down>
							</view>
					</div>
					<div class="btns">
						<template v-if="item.status==1">
							<u-button style="margin-left:10px" type="warning" size="medium "
								@click="top_dialog.quncard=item; top_dialog.visible=true">置顶</u-button>
							<u-button style="margin-left:10px" type="default" size="medium " @click="del(item)">删除
							</u-button>
						</template>
					</div>
				</div>
				<view class="dfAd" @click="$go('Add')">发布微群</view>
			</list>
			<!-- <van-empty image-size="90px" v-if="!list.loading && list.finished && list.data.length==0">
        <template #description>
          <p>暂无数据</p>
          <van-button class="btn-add" type="primary" @click="$go('add')">发布微信群</van-button>
        </template>
      </van-empty> -->
			<empty class="tips" description="暂无数据" error="true" v-if="list.data.length==0">
				<template #tips>
					<u-button class="btn-add" type="success" :custom-style="customStyle" @click="$go('Add')"
						:ripple="true">发布微信群</u-button>
				</template>
			</empty>
		</div>
		<u-action-sheet v-if="config" title="置顶时间" v-model="top_dialog.visible" :list="chargeList" @click="onConfirmTop"
			cancel-text="关闭" />
		<gold-recharge ref="goldRecharge" title="积分充值" ></gold-recharge>
	</div>
</template>

<script>
	import Empty from '@/pages/rm/components/Empty.vue'
	import GoldRecharge from '@/pages/rm/components/GoldRecharge.vue';
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			Empty,
			GoldRecharge
		},
		data() {
			return {
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
				top_dialog: {
					visible: false,
					quncard: null
				},
				customStyle: {
					width: '60%'
				}
			};
		},
		computed: {
			user() {
				return this.$store.state.user;
			},
			config() {
				return this.$store.state.config;
			},
			chargeList() {
				let list = [];
				var top_charge = this.config.quncard.top_charge;
				top_charge.forEach((item, id) => {
					list.push({
						id: id,
						text: item.name,
						subText: item.desc,
					})
				});
				return list;
			}

		},
		created() {},
		onLoad() {
			this.loadQunList();
		},
		methods: {
			loadQunList() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'getMyQunList',
					sCallBack: function(res) {
						if (res.code == 0) {
							that.list.data = res.list.data
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
			},
			onNavBarRightBtnClick() {
				this.$go('add');
			},
			onConfirmTop(e) {
				console.log(e)
				var base = new Base();
				var that = this;
				var params = {
					url: 'topQun',
					type: 'post',
					data: {
						id: that.top_dialog.quncard.id,
						charge_id: e
					},
					sCallBack: function(res) {
						uni.hideLoading();
						if (res.code == 2) {
							uni.showModal({
								title: '提示',
								content: '积分不足，请先充值积分',
								cancelText: '暂不充值',
								confirmText: '充值积分',
								confirmColor:'#19be6b',
								success: function (res) {
								        if (res.confirm) {
								            that.$refs.goldRecharge.show();
								        }
								    }
							});
							return;
						}
						that.loadQunList();
					}
				}
				base.request(params);
			},
			del(qun) {
				var myList = this.list.data;
				uni.showModal({
					title: '提示',
					content: '确认删除',
					confirmColor: '#EE0A24',
					success: function(res) {
						if (res.confirm) {
							var base = new Base();
							// var that = this;
							var params = {
								url: 'delQun',
								type: 'post',
								data: qun,
								sCallBack: function(res) {
									uni.hideLoading();
									if (res.code == 0) {
										myList.splice(myList.indexOf(qun), 1);
										uni.showToast({
											title: '删除成功',
											duration: 2000
										});
									} else {
										uni.showToast({
											title: res.msg,
											duration: 2000
										});
									}

								}
							}
							base.request(params);
						}
					}
				});
			}
		},
	};
</script>


<style lang="scss" scoped>
	.page {
		background: #fff;
		padding-bottom: 50px;
	}

	.list {
		.item {
			margin-top: 20px;
			display: flex;
			padding: 0 20px;
			position: relative;
			padding-bottom: 10px;

			.avatar {
				width: 46px;
				height: 46px;
				overflow: hidden;
				border-radius: 3px;
				margin-right: 18px;

				img {
					width: 100%;
					vertical-align: middle;
				}
			}

			.profile {
				flex: 1;
				overflow: auto;

				.summary {
					font-size: 12px;
					color: #9a9a9a;
					display: flex;
					align-items: flex-end;

					i {
						margin-top: -4rpx;
						margin-right: 6rpx;
						float: left;
					}
				}

				.top_time {
					font-size: 12px;
					color: #9a9a9a;
				}
			}

			.profile>div+div {
				margin-top: 6px;
			}

			.btns {
				display: flex;
				align-items: center;
			}
		}

		.item::after {
			content: "";
			position: absolute;
			left: 0px;
			right: 0;
			bottom: 0;
			border-bottom: 1px solid #f1f1f1;
		}

		.item:last-child::after {
			border-bottom: 0;
		}
	}

	.btn-add {
		margin-top: 30px;
		width: 60%;
	}

	.tips {
		position: absolute;
		width: 100%;
		margin-top: 100rpx;
	}

	.dfAd {
		position: fixed;
		bottom: 20%;
		right: 6%;
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
