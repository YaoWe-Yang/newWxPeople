<!-- 会员模块 -->
<template>
	<u-popup v-if="config" v-model="visible" mode="bottom" border-radius="32" safe-area-inset-bottom="true"
		closeable="true">
		<view class="vipTitle" @click="createOrder()">{{title}}</view>
		<view class="level">
			<view class="title">会员特权：</view>

			<u-table border-color="#edb060" align="left" color="#323233">
				<u-tr>
					<u-th>类型</u-th>
					<u-th>普通用户</u-th>
					<u-th>会员</u-th>
				</u-tr>
				<u-tr>
					<u-td>查看群</u-td>
					<u-td>-2积分</u-td>
					<u-td>免积分</u-td>
				</u-tr>
				<u-tr>
					<u-td>发布群</u-td>
					<u-td>-{{config.quncard.add_require_gold}}积分</u-td>
					<u-td>免积分</u-td>
				</u-tr>
				<u-tr>
					<u-td>签到积分</u-td>
					<u-td>+{{config.gold.reward.checkin}}积分</u-td>
					<u-td>+{{config.gold.reward.vip_checkin}}积分</u-td>
				</u-tr>
				<u-tr>
					<u-td>邀请积分</u-td>
					<u-td>+{{config.gold.reward.invite}}积分</u-td>
					<u-td>+{{config.gold.reward.vip_invite}}积分</u-td>
				</u-tr>
				<u-tr>
					<u-td>查看精准群/名片</u-td>
					<u-td>-</u-td>
					<u-td>支持</u-td>
				</u-tr>
			</u-table>
			<view class="tips">积分用于发布/置顶平台的群/个人名片</view>
		</view>
		<view class="wrap">
			<view class="list">
				<view class="item" v-for="(item, key) in config.vip.charge" :key="key" :class="{active:charge_key==key}"
					@click="charge_key=key">
					<view class="price">
						<span>¥</span>{{item.price/100}}
					</view>
					<view class="pldprice">
						<span>¥</span>{{item.original_price/100}}
					</view>
					<view class="time">{{item.name}}</view>
				</view>
			</view>
			<!-- <view v-if="$scopedSlots.tips" class="tips"> -->
			<view class="tips">
				<i>&#xe651;</i>
				<slot name="tips"></slot>
			</view>

			<view class="btnVipIos" v-if="platform==='ios'">IOS端因<text>《微信政策》</text>无法支付，请使用安卓或PC进行开通使用，如有其它疑问，请<button open-type='contact' send-message-title="IOS支付问题" send-message-path="pages/rm/me/Index" show-message-card="true" session-from='IOS支付问题' class="text" plain="true">联系客服</button></view>
			<view class="btnVip" @click="createOrder()" v-else>确认开通</view>
		</view>
	</u-popup>
</template>
<script>
	import {
		Base
	} from '@/store/base.js';
	export default {
		props: {
			title: {
				type: String,
				default: '二维码'
			},
		},
		data() {
			return {
				visible: false,
				charge_key: null,
				platform: uni.getSystemInfoSync().platform,
			};
		},
		computed: {
			config() {
				return this.$store.state.config;
			}
		},
		created() {},
		methods: {

			show() {
				this.visible = true;
				this.charge_key = this.config.vip.charge.length - 1;
			},
			hide() {
				this.visible = false;
			},
			createOrder() {
				const self = this;
				var base = new Base();
				var params = {
					url: 'createOrder',
					type: 'post',
					data: {
						type: 'vip',
						charge_key: self.charge_key
					},
					sCallBack: function(res) {
						uni.navigateTo({
							url: '/pages/rm/Pay?trade_no=' + res.trade_no
						})
					}
				}
				base.request(params);
			}
		},
	};
</script>
<style lang="scss" scoped>
	@font-face {
		font-family: "iconfont";
		/* project id 2295299 */
		src: url("//at.alicdn.com/t/font_2295299_j89jox4v6p.eot");
		src: url("//at.alicdn.com/t/font_2295299_j89jox4v6p.eot?#iefix") format("embedded-opentype"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.woff2") format("woff2"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.woff") format("woff"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.ttf") format("truetype"),
			url("//at.alicdn.com/t/font_2295299_j89jox4v6p.svg#iconfont") format("svg");
	}

	i {
		font-family: "iconfont";
		font-size: 28upx;
		font-style: normal;
	}

	.vipTitle {
		-webkit-flex-shrink: 0;
		flex-shrink: 0;
		font-weight: 500;
		font-size: 16px;
		line-height: 48px;
		text-align: center;
	}

	.level {
		padding: 0 16px;

		.title {
			font-size: 14px;
			margin-bottom: 6px;
		}

		.tips {
			font-size: 12px;
			margin-top: 6px;
			color: #999;
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx;

		.list {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			justify-content: space-between;

			.item {
				text-align: center;
				border: 1px solid rgba(237, 176, 96, 0.2);
				width: 26%;
				border-radius: 4px;
				overflow: hidden;

				width: 30%;

				.price {
					font-size: 26px;
					color: rgb(237, 176, 96);
					font-weight: 600;
					padding-top: 18px;
					padding-bottom: 6px;

					span {
						font-size: 14px;
						font-weight: 300;
						margin-right: 3px;
					}
				}

				.pldprice {
					padding-bottom: 14px;
					color: #909399;
					text-decoration: line-through;
				}

				.time {
					background: rgb(249, 236, 219);
					padding: 6px 0;
				}
			}

			.item.active {
				border: 1px solid rgba(237, 176, 96, 1);

				.time {
					background: rgb(229, 186, 121);
				}
			}
		}

		.tips {
			width: 100%;
			color: #999;
			font-size: 13px;
			margin-top: 12px;

			i {
				margin-right: 5px;
				font-size: 12px;
				color: #edb060;
				width: 12px;
				float: left;
			}
		}

		.btnVip {
			background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
			color: #fff;
			text-align: center;
			font-size: 16px;
			height: 50px;
			line-height: 50px;
			width: 80%;
			margin-top: 20px;
			border: 0;
			border-radius: 200rpx;
		}

		.btnVipIos {
			margin-top: 20px;

			.text {
				// background-color: transparent;
				border: none;
				color: #00007f;
				display: initial;
				font-size: 15px;
				padding: 0;
				position: absolute;
				line-height: inherit;
			}
		}
	}
</style>
