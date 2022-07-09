<template>
	<view class="page">
		<view class="bpage">
		</view>
		<view class="row">
			<view class="item" v-for="(item,index) in toolList" @click="getNav(item)">
				<view class="type">
					<view style="color: #1989FA;" v-if="item.type == '1'"><i class="myfont">&#xe628;</i></view>
					<view style="color: #DD6161;" v-else-if="item.type == '2'"><i class="myfont">&#xe633;</i></view>
					<view style="color: #07C160;" v-else-if="item.type == '3'"><i class="myfont">&#xe63e;</i></view>
					<view style="color: #07C160;" v-else-if="item.type == '4'"><i class="myfont">&#xe623;</i></view>
				</view>
				<u-lazy-load :image="item.image" img-mode="aspectFill" height="280" border-radius="10">
				</u-lazy-load>
				<view class="sort">
					<i class="myfont">&#xe61d;{{item.num}}</i>
				</view>
				<view class="title">
					{{item.name}}
				</view>
				<view class="des">
					{{item.des}}
				</view>
			</view>
		</view>

		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>

		<show-qrcode ref="kfQrcode" title="转发或保存识别进入" />
	</view>

</template>

<script>
	import ShowQrcode from "@/pages/rm/components/ShowQrcode.vue";
	import {
		Base
	} from '@/store/base.js';
	export default {
		components: {
			ShowQrcode,
		},
		data() {
			return {
				tabbar: this.$store.state.tabbar,
				page: 1,
				toolList: ''
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
			this.getTool();
		},
		onShow() {
			this.page = 1;
			this.getTool();
		},
		methods: {
			getTool() {
				const self = this;
				var base = new Base();
				var params = {
					url: 'sys/getTool',
					type: 'post',
					data: {
						page: self.page
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							var arr = new Array();
							if (self.page != 1) {
								self.toolList = arr.concat(self.toolList, res.list.data);
							} else {
								self.toolList = res.list.data;
							}
						}
					}
				}
				base.request(params);
			},

			getNav(item) {
				const self = this;
				var base = new Base();
				var params = {
					url: 'sys/getLookTool',
					type: 'post',
					data: {
						id: item.id
					},
					sCallBack: function(res) {
						if (res.code == 0) {
							if (item.type == 1) {
								self.$go(item.url);
							} else if (item.type == 2) {
								self.$refs.kfQrcode.show(item.url);
							} else if (item.type == 3) {
								uni.navigateToMiniProgram({
									appId: item.appid,
									path: item.url,
									extraData: {
										// 'data1': 'test'
									},
									success(res) {
										// 打开成功
									}
								})
							} else {
								uni.navigateTo({
									url: "/components/linkOthers/linkOthers?url=" + encodeURIComponent(item
										.url) + "&title=" + item.des + "&img=" + item.image
								});
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
			this.page = this.page + 1
			this.getTool();
		},
	}
</script>

<style lang="scss" scoped>
	.page {
		.bpage {
			position: fixed;
			width: 100%;
			height: 100vh;
			background-color: #5098ff;
			z-index: -1;
		}

		.row {
			width: 100%;
			height: auto;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 0;
			padding: 0 20rpx;
			box-sizing: border-box;

			.item {
				padding: 20rpx;
				background-color: #ffffffba;
				border-radius: 20rpx;
				width: 49%;
				margin-top: 14rpx;

				.type {
					position: absolute;
					z-index: 1;
					text-align: right;
					margin: -20rpx;
					background-color: #fff;
					padding: 10rpx;
					border-radius: 20rpx 0;
					font-size: 22rpx;

					view {
						i {
							font-size: 50rpx;
						}
					}
				}

				.sort {
					position: relative;
					float: right;
					background: #0000008c;
					color: #ffffff;
					padding: 4rpx 12rpx;
					border-radius: 12rpx 0;
					margin-top: -46rpx;
				}

				.title {
					margin: 10rpx 0;
					background-color: #035ca9;
					border-radius: 0 40rpx;
					text-align: center;
					height: 56rpx;
					line-height: 56rpx;
					color: #ffffff;
				}

				.des {
					font-size: 24rpx;
					height: 56rpx;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
</style>
