<template>
	<div class="page">
		<div class="header">
			<div class="top">
				<div class="right">
					<u-search background="#fff" v-model="list.query.words" placeholder="搜索个人名片名称" animation="false" />
				</div>
			</div>
		</div>
		<div class="list">
			<list class="van-list">
				<div v-for="(item, key) in list.data" class="item" :key="key">
					<div class="invite-info">
						ID:{{item.id}}
						<div style="float: right;" v-if="item.user">（UID:{{item.user.uid}}）{{item.user.nickname}}</div>
						<div style="float: right;" v-else>系统用户</div>
						【{{item.refresh_time | formatDiffDate}}】
					</div>
					<div class="top">
						<div class="left">
							<div class="userinfo">
								
								<scroll-view class="avatar">
									<image :src="item.avatar" mode="widthFix" style="width: 84rpx; border-radius: 12rpx;" @click="$imagePreview([item.avatar])"></image>
								</scroll-view>
								<view class="profile">
									<view class="nickname">
										<text class="userCardNickname">{{item.nickname}}</text>
										<i class="sexIcon man" v-if="item.sex=='男'" style="float:left">&#xe7b2;</i>
										<i class="sexIcon woman" v-else-if="item.sex=='女'">&#xe7b1;</i>
									</view>
									<view class="region" v-if="item.region!=''">{{item.region?item.region:''}}</view>
									<view class="summary" v-if="item.summary!=''">{{item.summary?item.summary:''}}</view>
								</view>
							</div>
						</div>
						<div class="right">
							<div class="type">
								<switch checked @change="switchChange(item.id)" style="transform:scale(0.8)" v-if="item.status" />
								<switch @change="switchChange(item.id)" style="transform:scale(0.8)" v-else />
							</div>
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
			switchChange(id) {
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/delCard',
					type: 'post',
					data: {
						id: id
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							that.$toast(res.msg);
							that.subPost();
						} else {
							that.$toast('更新失败，请联系管理员');
						}
					}
				}
				base.request(params);
			},
			subPost(){
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/getCardList',
					type:'post',
					data: {
						page: that.list.page,
						order:'create_time',
						query_type:'name',
						query_value:that.list.query.words,
					},
					sCallBack: function(res) {
						if (res.code !== 0) {
							that.$toast(res.msg);
						}else{
							var arr = new Array();
							if(that.list.page == 1){
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
	
		@import "@/pages/rm/index.scss";
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
				}

				.right {
					.type {
						margin-bottom: 20rpx;
						padding: 0 4px;
						border-radius: 2px;
						font-size: 12px;
						display: inline-block;
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
	.nickname{
		height: 36rpx;
		padding-top: 0;
	}
	
</style>
