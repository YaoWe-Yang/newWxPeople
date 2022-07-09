<template>
	<div class="page">
		<div class="header">
			<div class="top">
				<div class="right">
					<u-search background="#fff" v-model="list.query.words" placeholder="搜索激活码名称" animation="false" />
				</div>
			</div>
		</div>
		<div class="list">
			<list class="van-list">
				<div v-for="(item, key) in list.data" class="item" :key="key">
					<div class="invite-info" @click="$go('List?name='+item.j_name+'&num='+config.code_num)">
						UID:{{item.user.uid}}「{{item.user.nickname}}」
						<div style="float: right;color: red;">已用{{item.yynum}}个
						</div>
					</div>
					<div class="top">
						<div class="left" @click="$go('List?name='+item.j_name+'&num='+config.code_num)">
							<div>{{item.j_name}}</div>
						</div>
						<div class="right">
							<div class="type">
								<switch checked @change="switchChange(item.j_name,false)" style="transform:scale(0.8)"
									v-if="item.enum == '1'" />
								<switch @change="switchChange(item.j_name,true)" style="transform:scale(0.8)" v-else />
							</div>
						</div>
					</div>
				</div>
			</list>
			<empty class="tips" v-if="list.data.length==0" description="暂无数据">
			</empty>

			<view class="addJhm" @click="showJhm = 'true'">新增</view>
		</div>
		<u-modal v-model="showJhm" title="新增激活码" show-cancel-button="true" @confirm="addJhm">
			<div class="jhmDiv">
				<input type="text" placeholder="请输入激活码名称" @input="onKeyInput" />
				<div>目前系统默认开卡{{config.code_num}}个</div>
			</div>
		</u-modal>
		
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
				jhmShow:false,
				showJhm: false,
				jhmText: '',
				info: '',
				list: {
					loading: false,
					finished: false,
					page: 1,
					query: {
						words: ''
					},
					total: 0,
					data: []
				}
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
			config() {
				return this.$store.state.config;
			}
		},
		onLoad() {
			this.subPost();
		},
		methods: {
			onKeyInput: function(event) {
				this.jhmText = event.target.value
			},
			addJhm() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/addJhm',
					type: 'post',
					data: {
						text: that.jhmText
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							that.$toast(res.msg);
							that.subPost();
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
			},
			switchChange(name,type) {
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/typeJhm',
					type: 'post',
					data: {
						name: name,
						type:type
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							that.$toast(res.msg);
							that.subPost();
						} else {
							that.$toast(res.msg);
						}
					}
				}
				base.request(params);
			},
			subPost() {
				var base = new Base();
				var that = this;
				var params = {
					url: 'sys/getJhmList',
					type: 'post',
					data: {
						page: that.list.page,
						order: 'create_time',
						query_type: 'name',
						query_value: that.list.query.words,
					},
					sCallBack: function(res) {
						if (res.code !== 0) {
							that.$toast(res.msg);
						} else {
							var arr = new Array();
							if (that.list.page == 1) {
								that.list.data = res.list.data
							} else {
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
				align-items: center;
				margin-top: 10px;

				.left {
					flex: 1;
					margin-right: 10px;
					overflow: hidden;
					div{
						font-size: 30rpx;
						font-weight: 700;
					}
				}

				.right {
					.type {
						align-items: center;
						padding: 0 4px;
						border-radius: 2px;
						font-size: 12px;
						display: inline-block;
						float: right;
					}
				}
			}
		}
	}

	.addJhm {
		position: fixed;
		bottom: 20%;
		right: 8%;
		width: 80rpx;
		height: 80rpx;
		background-color: #19be6b;
		padding: 10rpx;
		font-size: 24rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 70rpx;
		color: #ffffff;
		z-index: 2;
	}

	.jhmDiv {
		padding: 60rpx;
		text-align: center;

		input {
			min-height: 70rpx;
			background-color: #f3f3f3;
			border-radius: 100rpx;
		}

		div {
			color: #ff5959;
			font-size: 24rpx;
			font-weight: 700;
			padding-top: 40rpx;
		}
	}
</style>
