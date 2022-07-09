<template>
	<view class="">
		<view class="listItem" v-for="(item, index) in list" :key="index"
			@click="pageUserMsg(item.receive.uid,item.receive.nickname)">
			<view class="avatar">
				<u-badge type="error" :is-dot="true" class="badge" v-if="item.num>=10"></u-badge>
				<u-badge type="error" :count="item.num" class="badge" v-else></u-badge>
				<u-lazy-load :image="item.receive.avatar" mode="widthFix" border-radius="10"></u-lazy-load>
			</view>

			<view class="profile">
				<view class="nickname">
					{{item.receive.nickname}}
				</view>
				<view class="row">
					<rich-text :nodes="item.content"></rich-text>
				</view>
			</view>

			<view class="time">
				{{item.update_time?item.update_time:item.create_time | formatDiffDate}}
			</view>

			<view class="hr">
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Base
	} from '@/store/base.js';
	var base = new Base();
	export default {
		data() {
			return {
				list: null,
			};
		},
		computed: {
			config() {
				return this.$store.state.config;
			}
		},
		created() {},
		onShow() {
			this.getMsgList();
		},
		methods: {
			// 获取列表
			getMsgList() {
				const self = this;
				var params = {
					url: 'getMsgList',
					sCallBack: function(res) {
						console.log(res);
						self.list = res.list.data;
					}
				}
				base.request(params,true,false);
			},
			pageUserMsg(uid, name) {
				uni.navigateTo({
					url: "/im/pageUserMsg?uid=" + uid + "&title=" + name
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	.listItem {
		display: flex;
		padding: 20rpx 40rpx;
		position: relative;
		padding-bottom: 20rpx;

		.avatar {
			width: 92rpx;
			height: 92rpx;
			overflow: hidden;
			border-radius: 6rpx;
			margin-right: 36rpx;

			.badge {
				position: absolute;
				top: -8rpx;
				left: 100rpx;
				width: 60rpx;
			}
		}

		.profile {
			padding-top: 14rpx;

			.row {
				font-size: 22rpx;
				color: #a5a5a5;
				width: 400rpx;
				display: inline-block;
				overflow: hidden;
				word-break: keep-all;
				white-space: nowrap;
				text-overflow: ellipsis;
				height: 48rpx;
				line-height: 48rpx;
			}
		}

		.time {
			position: absolute;
			right: 40rpx;
			font-size: 22rpx;
			color: #a5a5a5;
			text-align: right;
			padding-top: 14rpx;
		}

		.hr {
			position: absolute;
			width: 77%;
			bottom: 0;
			border-bottom: 1rpx solid #0000000f;
			right: 0;
		}
	}
</style>
